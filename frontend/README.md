# Frontend - Desafio Técnico – Desenvolvedor Fullstack Júnior

## Visão Geral

Este é o frontend do desafio, desenvolvido com **Next.js App Router**, **TypeScript**, **Axios** e **Sass**. Ele oferece uma interface moderna e funcional para criação, edição e visualização de produtos, além da aplicação de cupons de desconto.

---

## Tecnologias Utilizadas

- [Next.js 15 (App Router)](https://nextjs.org/docs/app)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Axios](https://axios-http.com/)
- [Zod](https://zod.dev/) – Validação de formulários
- [Sass](https://sass-lang.com/) – Estilização com `.scss` modules

---

## Como Executar com Docker

O frontend também está configurado para rodar em um container Docker, facilitando sua execução sem a necessidade de instalar dependências localmente.

```bash
docker-compose up --build frontend
```
A aplicação ficará disponível em: http://localhost:3000

---
## Estrutura de Pastas

```bash
src/
├── app/                           
│   ├── product/                   
│   │   ├── create/                
│   │   │   ├── page.tsx
│   │   │   └── page.module.scss
│   │   └── update/               
│   │       ├── page.tsx
│   │       └── page.module.scss
│   ├── global.scss               
│   ├── layout.tsx               
│   ├── layout.module.scss
│   ├── page.tsx                 
│   └── page.module.scss
├── components/                   
│   ├── button/
│   │   ├── button.tsx
│   │   └── button.module.scss
│   ├── header/
│   │   ├── header.tsx
│   │   └── header.module.scss
│   ├── input/
│   │   ├── input.tsx
│   │   └── input.module.scss
│   ├── modal/
│   │   ├── modal.tsx
│   │   └── modal.module.scss
│   ├── modal-coupon/
│   │   ├── modal-coupon.tsx
│   │   └── modal-coupon.module.scss
│   ├── product-form/
│   │   ├── button.tsx
│   │   └── button.module.scss
│   ├── select/
│   │   ├── select.tsx
│   │   └── select.module.scss
│   ├── sidebar/
│   │   ├── sidebar.tsx
│   │   └── sidebar.module.scss
│   ├── table/
│   │   ├── table.tsx
│   │   └── table.module.scss
│   └── update-form/
│       ├── update-form.tsx
│       └── update-form.module.scss
├── services/                     
│   ├── api.ts                    
│   └── productService.ts     
```    
