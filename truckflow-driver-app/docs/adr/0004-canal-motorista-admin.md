# ADR-0004 — Canal motorista → admin: botão "Vou atrasar / cancelar" no ticket

- **Status**: Aceito
- **Data**: 2026-05-14

## Contexto

Backend ADR-0002 estabelece WhatsApp como **deep-link manual** (não API), o que significa que comunicação informal motorista↔admin pode acontecer fora do sistema. Isso quebra rastreabilidade quando o motorista responde ao WhatsApp pessoal do admin com "vou atrasar 30min" ou "preciso cancelar" — o agendamento não muda de status e o sistema não fica sabendo.

Aurora compliance exige que eventos operacionais críticos (atraso significativo, cancelamento) tenham trilha de auditoria. Solução: dar pro motorista um botão **dentro do app** que vira evento de domínio rastreável.

## Decisão

### Ações do motorista no ticket

Na tela `app/(app)/agendamento/ticketAgendamento.tsx`, **abaixo do botão "Abrir no GPS"**, adicionar dois botões secundários quando o agendamento estiver em status `Agendado` ou `EmAndamento`:

1. **"Vou atrasar"** (warning, amarelo).
2. **"Preciso cancelar"** (danger, vermelho).

### Fluxo "Vou atrasar"

1. Tap abre modal `<AvisarAtrasoModal>`.
2. Motorista seleciona estimativa: chips "15 min", "30 min", "1 h", "+1 h" + opcional campo de texto livre (max 200 chars).
3. Botão "Avisar fábrica" → `POST /v1/agendamento/{id}/eventos` body `{ tipo: 'AtrasoInformado', minutosEstimados, observacao? }`.
4. On success: toast "Fábrica avisada — eles vão tentar ajustar a fila" + modal fecha.
5. Backend cria evento de domínio → handler cria `Notificacao` in-app pro admin via SSE. Status do agendamento **não muda** (atraso é informativo, não decisão).

### Fluxo "Preciso cancelar"

1. Tap abre modal `<CancelarAgendamentoModal>` com aviso explícito ("Cancelar pode gerar penalidade conforme política da fábrica").
2. Motorista seleciona motivo: chips pré-definidos ("Problema mecânico", "Carga indisponível", "Imprevisto pessoal", "Outro") + obrigatório campo texto se "Outro".
3. Botão "Confirmar cancelamento" → confirmação dupla (modal de "Tem certeza?").
4. `POST /v1/agendamento/{id}/cancelar` body `{ motivo, observacao? }`.
5. On success: navega pra `/agendamento/meus-agendamentos`, toast "Agendamento cancelado".
6. Backend muda status para `Cancelado` → dispara evento → admin recebe in-app via SSE.

### Hooks

Arquivos novos em `src/queries/agendamento.queries.ts`:
- `useAvisarAtrasoMutation(agendamentoId)`
- `useCancelarAgendamentoMutation(agendamentoId)`

Ambos seguem padrão de mutations da TanStack Query, com `onSuccess` invalidando `useMeusAgendamentosQuery`.

### UX defensiva

- Botão "Vou atrasar" **não desabilita** após enviar — motorista pode atualizar a estimativa ("achei que seria 30min, vai ser 1h").
- Botão "Preciso cancelar" desabilita após cancelamento confirmado (agendamento já está em status `Cancelado`).
- Se o agendamento foi cancelado pelo admin entre o motorista ver a tela e tocar o botão: backend retorna conflito 409, app mostra "Este agendamento já foi cancelado" + refetch.

## Consequências

**Positivas**:
- Fecha o loop de rastreabilidade que o `wa.me` deixa aberto.
- Admin recebe alerta em tempo real (in-app SSE) sem precisar olhar WhatsApp.
- Motivo de cancelamento estruturado permite analytics ("qual % é problema mecânico?").
- Motorista entende que o canal oficial é o app — reduz conversas no WhatsApp pessoal do admin.

**Negativas**:
- Mais uma tela e mais 2 endpoints novos a implementar e testar.
- Motorista pode confundir "Vou atrasar" com "Cancelar" se UI não for clara — cores e ícones distintos são essenciais.
- Backend precisa lidar com cancelamento iniciado pelo motorista (regra de negócio diferente do cancelamento pelo admin: política de penalidade, prazo mínimo, etc.).

## Alternativas consideradas

**A1. Botão único "Falar com fábrica" que abre `wa.me` pro telefone do admin.**
Rejeitada. Não cria evento no sistema, perde a auditoria que motivou este ADR. Pior dos dois mundos: motorista usa app mas comunicação não fica rastreada.

**A2. Chat in-app full (mensagens livres motorista↔admin).**
Rejeitada para MVP. Escopo grande (UI, persistência, real-time bidirecional, anexos, leitura). Botões estruturados resolvem 90% do caso de uso real com 10% do esforço. Reavaliar Onda 3 se feedback pedir.

**A3. Apenas "Cancelar" sem "Avisar atraso" (atraso vira só observação opcional dentro do cancelamento).**
Rejeitada. Atraso é caso muito mais comum que cancelamento — pode ser 70%+ das comunicações. Forçar motorista a "cancelar" só pra avisar atraso de 30min seria perverso.

## Referências

- Backend ADR-0002: `TruckFlow/docs/adr/0002-design-notificacoes.md` (canal motorista→admin descrito como gancho)
- [ADR-0001](./0001-integracao-push-notifications.md) — push é o outro lado (admin→motorista)
- Admin: notificação in-app do evento é detalhada no ADR-0001 do repo admin.
