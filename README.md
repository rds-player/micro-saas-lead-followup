# 📧 Micro SaaS - Sistema de Follow-up Automático de Leads

Sistema completo de gerenciamento e follow-up automático de leads com envio de emails em sequência (D+1, D+3, D+7).

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node](https://img.shields.io/badge/Node.js-Backend-green)
![Tailwind](https://img.shields.io/badge/Tailwind-3.3.2-blue)

## ✨ Funcionalidades

- 🎯 **Gerenciamento de Leads**: Adicione, edite e acompanhe seus leads
- 📧 **Templates Personalizáveis**: Crie templates de email para D+1, D+3 e D+7
- ⚡ **Envio Automático**: Emails são enviados automaticamente nos dias programados
- 🎨 **Interface Moderna**: Design bonito com tema de outono usando Tailwind CSS
- ✅ **Status de Leads**: Marque leads como "Pendente", "Marcado" ou "Sem Interesse"
- 📝 **Personalização**: Use `[Nome]` nos templates para personalizar emails
- 🔄 **Sincronização**: Frontend e backend rodando juntos com um único comando

## 🚀 Tecnologias

### Frontend
- React 18.2.0
- Tailwind CSS 3.3.2
- Axios para requisições HTTP
- Design responsivo e moderno

### Backend
- Node.js com Express
- SQLite (banco de dados leve)
- Node-cron para agendamento
- Nodemailer para envio de emails
- CORS habilitado

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- Conta de email com SMTP (Gmail, Outlook, etc.)

## 🔧 Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/micro-saas.git
cd micro-saas
```

2. **Instale as dependências**
```bash
# Instalar dependências do projeto raiz
npm install

# Instalar dependências do cliente
cd client
npm install

# Instalar dependências do servidor
cd ../server
npm install

# Voltar para a raiz
cd ..
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na pasta `server`:
```env
ALLOWED_ORIGINS=http://localhost:3000
```

Crie um arquivo `.env` na pasta `client`:
```env
REACT_APP_API_BASE=http://localhost:3001/api
```

4. **Inicie o projeto**
```bash
# Na pasta raiz do projeto
npm start
```

Isso iniciará automaticamente:
- **Backend** em `http://localhost:3001`
- **Frontend** em `http://localhost:3000`

## ⚙️ Configuração SMTP

1. Acesse a aba **Configurações** no aplicativo
2. Preencha os dados do seu servidor SMTP:
   - **SMTP Host**: Ex: `smtp.gmail.com`
   - **SMTP Port**: Ex: `587` (TLS) ou `465` (SSL)
   - **SMTP User**: Seu email
   - **SMTP Password**: Senha do app ou senha do email
   - **FROM Email**: Email remetente

### Gmail
Para usar o Gmail, você precisa:
1. Ativar "Verificação em duas etapas"
2. Gerar uma "Senha de app" em https://myaccount.google.com/apppasswords
3. Usar essa senha no campo SMTP Password

## 📖 Como Usar

### 1. Adicionar Leads
- Vá para a aba **Leads**
- Preencha o nome e email do lead
- Clique em **Adicionar Lead**

### 2. Gerenciar Templates
- Vá para a aba **Templates**
- Clique em **➕ D+1**, **➕ D+3** ou **➕ D+7** para criar novos templates
- Edite os templates existentes diretamente nos campos
- Use `[Nome]` no assunto ou corpo para personalizar com o nome do lead

### 3. Acompanhar Status
- Na tabela de leads, altere o status conforme necessário:
  - **⏳ Pendente**: Lead aguardando retorno
  - **✅ Marcado**: Lead agendou reunião/compra
  - **❌ Sem Interesse**: Lead não demonstrou interesse

### 4. Emails Automáticos
Os emails são enviados automaticamente:
- **D+1**: 1 dia após adicionar o lead
- **D+3**: 3 dias após adicionar o lead
- **D+7**: 7 dias após adicionar o lead

## 🗂️ Estrutura do Projeto

```
micro-saas/
├── client/                 # Frontend React
│   ├── public/
│   ├── src/
│   │   ├── App.js         # Componente principal
│   │   ├── index.js       # Entry point
│   │   └── index.css      # Estilos Tailwind
│   ├── tailwind.config.js # Configuração Tailwind
│   └── package.json
├── server/                 # Backend Node.js
│   ├── index.js           # Servidor Express
│   ├── database.js        # Configuração SQLite
│   └── package.json
├── package.json           # Scripts do projeto
└── README.md
```

## 🎨 Personalização

### Cores do Tema
O projeto usa um tema de outono. Para mudar, edite `client/tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      // Adicione suas cores personalizadas aqui
    }
  }
}
```

### Templates Padrão
Os templates iniciais estão em `server/database.js`. Você pode alterá-los antes da primeira execução.

## 🐛 Solução de Problemas

### Porta 3000 já está em uso
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Emails não estão sendo enviados
1. Verifique as configurações SMTP
2. Certifique-se de que a senha do app está correta (Gmail)
3. Verifique se o firewall não está bloqueando a porta SMTP

### Tailwind não está funcionando
```bash
cd client
rm -rf node_modules/.cache build
npm start
```

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um Fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir um Pull Request

## 💡 Ideias para Melhorias

- [ ] Autenticação de usuários
- [ ] Dashboard com estatísticas
- [ ] Exportação de relatórios em PDF/CSV
- [ ] Integração com CRM
- [ ] Múltiplos funis de vendas
- [ ] A/B testing de templates
- [ ] Webhooks para integrações
- [ ] Modo escuro

## 📞 Suporte

Se você encontrar algum problema ou tiver sugestões, por favor abra uma [issue](https://github.com/seu-usuario/micro-saas/issues).

---

Desenvolvido com ❤️ usando React, Node.js e Tailwind CSS
