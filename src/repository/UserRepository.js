import { ConexaoPrisma } from "../app/connection.js";
import bycript from "bcrypt"


export class RepositoryClient{

    async createClient (body){
        try {
            const connection = ConexaoPrisma.gerarConexao()
            console.log("Buscando cliente com o email:", body.email);

        const client = await connection.cliente.findUnique({where:{email:body.email}})

        if(!client){
            const senhaCriptografada = bycript.hashSync(body.senha,10)
            console.log("Senha criptografada:", senhaCriptografada);

            const newClient = await connection.cliente.create(
                {data:{senha:senhaCriptografada, ...body}});
                console.log("Novo cliente criado:", newClient);

            return {mensagem: "cliente cadastrado com sucesso, seja bem vindo " + newClient.nome }
        }
        throw new Error("usuário ja resgistrado no banco")
        } catch(error) {
            console.error("Erro ao criar cliente:", error);
            throw error
        }
    }

    async getAll () {
        try {
            const connection = ConexaoPrisma.gerarConexao()
            const allClients = await connection.cliente.findMany()
            return allClients
        }catch(error){
            console.error("Erro ao buscar clientes:", error);
            throw new Error("erro interno no servidor")
        }
    }

}

