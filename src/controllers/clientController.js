import { RepositoryClient } from "../repository/UserRepository.js"; // Caminho correto


const clientRepository = new RepositoryClient(); // Criação da instância

export class ClientController {
    static async create(req, res) {
        try {
            const body = req.body;
            const message = await clientRepository.createClient(body); // Use a instância
            res.status(201).json({ message });

        } catch (error) {

            console.error(error);
            if (error.message === "Formato de e-mail inválido.") {
                return res.status(400).json({ error: error.message });
            }
            if (error.message === "Usuário já registrado no banco.") {
                return res.status(409).json({ error: error.message });
            }
            res.status(500).json({ error: "Erro ao criar usuário" });
        }
    }

    static async getAll(req, res) {
        try {
            const allClients = await clientRepository.getAll(); // Use a instância
            res.status(200).json(allClients);
        } catch (error) {
            res.status(500).json({ error: "Erro interno no servidor" });
        }
    }

    static async getId(req, res) {
        try {
            const { id } = req.params; // Extrai o ID dos parâmetros
            console.log("ID recebido no Controller:", id);

            const client = await clientRepository.getById(Number(id)); // Use a instância
            res.status(200).json(client);
        } catch (error) {
            console.error("Erro ao buscar cliente:", error.message);
            res.status(404).json({ error: "Usuário não encontrado" });
        }
    }
    static async toggleUser(req, res) {
        const { id } = req.params;
        const { action } = req.body; // Espera um valor booleano (true ou false)
    
        // Validação para aceitar apenas true ou false
        if (typeof action !== 'boolean') {
            return res.status(400).json({ error: "Ação inválida. Use 'true' para ativar ou 'false' para desativar." });
        }
    
        try {
            const result = await clientRepository.TogglerStatus(id, action);
            return res.status(200).json(result);
        } catch (error) {
            console.error(error);
    
            if (error.message === "Usuário não encontrado.") {
                return res.status(404).json({ error: error.message });
            }
    
            return res.status(500).json({ error: "Falha ao atualizar o status do usuário." });
        }
    }

    static async login(req, res) {
        const { email, senha } = req.body;

        try {
            // Validação dos campos
            if (!email || !senha) {
                return res.status(400).json({ error: "Email e senha são obrigatórios." });
            }

            // Chama o método de login do repositório
            const { token, user } = await clientRepository.loginUser(email, senha);

            // Retorna o token e informações básicas do usuário
            return res.status(200).json({ 
                message: "Login realizado com sucesso.", 
                token, 
                user: { id: user.id, nome: user.nome, email: user.email } 
            });
        } catch (error) {
            if (error.message === "Usuário não encontrado." || error.message === "Senha inválida.") {
                return res.status(401).json({ error: error.message });
            }

            return res.status(500).json({ error: "Erro ao realizar login." });
        }
    }
}