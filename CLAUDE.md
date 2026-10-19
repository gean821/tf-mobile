# TruckFlow Driver App — Mobile (Motorista)

App mobile do motorista. Cliente-alvo: **Aurora Alimentos**.

## Stack

- **Expo SDK 54** + **React Native 0.81** + **React 19.1** + **TypeScript 5.9** (strict)
- **expo-router 6** (navegação file-based, typed routes)
- **TanStack React Query 5.90** (estado de servidor — mesma convenção do web)
- **Zustand 5** (sessão e estado de wizard)
- **Axios 1.13** (HTTP)
- **expo-secure-store 15** (storage seguro de tokens — Keychain/Keystore)
- **expo-notifications** + expo-device (push Expo), **expo-camera** (scanner do DANFe), expo-document-picker (XML NF-e)
- **NativeWind 4** + **gluestack-ui v3** (`@/components/ui/*`), ícones lucide-react-native
- AsyncStorage instalado mas **não usado** — não usar para tokens
- Ainda sem testes, sem ESLint; sem expo-location/expo-sqlite (tracking não implementado)

## Navegação (expo-router)

```
app/
├── (auth)/       # Grupo: telas pré-login (login.tsx, register.tsx)
├── (app)/        # Grupo: telas autenticadas (home, agendamento/*, notificacoes, usuario)
└── _layout.tsx   # Bootstrap: providers, loadSession(), guard por segmento, registro de push
```

Grupos `(auth)` e `(app)` ficam fora da URL — só organizam guards.

## Estrutura

```
src/
├── Dtos/         # DTOs espelhando backend
├── Entities/     # Types (pouco usados)
├── components/   # buttons, cards, feedback (toast), modals, navs
├── hooks/        # use<Entidade>.ts (mutations) + usePushRegistration
├── queries/      # <entidade>.queries.ts (useQuery + queryKey)
├── services/     # <Entidade>Service.ts, PushRegistrationService
│   └── http/     # axios.ts (instância + interceptors)
├── stores/       # Zustand (useAuthStore, useNotaFiscalStore, useProdutoStore)
└── enums/
```

Alias `@` = raiz do repo (`@/src/...`, `@/components/ui/...`).

## Autenticação atual

- Tela: `app/(auth)/login.tsx`
- Service: `src/services/AuthService.ts` → `POST /AuthMotorista/login` (retorna `token`, `refreshToken` e expirações)
- Access token: **só em memória** (Zustand). Refresh token: **expo-secure-store** key `tf_refresh`
- Store: `src/stores/useAuthStore.ts` — `signIn`, `signOut`, `loadSession`, `setAccess`, `setRefresh`
- Bootstrap: `app/_layout.tsx` chama `loadSession()` no app start, que lê `tf_refresh` e faz `POST /Auth/refresh-mobile` (rotação); mantém a tela de loading até `isLoading=false`
- Interceptor: `src/services/http/axios.ts` anexa `Authorization: Bearer`; no 401 faz **refresh single-flight** (`/Auth/refresh-mobile`) e repete a request; se falhar, `signOut()` + `router.replace('/(auth)/login')`
- Logout: `signOut()` → `POST /Auth/logout-mobile` + apaga `tf_refresh`

## Push

- `usePushRegistration` registra o Expo push token após login/cold start via `PushRegistrationService.ensureRegistered()` → `POST /dispositivos/registrar`
- Tap na notificação roteia pelo payload (`isPushPayloadData`) para o ticket do agendamento ou a lista de notificações
- Push remoto exige dev build em device físico (não Expo Go)

## Notificações (tela + sino)

- Sino do navbar (`src/components/navs/navbar.tsx`): badge real via `useNotificacoesUnreadCountQuery()` — some com 0, mostra número, cap em "9+".
- Tela `app/(app)/notificacoes/notificacao.tsx`: `SectionList` agrupada por "Hoje/Ontem/Esta semana/Mais antigas" (por `criadaEm`), chips de filtro local (Todas/Não lidas/Mensagens/Agendamentos) sobre os itens da página atual, botão "Marcar todas como lidas" no header (`useNotificacao().markAllAsRead` → `POST /notifications/mark-all-read`).
- Subtítulo com contexto do agendamento (`unidadeEntregaNome`, `localDescargaNome`, `dataAgendamentoIso` dentro de `payloadJson`) é **opcional** — notificação sem esses campos (payload antigo ou tipo sem agendamento) simplesmente não mostra a linha, nunca erro.

## Variáveis de ambiente

`.env` (git-ignored; modelo em `.env.example`):
```
EXPO_PUBLIC_API_URL=http://192.168.18.6:8080/v1/
```

Vars `EXPO_PUBLIC_*` são automaticamente expostas (sem babel plugin). Apenas URL pública — nunca segredos. `eas.json` ainda não define env por profile.

## Backend

API .NET em `C:\ESTUDO\TruckFlow`. IP local `192.168.18.6:8080` pra dev em dispositivo físico. Endpoint motorista: `/AuthMotorista/login`. JWT carrega claim `MotoristaId` — nunca enviar `MotoristaId`/`EmpresaId` no body.

## Permissões & LGPD (tracking)

Decisão por ADR-0003 do backend + `docs/adr/0002-captura-localizacao.md` deste repo: tracking só foreground, geofencing 200m, envio em batch, retenção 90 dias, aviso LGPD antes da permissão. **Não** ativar background location sem revisão. Ainda não implementado.

## Convenções

- `expo-secure-store` para qualquer dado sensível (tokens, credenciais).
- `AsyncStorage` apenas para preferências/cache não-sensível.
- TanStack Query igual ao web: `services/` (HTTP puro) → `queries/` (useQuery + queryKey) → `hooks/` (useMutation + invalidação + toast) → telas. Telas não chamam service direto.
- Zustand sempre com seletor (`useAuthStore(s => s.token)`); dado de servidor fica no React Query.
- Toast imperativo: `toast.success/error(titulo, descricao?)` de `src/components/feedback/toast.tsx`.
- Componentes funcionais + hooks.
- Agentes e skills do projeto ficam no repo da API: `C:\ESTUDO\TruckFlow\.claude\` (`mobile-expo-specialist`, `typescript-pro`...).

## Manter este arquivo vivo

Quando algo descrito aqui for implementado, mudado ou deixar de ser verdade, **atualize este CLAUDE.md na mesma entrega**.

## Comandos

```bash
npx expo start         # Metro bundler (ou npm run start:lan)
npx expo run:android   # Build dev Android
npx expo run:ios       # Build dev iOS (macOS)
eas build              # Build EAS (cloud)
npx tsc --noEmit       # type-check (CI)
npx expo export --platform android --output-dir dist-ci   # bundle check (CI)
```
