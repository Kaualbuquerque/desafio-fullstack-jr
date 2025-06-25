# Desafio Técnico – Desenvolvedor Fullstack Júnior

Este é um desafio **Fullstack** desenvolvido com **NestJS** no backend e **Next.js** no frontend. O sistema permite o gerenciamento de produtos, incluindo criação, edição, exclusão, listagem e aplicação de cupons de desconto (por percentual ou código).

---

## Como Rodar o Projeto

O projeto pode ser executado tanto localmente quanto com Docker usando `docker-compose`.

### Executando com Docker

Requisitos:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

Comando para iniciar os containers do frontend e backend:

```bash
docker-compose up --build
```
Frontend disponível em: http://localhost:3000

Backend disponível em: http://localhost:4000

## Estrutura do Projeto
```/
├── backend/            # API construída com NestJS e TypeORM
│   ├── src/products    # Módulo de produtos e aplicação de cupons
│   └── ...             # Outras configurações do NestJS
│
├── frontend/           # Aplicação web construída com Next.js
│   ├── src/app         # Páginas e rotas do sistema
│   ├── src/components  # Componentes reutilizáveis
│   ├── src/services    # Lógica de comunicação com a API
│   └── ...
│
├── docker-compose.yml  # Orquestração de containers
└── README.md           # Este arquivo
```

## Tecnologias Utilizadas
### Backend
 * NestJS – Framework Node.js escalável
 * TypeORM – ORM para conexão com banco de dados
 * PostgreSQL – Banco de dados relacional
 * Docker – Containerização

### Frontend
 * Next.js (App Router) – Framework React com renderização híbrida
 * React 19 – Biblioteca de UI
 * TypeScript – Tipagem estática
 * Axios – Requisições HTTP
 * Sass (SCSS Modules) – Estilização
 * Zod – Validação de dados de formulários

## Documentações Individuais
 * [README do Backend](./backend/README.md)
 * [README do Frontend](./frontend/README.md)