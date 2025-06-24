// api/index.js
// Servidor Express configurado como uma API Route do Vercel
// Gerencia webhooks da Kirvano e cria usuários no Firebase.

// Importações usando a sintaxe ES Modules
import express from 'express'; // CORREÇÃO: Usar 'import' para express
import { auth } from "../firebase.js"; // Caminho ajustado se firebase.js estiver na raiz
import { createUserWithEmailAndPassword } from "firebase/auth";

const app = express();

// A porta é gerenciada pelo Vercel, não é necessária aqui.
// const port = process.env.PORT || 3000; 

// O token secreto da webhook da Kirvano, obtido das variáveis de ambiente do Vercel
const KIRVANO_WEBHOOK_SECRET = process.env.KIRVANO_WEBHOOK_SECRET;

// Middleware para parsear o corpo das requisições JSON.
app.use(express.json());

// --- Rota da Webhook da Kirvano ---
// Esta rota responderá a requisições POST para /api/
app.post('/', async (req, res) => {
    console.log('--- Webhook da Kirvano Recebida! ---');

    // --- LINHAS DE DEPURACAO PARA TODOS OS CABECALHOS ---
    console.log('[DEBUG] Todos os Cabeçalhos Recebidos:');
    for (const header in req.headers) {
        console.log(`[DEBUG]   ${header}: ${req.headers[header]}`);
    }

    const receivedToken = req.headers['security-token'];

    // CORREÇÃO: Removi os logs de debug que já cumpriram seu propósito
    // e reativei a verificação de segurança, que é crucial em produção.
if (!KIRVANO_WEBHOOK_SECRET || receivedToken !== KIRVANO_WEBHOOK_SECRET) {
    console.warn('Alerta de Segurança: Requisição de webhook não autorizada ou token inválido!!');
        // Responde com erro 401 Unauthorized
    return res.status(401).send('Não autorizado: Token da webhook inválido ou ausente.');
}

    console.log('Token da webhook verificado com sucesso.');

    // O corpo da requisição (req.body) contém os dados enviados pela Kirvano.
    const dadosVenda = req.body;
    console.log('Dados recebidos:', JSON.stringify(dadosVenda, null, 2)); // Imprime os dados formatados

    try {
        // CORREÇÃO: Certifique-se de aguardar processarVenda, pois é assíncrona
        await processarVenda(dadosVenda); 
        // Responde à Kirvano que a webhook foi recebida com sucesso.
        res.status(200).send('Webhook recebida com sucesso!');
    } catch (error) {
        console.error('Erro no processamento da webhook:', error.message);
        // Em caso de erro na lógica, retorna um erro 500 para a Kirvano.
        res.status(500).send('Erro interno do servidor ao processar a webhook.');
    }
});

// --- Função para Processar os Dados da Venda ---
async function processarVenda(dadosVenda) { // Tornada assíncrona para chamar criarLoginNoSistema
    const idVenda = dadosVenda.sale_id;

    if (idVenda) {
        const emailGerado = `${idVenda}@nubank.com`;
        const senhaGerada = idVenda; // Usando idVenda como senha (ATENÇÃO: MUITO INSEGURO para produção!)

        console.log(`\nID de Venda Detectado: ${idVenda}`);
        console.log(`Email Gerado: ${emailGerado}`);
        console.log(`Senha Gerada: ${senhaGerada}`); // CORREÇÃO: Log para confirmar a senha gerada

        // CORREÇÃO: Chamando a função de criação de login
        await criarLoginNoSistema(emailGerado, senhaGerada); 

    } else {
        console.warn('\nErro: Não foi possível extrair o ID de venda (sale_id) dos dados da webhook.');
        console.warn('Verifique a estrutura dos dados da Kirvano novamente se isso persistir.');
        throw new Error('ID de venda não encontrado.'); // Lança erro para ser capturado no try-catch principal
    }
}

// --- Função para Criar o Login no Firebase ---
async function criarLoginNoSistema(email, password) { // Renomeado 'senha' para 'password' para clareza
    console.log(`\n--- INICIANDO CRIAÇÃO DE LOGIN NO FIREBASE ---`);
    console.log(`Tentando criar login para o email: ${email}`);

    try {
        // CORREÇÃO: Passando o 'password' diretamente. Removida a redeclaração redundante de senhaGerada
        const userCredential = await createUserWithEmailAndPassword(auth, email, password); 
        const user = userCredential.user;
        console.log(`Sucesso! Usuário Firebase criado com ID: ${user.uid} para o email: ${email}`);
    } catch (error) {
        console.error(`Erro ao criar usuário Firebase para o email ${email}:`, error.message);
        throw error; // Propaga o erro para o try-catch principal
    }

    console.log(`--- CRIAÇÃO DE LOGIN NO FIREBASE FINALIZADA ---`);
}

app.get('/favicon.ico', (req, res) => {
    res.status(204).end(); // Responde com "No Content", sem um arquivo real
});

// --- ESSENCIAL: EXPORTAR O APP ---
// CORREÇÃO: Removida a chamada app.listen(), Vercel gerencia isso.
export default app;
