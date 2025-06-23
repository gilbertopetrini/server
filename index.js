// index.js (Versão Mínima para Teste)

import express from 'express';

const app = express();
const port = process.env.PORT || 3000; 

app.use(express.json());

app.post('/kirvano-webhook', (req, res) => {
    console.log('--- Webhook Recebida no Teste Mínimo! ---');
    console.log('Dados recebidos:', JSON.stringify(req.body, null, 2));
    res.status(200).send('Webhook de teste recebida com sucesso!');
});

app.get('/', (req, res) => { // Adicione uma rota GET simples para testar no navegador
    console.log('Requisição GET na raiz recebida!');
    res.status(200).send('Servidor de webhook de teste está online!');
});


app.listen(port, () => {
    console.log(`Servidor de Webhook de Teste rodando em http://localhost:${port}/kirvano-webhook`);
    console.log(`Endpoint de teste: http://localhost:${port}/`);
    console.log(`Aguardando webhooks de teste...`);
});
