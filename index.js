import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";

const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // Define a porta, usando 3000 como padrão se não for especificada

// Middleware para parsear o corpo das requisições JSON.
// Isso é essencial para que o Express consiga ler os dados enviados pela Kirvano.
app.use(express.json());

// --- Rota da Webhook da Kirvano ---
app.post('/kirvano-webhook', (req, res) => {
    console.log('--- Webhook da Kirvano Recebida! ---');

    // O corpo da requisição (req.body) contém os dados enviados pela Kirvano.
    const dadosVenda = req.body;
    console.log('Dados recebidos:', JSON.stringify(dadosVenda, null, 2)); // Imprime os dados formatados

    // Chamamos a função para processar os dados da venda.
    // Passamos os dados completos para que a função possa acessar qualquer informação necessária.
    processarVenda(dadosVenda);

    // Responde à Kirvano que a webhook foi recebida com sucesso.
    // É importante responder com um status 200 OK para evitar que a Kirvano tente reenviar a notificação.
    res.status(200).send('Webhook recebida com sucesso!');
});

// --- Função para Processar os Dados da Venda ---
function processarVenda(dadosVenda) {
    // Agora sabemos que o ID de venda está diretamente no campo 'sale_id'
    const idVenda = dadosVenda.sale_id;

    if (idVenda) {
        const emailGerado = `${idVenda}@gmail.com`;
        const senhaGerada = idVenda
        console.log(`\nID de Venda Detectado: ${idVenda}`);
        console.log(`Email Gerado: ${emailGerado}`);
        console.log(`Email Gerado: ${senhaGerada}`);

        // --- AQUI É ONDE VOCÊ INTEGRA COM SEU SISTEMA DE LOGIN ---
        // Você chamaria uma função que se conecta ao seu banco de dados
        // ou a outro serviço para criar o login.
        criarLoginNoSistema(idVenda, emailGerado);

    } else {
        console.warn('\nErro: Não foi possível extrair o ID de venda (sale_id) dos dados da webhook.');
        console.warn('Verifique a estrutura dos dados da Kirvano novamente se isso persistir.');
    }
}

// --- Função para Criar o Login (Exemplo) ---
async function criarLoginNoSistema(idVenda, email) {
    console.log(`\n--- INICIANDO CRIAÇÃO DE LOGIN ---`);
    console.log(`Tentando criar login para o email: ${email} (ID de Venda: ${idVenda})`);

    await createUserWithEmailAndPassword(auth, emailGerado, senhaGerada);

    await new Promise(resolve => setTimeout(resolve, 2000)); // Espera 2 segundos

    console.log(`Sucesso! Login para ${email} (ID: ${idVenda}) criado (simulado).`);
    console.log(`--- CRIAÇÃO DE LOGIN FINALIZADA ---`);
}

// --- Inicia o Servidor ---
app.listen(port, () => {
    console.log(`Servidor de Webhook rodando em http://localhost:${port}/kirvano-webhook`);
    console.log(`Aguardando webhooks da Kirvano...`);
});