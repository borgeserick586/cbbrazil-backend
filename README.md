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
│   │   │   └── 📄 create-contact.dto.ts  # DTO para criação de contatos
│   │   ├── 📄 contacts.controller.ts     # Controller REST para contatos
│   │   ├── 📄 contacts.module.ts         # Módulo de contatos
│   │   └── 📄 contacts.service.ts        # Lógica de negócio dos contatos
│   │
│   ├── 📁 leads/                    # Módulo de Leads
│   │   ├── 📁 dto/                 # Data Transfer Objects
│   │   │   └── 📄 create-lead.dto.ts     # DTO para criação de leads
│   │   ├── 📄 leads.controller.ts        # Controller REST para leads
│   │   ├── 📄 leads.module.ts            # Módulo de leads
│   │   └── 📄 leads.service.ts           # Lógica de negócio dos leads
│   │
│   ├── 📁 supabase/                 # Módulo de Integração Supabase
│   │   ├── 📄 supabase.module.ts         # Configuração do módulo Supabase
│   │   └── 📄 supabase.service.ts        # Serviço para operações no Supabase
│   │
│   ├── 📁 kommo/                    # Módulo de Integração Kommo CRM
│   │   ├── 📁 interfaces/           # Interfaces TypeScript
│   │   │   ├── 📄 kommo-contact.interface.ts  # Interface para contatos Kommo
│   │   │   └── 📄 kommo-lead.interface.ts     # Interface para leads Kommo
│   │   ├── 📄 kommo.module.ts            # Configuração do módulo Kommo
│   │   └── 📄 kommo.service.ts            # Serviço para operações no Kommo
│   │
│   ├── 📄 app.controller.ts         # Controller principal (health check)
│   ├── 📄 app.module.ts             # Módulo raiz da aplicação
│   ├── 📄 app.service.ts            # Serviço principal
│   └── 📄 main.ts                   # Ponto de entrada da aplicação
│
├── 📁 test/                         # Testes automatizados
│   ├── 📄 app.e2e-spec.ts          # Testes end-to-end
│   └── 📄 jest-e2e.json            # Configuração Jest para E2E
│
├── 📁 dist/                         # Código compilado (gerado automaticamente)
├── 📁 node_modules/                 # Dependências do projeto
├── 🔒 .env                          # Variáveis de ambiente (não versionado)
├── 📄 package.json                  # Dependências e scripts do projeto
├── 📄 tsconfig.json                 # Configuração TypeScript
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
