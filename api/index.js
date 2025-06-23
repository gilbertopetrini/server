import { auth } from "../firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import express from 'express';

const app = express();
const port = process.env.PORT || 3000; // Define a porta, usando 3000 como padrão se não for especificada

const KIRVANO_WEBHOOK_SECRET = process.env.KIRVANO_WEBHOOK_SECRET;

// Middleware para parsear o corpo das requisições JSON.
// Isso é essencial para que o Express consiga ler os dados enviados pela Kirvano.
app.use(express.json());

// --- Rota da Webhook da Kirvano ---
app.post('/', async (req, res) => {
    console.log('--- Webhook da Kirvano Recebida! ---');

    const receivedToken = req.headers['x-kirvano-token'];

     if (!KIRVANO_WEBHOOK_SECRET || receivedToken !== KIRVANO_WEBHOOK_SECRET) {
        console.warn('Alerta de Segurança: Requisição de webhook não autorizada ou token inválido!!');
        // Responde com erro 401 Unauthorizeda
        return res.status(401).send('Não autorizado: Token da webhook inválido ou ausente.');
    }

    console.log('Token da webhook verificado com sucesso.');

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
    console.log(`\n--- INICIANDO CRIAÇÃO DE LOGIN NO FIREBASE ---`);
    console.log(`Tentando criar login para o email: ${email}`);

    try {
        // Tenta criar o usuário com e-mail e senha no Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
        const user = userCredential.user;
        console.log(`Sucesso! Usuário Firebase criado com ID: ${user.uid} para o email: ${email}`);
    } catch (error) {
        // Captura e loga qualquer erro durante a criação do usuário no Firebase
        console.error(`Erro ao criar usuário Firebase para o email ${email}:`, error.message);
        // Você pode adicionar lógica para lidar com erros específicos do Firebase, como:
        // - 'auth/email-already-in-use' (se o e-mail já existir)
        // - 'auth/weak-password' (se a senha for muito fraca, embora 'idVenda' seja fraca)
        throw error; // Propaga o erro para que a webhook responda com 500
    }

    // A linha abaixo simulava uma operação e pode ser removida se a criação do usuário for a única ação
    // await new Promise(resolve => setTimeout(resolve, 2000)); // Espera 2 segundos

    console.log(`--- CRIAÇÃO DE LOGIN NO FIREBASE FINALIZADA ---`);
}

// --- Inicia o Servidor ---
app.listen(port, () => {
    console.log(`Servidor de Webhook rodando em http://localhost:${port}/kirvano-webhook`);
    console.log(`Aguardando webhooks da Kirvano...`);
});

export default app;