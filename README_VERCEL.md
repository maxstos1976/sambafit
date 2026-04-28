# Guia de Implantação na Vercel

Este projeto foi configurado para ser implantado na Vercel como um aplicativo full-stack (Vite + Express).

## Passos para Implantação

1.  **Preparar o MongoDB**:
    *   Crie um cluster no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
    *   Certifique-se de que o acesso à rede está configurado como **"Allow Access from Anywhere"** (0.0.0.0/0) nas configurações de Network Access (isso é necessário para que as funções serverless da Vercel possam se conectar).
    *   Obtenha sua string de conexão (URL do MongoDB).

2.  **Conectar à Vercel**:
    *   Importe seu repositório Git na [Vercel](https://vercel.com).
    *   A Vercel detectará automaticamente que é um projeto Vite.

3.  **Configurar Variáveis de Ambiente**:
    Na seção **Environment Variables** do seu projeto na Vercel, adicione as seguintes chaves:
    *   `MONGODB_URI`: Sua string de conexão do MongoDB Atlas.
    *   `JWT_SECRET`: Uma string aleatória longa e segura para assinar os tokens.
    *   `GEMINI_API_KEY`: Sua chave de API do Google Gemini (se aplicável).
    *   `NODE_ENV`: Defina como `production`.

4.  **Configurações de Build**:
    *   **Framework Preset**: Vite (se não for detectado automaticamente).
    *   **Build Command**: `npm run build`
    *   **Output Directory**: `dist`

5.  **Implantar**:
    *   Clique em **Deploy**.

## Observações Importantes

*   **Socket.io (WebSockets)**: A Vercel utiliza funções serverless, o que significa que conexões persistentes de WebSockets (Socket.io) **não funcionam** da mesma forma que em um servidor tradicional. O projeto está configurado para não falhar se o socket não conectar, mas recursos em tempo real que dependem puramente de sockets no servidor podem ser limitados.
*   **Tempo Limite da API**: As funções serverless da Vercel têm um limite de tempo de execução (geralmente 10-30 segundos no plano gratuito). Certifique-se de que suas consultas ao banco de dados sejam eficientes.
*   **Conexão ao Banco de Dados**: A aplicação está configurada para reutilizar a conexão ao banco de dados entre as chamadas da API serverless para melhor desempenho.

## Estrutura de Arquivos Adicionada para Vercel
*   `api/index.ts`: Ponto de entrada das funções serverless da Vercel que executa o app Express.
*   `vercel.json`: Configuração de roteamento para direcionar chamadas `/api` para a função serverless e o resto para o frontend React.
*   `src/server_app.ts`: Versão refatorada do servidor para ser compatível tanto com Cloud Run quanto com Vercel.
