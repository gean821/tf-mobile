# ADR-0002 — Captura de localização foreground com geofencing

- **Status**: Aceito (escopo: Onda 1)
- **Data**: 2026-05-14

## Contexto

Backend define em `TruckFlow/docs/adr/0003-design-tracking-motorista.md` que o app envia localização do motorista para o admin acompanhar trajeto até a unidade. Escopo Onda 1 = **foreground-only**.

App stack atual:
- Sem `expo-location` instalado.
- Sem permissões de localização declaradas em `app.json` nem `AndroidManifest.xml`.
- Sem `expo-task-manager`.
- Sem armazenamento offline além de `expo-secure-store` (token).

## Decisão

### Stack

- **`expo-location`** como lib primária.
- **`expo-task-manager`** apenas para o caso de foreground service Android (não para background tracking).
- **`expo-sqlite`** como buffer offline para pings (alternativa: AsyncStorage; SQLite é mais robusto para batch sequencial).

### Permissões

**iOS** (`app.json` em `ios.infoPlist`):
```
NSLocationWhenInUseUsageDescription: "TruckFlow usa sua localização durante 
  agendamentos ativos para que a fábrica acompanhe sua chegada."
```

**Android** (via plugin `expo-location` no `app.json`):
```
- ACCESS_COARSE_LOCATION
- ACCESS_FINE_LOCATION
- FOREGROUND_SERVICE
- FOREGROUND_SERVICE_LOCATION
```

**NÃO declarar `ACCESS_BACKGROUND_LOCATION`** — Play Store revisa caso-a-caso e atrasa release. Foreground service cobre os casos da Onda 1.

### Fluxo de captura

**Start**: motorista entra na tela `ticketAgendamento.tsx` de um agendamento em status `Agendado` ou `EmAndamento`.
- Hook `useTracking(agendamentoId)`:
  1. Verifica preferência do motorista (toggle "compartilhar localização durante agendamentos").
  2. Verifica permissão. Se ainda não pedida, mostra modal de aviso (texto LGPD) antes de chamar `requestForegroundPermissionsAsync()`.
  3. Chama `Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, { ... })` com config:
     - `accuracy: Location.Accuracy.Balanced` (BestForNavigation drena bateria)
     - `timeInterval: 30000` (30s)
     - `distanceInterval: 100` (100m — o que vier primeiro entre tempo e distância)
     - `foregroundService` (Android): título "TruckFlow ativo", ícone, descrição "Compartilhando localização com a fábrica X".

**Task handler** (registrado uma vez em `src/services/location/LocationTask.ts`):
- Recebe lote de localizações do SO.
- Filtro de qualidade: descarta accuracy >50m.
- Aplica geofencing: se distância até `empresa.lat/lng` < 200m, marca `Location.hasStartedLocationUpdatesAsync` → para o serviço.
- Salva no buffer SQLite.
- Tenta flush imediato via HTTP. Se falhar, marca pendente.

**Flush**:
- Worker leve em `useEffect` no `_layout.tsx` reativo a `NetInfo` (conexão recuperou) → drena buffer SQLite.
- Cada batch limita a 50 pontos por request (`POST /v1/motorista/posicao` em batch).
- Sucesso → deleta do buffer. Falha → retry em backoff (30s, 2min, 10min).

**Stop**:
- Motorista sai da tela do ticket → mantém capturando? **Não** — para imediatamente. Se voltar à tela, retoma.
- Agendamento muda de status para `Finalizado` / `Cancelado` (via SSE ou refetch) → para imediatamente.
- App vai pra background e fica >5min sem interação → para (foreground service não justifica mais).

### Aviso de privacidade na 1ª captura

Modal full-screen explicando:
- O que: localização compartilhada com a fábrica.
- Quando: apenas durante agendamentos ativos (status `Agendado` ou `EmAndamento`).
- Quanto tempo: 90 dias de histórico, depois apagado automaticamente.
- Como revogar: tela de preferências OU botão "Excluir meu histórico de localização" (chama `DELETE /v1/motorista/eu/historico-localizacao`).
- Botões: "Aceitar e ativar" / "Recusar".

Recusa = motorista não envia localização, admin não vê — agendamento funciona normal sem tracking.

### Tela de preferências

`app/(app)/usuario/perfil/privacidade.tsx`:
- Toggle "Compartilhar localização durante agendamentos".
- Botão "Excluir histórico" com confirmação dupla.
- Link para termos de uso atualizados.

## Consequências

**Positivas**:
- Foreground service Android permite captura com tela bloqueada **sem** `ACCESS_BACKGROUND_LOCATION` (não é tecnicamente background — é foreground com notificação persistente).
- Buffer SQLite + retry resiliente a perda de conectividade na rodovia.
- Geofencing client + server (defesa em profundidade) elimina captura desnecessária dentro da fábrica.
- LGPD endereçada por design: opt-in explícito, retenção definida, revogação funcional.
- Sem `expo-background-fetch` evita política rígida de iOS (que limita execução em background a janelas curtas e imprevisíveis).

**Negativas**:
- Foreground service Android exige notificação persistente — pode incomodar motorista (mitigação: texto da notificação explica o motivo).
- iOS limita foreground service por inatividade prolongada — captura para após algum tempo de tela bloqueada (limitação do SO).
- Bundle do app cresce com `expo-location` + `expo-task-manager` + `expo-sqlite` (~3-5MB).
- Configurar foreground service exige novo build EAS — não dá OTA.

## Alternativas consideradas

**A1. Background tracking com `ACCESS_BACKGROUND_LOCATION` + `startLocationUpdatesAsync` em modo background.**
Rejeitada para Onda 1. Revisão Play Store caso-a-caso (atraso semanas). iOS exige justificativa forte na App Store. Reavaliar Onda 2 para ETA preditivo.

**A2. Polling client-side com `getCurrentPositionAsync()` em loop.**
Rejeitada. Drena bateria, para quando tela bloqueia, sem foreground service não roda em background nem com app aberto fora da tela do ticket.

**A3. AsyncStorage em vez de SQLite para buffer offline.**
Rejeitada. AsyncStorage não suporta operações batch atômicas e fica pesado com milhares de entries (motorista offline por 2h em batch de 100m = ~700 pontos).

**A4. Sem geofencing client, deixar backend filtrar.**
Rejeitada. Geofencing client economiza bateria do motorista (~30% em viagens longas) e dados móveis. Backend filtrar é só defesa em profundidade.

**A5. Captura sempre ativa enquanto app aberto, sem condicionar a agendamento ativo.**
Rejeitada. LGPD: princípio de finalidade. Localização só faz sentido durante agendamento. Captura fora disso é desnecessária e cria risco jurídico.

## Referências

- Backend ADR-0003: `TruckFlow/docs/adr/0003-design-tracking-motorista.md`
- [ADR-0003](./0003-maps-deep-link.md) — abrir navegação no app de mapas (feature relacionada mas independente de captura).
- Expo Location docs: https://docs.expo.dev/versions/latest/sdk/location/
- Expo TaskManager docs: https://docs.expo.dev/versions/latest/sdk/task-manager/
