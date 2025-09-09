# 🚀 CB Brazil Backend

Backend da aplicação CB Brazil desenvolvido em NestJS com integração ao Supabase e Kommo CRM.

## 📋 Descrição

Sistema de gerenciamento de contatos e leads que sincroniza dados entre Supabase (banco de dados) e Kommo CRM (sistema de CRM). O backend oferece APIs RESTful para criação de contatos e leads, com validação de dados e tratamento de erros.

## 🏗️ Arquitetura

O projeto segue a arquitetura modular do NestJS, organizando funcionalidades em módulos específicos:

- **Contacts Module**: Gerenciamento de contatos
- **Leads Module**: Gerenciamento de leads (que automaticamente cria contatos)
- **Supabase Module**: Integração com banco de dados Supabase
- **Kommo Module**: Integração com CRM Kommo

## 📁 Estrutura do Projeto

```
├── 📁 src/                          # Código fonte principal
│   ├── 📁 contacts/                 # Módulo de Contatos
│   │   ├── 📁 dto/                 # Data Transfer Objects
│   │   │   └── 📄 create-contact.dto.ts  # Define o formato e validação dos dados para criar contatos
│   │   ├── 📄 contacts.controller.ts     # Define as rotas e endpoints REST para contatos
│   │   ├── 📄 contacts.module.ts         # Declara o módulo de contatos e suas dependências
│   │   └── 📄 contacts.service.ts        # Implementa a lógica de negócio para contatos e sincronização
│   │
│   ├── 📁 leads/                    # Módulo de Leads
│   │   ├── 📁 dto/                 # Data Transfer Objects
│   │   │   └── 📄 create-lead.dto.ts     # Define o formato e validação dos dados para criar leads
│   │   ├── 📄 leads.controller.ts        # Define as rotas e endpoints REST para leads
│   │   ├── 📄 leads.module.ts            # Declara o módulo de leads e suas dependências
│   │   └── 📄 leads.service.ts           # Implementa a lógica de negócio para leads e criação automática de contatos
│   │
│   ├── 📁 supabase/                 # Módulo de Integração Supabase
│   │   ├── 📄 supabase.module.ts         # Configura o módulo e a conexão com o Supabase
│   │   └── 📄 supabase.service.ts        # Implementa operações CRUD no banco Supabase
│   │
│   ├── 📁 kommo/                    # Módulo de Integração Kommo CRM
│   │   ├── 📁 interfaces/           # Interfaces TypeScript para o Kommo
│   │   │   ├── 📄 kommo-contact.interface.ts  # Define a estrutura dos dados de contato do Kommo
│   │   │   └── 📄 kommo-lead.interface.ts     # Define a estrutura dos dados de lead do Kommo
│   │   ├── 📄 kommo.module.ts            # Configura o módulo Kommo
│   │   ├── 📄 kommo.mudule.ts            # (Possível duplicata/erro de digitação do arquivo acima)
│   │   └── 📄 kommo.service.ts           # Implementa integração e sincronização com o Kommo CRM
│   │   └── 📄 field-mappings.md          # Documentação sobre mapeamento de campos Kommo
│   │
│   ├── 📄 app.controller.ts         # Controller principal, inclui health check da API
│   ├── 📄 app.module.ts             # Módulo raiz que importa e conecta todos os módulos
│   ├── 📄 app.service.ts            # Serviço principal, lógica compartilhada da aplicação
│   └── 📄 main.ts                   # Ponto de entrada da aplicação NestJS
│
├── 📁 test/                         # Testes automatizados
│   ├── 📄 app.e2e-spec.ts           # Testes end-to-end da aplicação
│   └── 📄 jest-e2e.json             # Configuração do Jest para testes E2E
│
├── 📁 dist/                         # Código compilado (gerado automaticamente)
├── 📁 node_modules/                 # Dependências do projeto
├── 🔒 .env                          # Variáveis de ambiente (não versionado)
├── 📄 package.json                  # Lista dependências, scripts e metadados do projeto
├── 📄 tsconfig.json                 # Configuração global do TypeScript
├── 📄 tsconfig.build.json           # Configuração TypeScript específica para build
├── 📄 nest-cli.json                 # Configuração do Nest CLI
├── 📄 eslint.config.mjs             # Configuração do ESLint
├── 📄 env.production.example        # Exemplo de variáveis de ambiente para produção
├── 📄 server.js                     # Script para inicialização do servidor em produção
├── 📄 DEPLOY_HOSTINGER.md           # Guia de deploy na Hostinger
├── 📄 dist.zip                      # Build compactado para deploy
└── 📄 README.md                     # Este arquivo
```

## 🔧 Módulos e Responsabilidades

### 📞 Contacts Module (`src/contacts/`)

**Responsabilidade**: Gerenciamento de contatos

- **Controller**: `POST /api/v1/contacts` - Cria novos contatos
- **Service**: Sincroniza contatos entre Supabase e Kommo
- **DTO**: Validação de dados de entrada para contatos

### 🎯 Leads Module (`src/leads/`)

**Responsabilidade**: Gerenciamento de leads

- **Controller**: `POST /api/v1/leads` - Cria novos leads
- **Service**: Cria contato automaticamente e depois o lead
- **DTO**: Validação de dados de entrada para leads

### 🗄️ Supabase Module (`src/supabase/`)

**Responsabilidade**: Integração com banco de dados Supabase

- **Service**: Operações CRUD no banco de dados
- **Configuração**: Conexão e autenticação com Supabase

### 📊 Kommo Module (`src/kommo/`)

**Responsabilidade**: Integração com CRM Kommo

- **Service**: Sincronização de contatos e leads com Kommo
- **Interfaces**: Definições de tipos para dados do Kommo

## 🚀 Configuração e Execução

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
# Modo desenvolvimento com hot reload
npm run start:dev

# Modo produção
npm run start:prod
```

### Testes

```bash
# Testes unitários
npm run test

# Testes E2E
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

## 📡 APIs Disponíveis

### Health Check

- **GET** `/api/v1/health` - Status da aplicação

### Contatos

- **POST** `/api/v1/contacts` - Criar contato
  ```json
  {
    "name": "João Silva",
    "email": "joao@exemplo.com",
    "phone": "+5511999999999"
  }
  ```

### Leads

- **POST** `/api/v1/leads` - Criar lead
  ```json
  {
    "name": "Maria Santos",
    "email": "maria@exemplo.com",
    "phone": "+5511888888888",
    "source": "website",
    "utm_source": "google",
    "utm_medium": "cpc",
    "utm_campaign": "test_campaign",
    "status": "new_lead"
  }
  ```

## 🔄 Fluxo de Dados

1. **Lead Creation**: Cliente envia dados do lead
2. **Contact Creation**: Sistema cria contato automaticamente
3. **Database Sync**: Dados são salvos no Supabase
4. **CRM Sync**: Dados são sincronizados com Kommo
5. **Lead Creation**: Lead é criado com referência ao contato
6. **Response**: Retorna dados criados em ambos os sistemas

## 🛠️ Tecnologias Utilizadas

- **NestJS**: Framework Node.js
- **TypeScript**: Linguagem de programação
- **Supabase**: Banco de dados PostgreSQL
- **Kommo**: Sistema de CRM
- **Class Validator**: Validação de dados
- **Axios**: Cliente HTTP para APIs externas
