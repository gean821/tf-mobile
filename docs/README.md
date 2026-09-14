# TruckFlow Driver App — Documentação (mobile)

Este diretório contém ADRs (Architecture Decision Records) do app mobile do motorista (Expo 54 / React Native 0.81 / Expo Router).

## Estrutura

- [`adr/`](./adr/README.md) — Decisões arquiteturais numeradas, escopadas ao mobile.

## Como ler

Comece pelo [índice de ADRs](./adr/README.md). Antes de qualquer mudança não-trivial, leia também o **ADR-0001 do backend** (`TruckFlow/docs/adr/0001-alvo-aurora.md`) que define o cliente alvo e dimensionamento do produto.

## Repos relacionados

| Repo | Localização | Escopo |
|---|---|---|
| **Backend** (.NET) | `TruckFlow/docs/adr/` | Domínio, persistência, notificação server-side, tracking server-side, infra |
| **Mobile** (este) | `tf-mobile/truckflow-driver-app/docs/adr/` | Captura de localização, push, deep-links, UX motorista |
| **Admin** (web) | `TruckFlowApp/truckflow.app/docs/adr/` | Consumo de SSE, mapa, contato WhatsApp, UX admin |
