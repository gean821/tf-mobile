# ADR-0001 — Integração de push notifications (Expo)

- **Status**: Aceito
- **Data**: 2026-05-14

## Contexto

O motorista precisa ser notificado de eventos críticos com tela do celular bloqueada (cancelamento do agendamento, alteração de horário, alerta de janela próxima ao fim). O backend define push como canal automático primário em `TruckFlow/docs/adr/0002-design-notificacoes.md`.

App stack atual:
- Expo 54 + React Native 0.81 (newArchEnabled: true)
- Expo Router 6
- `expo-secure-store` (token JWT)
- `axios` + interceptor de auth em `src/services/http/axios.ts`
- `@tanstack/react-query` + queries em `src/queries/`
- Sem `expo-notifications` instalado hoje.

## Decisão

### Stack

- **`expo-notifications`** + **`expo-device`** como libs.
- Expo Push Service como provider (gratuito, abstrai FCM/APNs).
- Tokens persistidos no backend em `DispositivoUsuario` (1 usuário → N dispositivos).

### Fluxo de registro do token

1. **No login**: após `signIn()` sucesso, dispara `registerForPushNotificationsAsync()`:
   - `Notifications.requestPermissionsAsync()` (pede permissão se ainda não tem).
   - Se aceito, pega `Notifications.getExpoPushTokenAsync({ projectId })`.
   - `POST /v1/motorista/dispositivo { expoPushToken, plataforma, appVersion }`.
2. **Em cada cold start** (boot do app com sessão válida): mesma rotina, idempotente no backend (upsert por token).
3. **Em logout**: `DELETE /v1/motorista/dispositivo` ou marca inativo (decidido no ADR backend; mobile só chama).

Tudo encapsulado em `src/services/PushNotificationService.ts` + hook `usePushRegistration()` chamado em `app/_layout.tsx` raiz.

### Handlers de notificação

Configurado uma única vez no `_layout.tsx` raiz:

- **Recebida em foreground**: `Notifications.setNotificationHandler` com `shouldShowAlert: false` se a notificação for da tela atual (ex: motorista está vendo o ticket que acabou de ser cancelado — sem som de push em cima). Senão, mostra notificação banner.
- **Tocada (background ou closed)**: `Notifications.addNotificationResponseReceivedListener` lê `data.tipo` + `data.agendamentoId` e usa Expo Router para `router.push()` na tela correspondente. Mapa de roteamento centralizado em `src/services/PushNotificationRouter.ts`.

### Tipos de notificação e roteamento

Payload do backend padronizado em `data`:

```ts
data: {
  tipo: 'AgendamentoCancelado' | 'AgendamentoConfirmado' | 'AlertaJanelaProxima' | ...,
  agendamentoId: string,
  // outros campos por tipo
}
```

Cada tipo mapeia para uma rota:
- `AgendamentoCancelado` → `/agendamento/meus-agendamentos`
- `AlertaJanelaProxima` → `/agendamento/ticketAgendamento?id=...`
- (extensível conforme novos tipos)

### Permissões e build

- iOS: Expo cuida do `NSUserNotificationUsageDescription` via plugin `expo-notifications`.
- Android: Expo cuida do canal de notificação default. Adicionar canal customizado para `Critica` com som diferente em `Notifications.setNotificationChannelAsync`.
- **Mudança requer novo build EAS** — não dá pra OTA porque mexe em permissões nativas.

### Preferências do motorista (LGPD + UX)

Tela `app/(app)/usuario/perfil/notificacoes.tsx`:
- Toggle por tipo de notificação (default todos ativos).
- Espelha tabela `UsuarioPreferenciaNotificacao` do backend.
- Hook `usePreferenciasNotificacaoQuery` + mutation pra ativar/desativar.

Motorista que desativa um tipo deixa de receber push **e** in-app daquele tipo (regra do backend).

## Consequências

**Positivas**:
- Implementação simples, ~1 dia de trabalho.
- Sem fee de provider — Expo Push é gratuito sem limites práticos.
- Multi-device por usuário sai de graça (mesma conta no celular pessoal + tablet).
- Receipts (consultados pelo backend) garantem entrega real, não só "enviei".

**Negativas**:
- Vendor lock parcial em Expo Push. Migração futura para FCM/APNs direto requer regenerar tokens.
- Permissão de notificação é opt-in no iOS — se motorista negar, perde o canal e fica só com in-app.
- Mudança de permissão exige reinstalar app no iOS (limitação do SO, não nossa).

## Alternativas consideradas

**A1. FCM + APNs direto (sem Expo Push).**
Rejeitada para MVP. Exige configuração de cada provider, certificados Apple, troca de chave Google. Expo Push abstrai tudo isso. Migrar depois é viável se vendor lock virar problema.

**A2. OneSignal ou outro provider 3rd party.**
Rejeitada. Adiciona conta + custo + SDK pesado. Expo Push cobre o caso de uso.

**A3. Apenas in-app (sem push).**
Rejeitada — motorista dirigindo não vê notificação dentro do app. Cancelamento de última hora vira tragédia.

## Referências

- Backend ADR-0002: `TruckFlow/docs/adr/0002-design-notificacoes.md`
- [ADR-0004](./0004-canal-motorista-admin.md) — eventos motorista→admin que disparam in-app (não push) no admin.
- Expo Notifications docs: https://docs.expo.dev/versions/latest/sdk/notifications/
