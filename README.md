TruckFlow Driver App

Aplicativo mobile oficial para motoristas de caminhão realizarem e acompanharem agendamentos de carga e descarga de matéria-prima.
Desenvolvido para oferecer uma experiência simples, rápida e integrada ao ecossistema TruckFlow.

🚚 Sobre o Projeto

O TruckFlow Driver App permite que motoristas:

Criem agendamentos de carga/descarga

Consultem seus agendamentos futuros e passados

Recebam notificações sobre alterações, aprovações ou cancelamentos

Visualizem dados importantes (matéria-prima, fornecedor, horários, status etc.)

Acompanhem o fluxo da operação em tempo real

Todo o fluxo é integrado via API ao sistema web de gestão utilizado pela empresa (administradores e operadores).

🏗️ Arquitetura do Sistema

Este projeto é parte do ecossistema TruckFlow, composto por:

TruckFlow API (.NET) – backend principal (agendamentos, usuários, fornecedores, cargas etc.)

TruckFlow Web (React/Vue) – painel administrativo

TruckFlow Driver App (este repositório) – aplicativo mobile para motoristas

O app se comunica exclusivamente com a TruckFlow API através de endpoints REST.

📱 Tecnologias Utilizadas

React Native

TypeScript

React Query / Axios

Context API / Zustand / Redux (opcional)

Expo (opcional)


🚀 Objetivo Principal

Facilitar o processo de agendamento e comunicação entre motoristas e a empresa, reduzindo filas, atrasos e falta de informações no processo de carga/descarga.


📦 Funcionalidades (MVP)

 Autenticação de motorista

 Cadastro de agendamento

 Listagem de agendamentos

 Detalhe de agendamento

 Recebimento de notificações

 Atualização automática do status

 Layout responsivo e acessível



 🔧 Como Rodar o Projeto
1. Clone o repositório
git clone https://github.com/seu-usuario/truckflow-driver-app.git

2. Instale as dependências

(ajustar conforme escolha da stack)

React Native:

npm install


3. Configure o arquivo de ambiente

Crie .env:

API_BASE_URL=https://sua_api.com

📄 Licença

Este projeto é distribuído sob a licença MIT.
