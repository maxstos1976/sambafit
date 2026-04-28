# Guia de Instalação no Render.com

Para hospedar este projeto no Render.com e manter o servidor "acordado" (evitando o atraso de 50 segundos em instâncias gratuitas), siga os passos abaixo:

## 1. Configuração do Ambiente no Render

Ao criar um novo "Web Service" no Render, use as seguintes configurações:

- **Runtime**: Node
- **Build Command**: `npm run build`
- **Start Command**: `npm start`

## 2. Variáveis de Ambiente (Environment Variables)

Adicione as seguintes variáveis no painel do Render:

- `NODE_ENV`: `production`
- `MONGODB_URI`: Sua string de conexão do MongoDB Atlas.
- `JWT_SECRET`: Uma string aleatória segura para os tokens.
- `GEMINI_API_KEY`: Sua chave da API Gemini.
- `APP_URL`: **IMPORTANTE!** Coloque a URL completa do seu app no Render (ex: `https://seu-app.onrender.com/api/health`).

## 3. Como o Keep-Alive funciona

Implementamos um sistema interno de "Keep-Alive". Quando o servidor detecta que está em `production` e possui a `APP_URL` definida, ele enviará um ping para si mesmo a cada 14 minutos. Isso impede que o Render coloque a instância em repouso por inatividade.

## 4. Banco de Dados

Certifique-se de que o IP do Render (ou `0.0.0.0/0`) está liberado no "Network Access" do seu painel do MongoDB Atlas para permitir a conexão.
