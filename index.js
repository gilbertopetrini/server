// index.js (Versão Mínima SEM Firebase para Teste)

import express from 'express';

const app = express();
const port = process.env.PORT || 3000; 

// Remove KIRVANO_WEBHOOK_SECRET para este teste, focando apenas na inicialização do Express
// const KIRVANO_WEBHOOK_SECRET = process.env.KIRVANO_WEBHOOK_SECRET;

app.use(express.json());

app.post('/kirvano-webhook', (req, res) => {
    console.log('--- Webhook Recebida no Teste SEM Firebase! ---');
    // Remove a verificação do token para este teste
    // const receivedToken = req.headers['x-kirvano-token'];
    // if (!KIRVANO_WEBHOOK_SECRET || receivedToken !== KIRVANO_WEBHOOK_SECRET) {
    //     console.warn('Alerta de Segurança: Requisição de webhook não autorizada ou token inválido!');
    //     return res.status(401).send('Não autorizado: Token da webhook inválido ou ausente.');
    // }
    console.log('Dados recebidos:', JSON.stringify(req.body, null, 2));
    res.status(200).send('Webhook de teste SEM Firebase recebida com sucesso!');
});

app.get('/', (req, res) => { // Rota GET simples para testar no navegador
    console.log('Requisição GET na raiz recebida (Teste SEM Firebase)!');
    res.status(200).send('Servidor de webhook de teste SEM Firebase está online!');
});

app.listen(port, () => {
    console.log(`Servidor de Webhook de Teste SEM Firebase rodando em http://localhost:${port}/kirvano-webhook`);
    console.log(`Endpoint de teste: http://localhost:${port}/`);
    console.log(`Aguardando webhooks de teste...`);
});
