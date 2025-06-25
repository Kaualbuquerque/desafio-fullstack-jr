# Backend - Desafio Técnico – Desenvolvedor Fullstack Júnior

## Visão Geral

Este backend foi desenvolvido com NestJS e TypeORM para fornecer uma API REST robusta e escalável para gerenciamento de produtos, incluindo funcionalidades para criação, edição, exclusão, listagem e aplicação de descontos via cupons ou diretamente por percentual. 

Ele serve como a camada de negócios da aplicação, gerenciando regras como validação de dados e controle de cupons .

---

## Tecnologias Utilizadas

- **NestJS**: Framework Node.js para construção de APIs escaláveis e organizadas.
- **TypeORM**: ORM para TypeScript que facilita o mapeamento das entidades e operações no banco de dados.
- **SQLite (em memória)**: Banco leve e rápido usado para persistência temporária dos dados durante a execução do container.
- **class-validator / class-transformer**: Validação e transformação dos dados recebidos via DTOs.
- **Docker**: Containerização do backend para facilitar o deploy e execução local sem dependências externas.
- **Swagger (OpenAPI)**: Documentação automática das rotas da API.

---

## Funcionalidades Implementadas

- **CRUD de Produtos**: Criar, listar com filtros avançados, atualizar e excluir produtos (soft delete).
- **Descontos**:
  - Aplicação de descontos diretos no preço do produto.
  - Aplicação de cupons de desconto vinculados aos produtos.
  - Controle de múltiplas regras de cupons (validação de datas, uso único, limite de uso).
- **Paginação e Ordenação**: Suporte para paginação e ordenação customizada nas listagens.
- **Validação Completa**: Uso de DTOs para garantir integridade e consistência dos dados.
- **Soft Delete**: Produtos removidos são marcados como inativos, permitindo restauração.
- **Transações**: Operações críticas, como aplicação de cupons, usam transações para garantir consistência.

---

## Como Executar

O backend está configurado para rodar em um container Docker, facilitando sua execução sem necessidade de instalar dependências localmente.

```bash
docker-compose up --build backend

```
A API ficará disponível em http://localhost:4000.

---

## Estrutura do Projeto
### Cupons

```
src/coupons/
├── dtos/                       
│   ├── create-coupon.dto.ts      # DTO para criação de cupom
│   └── update-coupon.dto.ts      # DTO para atualização de cupom
├── coupons.service.ts            # Serviço com regras de negócio de cupons
├── coupons.controller.ts         # Controller que expõe as rotas de cupons
├── coupon.entity.ts              # Definição da entidade Cupom 
├── coupons.module.ts             # Módulo NestJS que agrupa controller, service e entity de cupons
└── couponsSeeder.ts             # Inicializa cupons quando o banco de dados é iniciado
```
### Product Coupon Application
```
src/product-coupon-application/
├── dtos/                                         
│   └── apply-coupon.dto.ts                       # DTO para solicitar aplicação de cupom em um produto
├── product-coupon-application.service.ts         # Serviço com regras de negócio para aplicar cupons em produtos
├── product-coupon-application.controller.ts      # Controller que expõe as rotas de aplicação de cupons
├── product-coupon-application.entity.ts          # Entidade de relação produto–cupom (TypeORM)
└── product-coupon-application.module.ts          # Módulo NestJS que agrupa controller, service e entity
```

### Product Coupon Application
```
src/products/
├── dtos/                                
│   ├── create-application.dto.ts        # DTO para criação de aplicação de cupom no produto
│   ├── list-application.dto.ts          # DTO para listar aplicações de cupom 
│   └── update-application.dto.ts        # DTO para atualização de aplicação de cupom no produto
├── product.service.ts                   # Lógica de negócio para produtos
├── product.controller.ts                # Endpoints REST para gerenciar produtos
├── product.entity.ts                    # Definição da entidade Produto para o TypeORM (modelo do banco)
└── product.module.ts                    # Módulo NestJS que agrupa controller, service e providers dos produtos
      
```