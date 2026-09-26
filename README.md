# 💰 Controle Financeiro

Sistema de controle financeiro para acompanhar entradas, gastos, saldo e metas pessoais em um único lugar.

## 🚀 Visão geral

Este projeto foi pensado para ajudar no acompanhamento financeiro diário com uma interface simples e funcional, conectada a um backend em Go e banco PostgreSQL.

Com ele, você consegue:

- registrar entradas e gastos
- visualizar o saldo atual
- acompanhar o desempenho financeiro por período
- definir metas de economia e gasto mensal
- consultar um dashboard com indicadores principais

## 🧩 Stack

- Frontend: React + TypeScript + Vite
- Backend: Go + Gin
- Banco de dados: PostgreSQL
- Containerização: Docker + Docker Compose

## ✨ Funcionalidades

- Dashboard com resumo financeiro
- Registro de transações
- Controle de gastos por categoria
- Metas mensais e objetivos de economia
- API REST para integração entre frontend e backend

## 🏃 Como rodar

Na raiz do projeto:

```bash
docker compose up --build
```

Depois, acesse:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- PostgreSQL: localhost:5433

## ⚙️ Variáveis de ambiente

O projeto usa configurações padrão em `docker-compose.yml`, com fallback para:

- PostgreSQL user: `user`
- PostgreSQL password: `password`
- Banco: `finance`


## 🛠️ Observações

- O backend expõe endpoints em `/api`
- O frontend consome a API do backend para atualizar o dashboard e os registros
- O banco é inicializado automaticamente pelo Docker

