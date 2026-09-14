# ADR-0003 — Abrir navegação no app de mapas via deep-link

- **Status**: Aceito
- **Data**: 2026-05-14

## Contexto

Motorista precisa de navegação até o local de descarga. App já tem botão "Abrir no GPS" stub em `app/(app)/agendamento/ticketAgendamento.tsx` (com comentário `/* Lógica do Waze/Maps aqui FUTURAMENTE */`).

Dados disponíveis:
- `UnidadeEntrega.Latitude` / `Longitude` no backend (já no domínio).
- `expo-linking` já instalado.

Não é necessário renderizar mapa **dentro** do app — só abrir o app de mapa preferido do motorista.

## Decisão

### Implementação

Componente `<AbrirNoMapsButton lat={} lng={} />` em `src/components/buttons/`:

```ts
// pseudocódigo descritivo (a implementação real vive no código)
async function abrirNavegacao(lat: number, lng: number) {
  const url = Platform.select({
    ios: `maps://?daddr=${lat},${lng}&dirflg=d`,
    android: `google.navigation:q=${lat},${lng}`,
  });

  const supported = await Linking.canOpenURL(url);
  if (supported) {
    return Linking.openURL(url);
  }
  // Fallback universal (abre Maps em browser)
  return Linking.openURL(
    `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
  );
}
```

### Backend dependency

Garantir que o DTO de retorno de `/v1/AgendamentoMotorista/meus-agendamentos` (e equivalentes) inclui `unidadeDescarga.latitude` e `unidadeDescarga.longitude`. Validar com a Sprint 1.

### UX

- Botão renderizado **apenas** se `lat != null && lng != null`. UnidadeEntrega antiga sem coordenadas: botão escondido (não desabilitado — não confunde motorista com "por que está cinza?").
- Tooltip / label: "Abrir no mapa". Não dizer "Waze" nem "Google Maps" especificamente porque o SO escolhe.
- Sem confirmação prévia — clique abre direto.

### Preferência de app

Não tentar oferecer escolha entre Waze / Google Maps / Apple Maps. O SO já gerencia isso:
- Android: usuário tem app default de mapas configurado nas settings; `google.navigation:` respeita.
- iOS: `maps://` abre Apple Maps por padrão; usuário pode ter Waze como default em alguns iOS recentes.

Adicionar seletor seria complexidade sem retorno claro. Reavaliar se motoristas reclamarem.

## Consequências

**Positivas**:
- Implementação trivial (~30 minutos incluindo testes manuais nas duas plataformas).
- Zero dependência nova — `expo-linking` já instalado.
- Zero permissão extra.
- Zero custo (não usa nenhuma API paga).
- Respeita app preferido do motorista.

**Negativas**:
- Sem feedback "navegação iniciada com sucesso" — motorista é jogado pro outro app e a confirmação visual é estar no app de mapa.
- Se o SO não tem nenhum app de mapas instalado, cai no fallback web (raro mas possível).
- Não controla o tipo de rota (carro, caminhão) — Google Maps no Android pode oferecer perfil caminhão, mas via deep-link não dá pra forçar.

## Alternativas consideradas

**A1. Integrar Google Maps SDK no app e mostrar mapa inline.**
Rejeitada. SDK adiciona ~12MB ao bundle, requer API key com restrição de bundle id, e o caso de uso é "iniciar navegação", não "ver mapa estático". Deep-link cobre 100% do valor com 0% do custo.

**A2. Tela de mapa custom no app com `react-native-maps`.**
Rejeitada. Mesma razão da A1, ainda mais complexa (rota, ETA, traffic — tudo precisaria ser implementado). Não compete com Waze/Google Maps em qualidade de navegação.

**A3. Preferência de app no perfil do motorista (Waze / Google Maps / Apple Maps).**
Rejeitada por ora. SO já cuida. Adicionar é overengineering sem feedback de usuário pedindo.

## Referências

- Backend ADR-0003: `TruckFlow/docs/adr/0003-design-tracking-motorista.md` (seção "Mobile — Maps deep-link")
- Stub atual: `app/(app)/agendamento/ticketAgendamento.tsx` (linha ~312 conforme estado em 2026-05)
- Expo Linking docs: https://docs.expo.dev/versions/latest/sdk/linking/
