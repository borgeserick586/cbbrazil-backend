# 🚀 Deploy na Hostinger - Guia Completo

## 📋 Pré-requisitos

- Conta na Hostinger com hospedagem Node.js
- Projeto compilado e testado localmente
- Variáveis de ambiente configuradas

## 🔧 Configuração no Painel da Hostinger

### 1. Criar Aplicação Node.js

1. Acesse o painel da Hostinger
2. Vá em **Node.js App** → **Criar nova aplicação**
3. Configure:
   - **Startup File**: `server.js`
   - **Application Root**: `/public_html/api` (ou pasta desejada)
   - **Node.js Version**: 18.x ou superior

### 2. Variáveis de Ambiente

No painel da Hostinger, configure as seguintes variáveis:

```bash
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://seudominio.com
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_de_servico_do_supabase
```

## 📁 Estrutura de Arquivos para Upload

```
public_html/
└── api/
    ├── server.js
    ├── package.json
    ├── .htaccess
    ├── dist/
    │   ├── app.module.js
    │   ├── main.js
    │   └── ... (arquivos compilados)
    └── node_modules/
        └── ... (dependências)
```

## 🛠️ Comandos para Deploy

### 1. Build de Produção

```bash
npm run build:prod
```

### 2. Upload dos Arquivos

- Faça upload de todos os arquivos para `/public_html/api/`
- Certifique-se de que `server.js` está na raiz da pasta `api`

### 3. Instalar Dependências (se necessário)

```bash
npm install --production
```

## 🔍 Verificação do Deploy

### 1. Testar Endpoints

```bash
# Health check
curl https://seudominio.com/api/v1

# Testar leads
curl -X POST https://seudominio.com/api/v1/leads \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","email":"teste@email.com"}'
```

### 2. Logs de Debug

- Acesse os logs da aplicação no painel da Hostinger
- Verifique se não há erros de inicialização

## 🚨 Troubleshooting

### Problema: Aplicação não inicia

- Verifique se `server.js` está na raiz correta
- Confirme se todas as dependências estão instaladas
- Verifique os logs de erro

### Problema: CORS errors

- Ajuste `FRONTEND_URL` nas variáveis de ambiente
- Verifique se o CORS está configurado corretamente

### Problema: 404 em rotas

- Confirme se o `.htaccess` está presente
- Verifique se o Apache está redirecionando corretamente

## 📊 Monitoramento

### 1. Logs da Aplicação

- Acesse o painel da Hostinger
- Vá em **Logs** para ver erros e debug

### 2. Performance

- Monitore o uso de CPU e memória
- Configure alertas se necessário

## 🔄 Atualizações

### Para atualizar a aplicação:

1. Faça as alterações no código
2. Execute `npm run build:prod`
3. Faça upload apenas dos arquivos alterados
4. Reinicie a aplicação no painel da Hostinger

## 📞 Suporte

Em caso de problemas:

1. Verifique os logs da aplicação
2. Teste localmente primeiro
3. Entre em contato com o suporte da Hostinger se necessário
