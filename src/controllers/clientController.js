import { RepositoryClient } from "../repository/UserRepository.js"
const {createClient, getAll} = new RepositoryClient


export class ClientController {
    static async create(req, res){
        try {
            const body = req.body
            const message = await createClient(body)
            res.status(201).json({message: "usuário criado com sucesso"})

        }catch(error) {
            console.error(error);
            res.status(500).json({error: "erro ao criar usuário"} )
            return;
        }
    }




    static async getAll(req,res) {
        try {
            const getAllClients = await getAll()
            res.status(200).json(getAllClients)
        }catch(erro){
            res.status(500).json({error: "erro interno no servidor"})
        }
    }
}