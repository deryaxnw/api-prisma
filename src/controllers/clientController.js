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
}
