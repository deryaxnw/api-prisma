import { ConexaoPrisma } from "../app/connection.js";
import bcript from "bcrypt"
import validator from "validator";
import jwt from "jsonwebtoken"

export class RepositoryClient{

    async createClient (body){
        try {
            const connection = ConexaoPrisma.gerarConexao()
            if(!validator.isEmail(body.email)){
                throw new Error("Formato de e-mail inválido.")
            }

            console.log("Buscando cliente com o email:", body.email);

        const client = await connection.cliente.findUnique({where:{email:body.email}})


        if(!client){
            const senhaCriptografada = await bcript.hash(body.senha,10)
            console.log("Senha criptografada:", senhaCriptografada);

            const newClient = await connection.cliente.create(
                {data:{...body, senha: senhaCriptografada}});
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

    async getById(id) {
        try {
            const connection = ConexaoPrisma.gerarConexao();
    
            // Busca o cliente pelo ID
            const getIdClient = await connection.cliente.findUnique({
                where: { id: id },
            });
            console.log(getIdClient)
            if (!getIdClient) {
                throw new Error("Cliente não encontrado");
            }
            return getIdClient;
    
        } catch (error) {
            console.error("Erro ao buscar cliente por ID:", error);
            throw new Error("Erro interno no servidor");
        }
    } 

    async TogglerStatus(id, isActive){
        const connection = ConexaoPrisma.gerarConexao();

        // Verifica se o usuário existe
        const user = await connection.cliente.findUnique({
            where: { id: Number(id) },
        });
    
        if (!user) {
            throw new Error("Usuário não encontrado.");
        }
    
        if (user.active === isActive) {
            throw new Error(`Usuário já está ${isActive ? "ativo" : "inativo"}.`);
        }
    
        // Atualiza o campo `active` com o novo status
        const updatedUser = await connection.cliente.update({
            where: { id: Number(id) },
            data: { active: isActive },
        });
    
        return {
            message: `Usuário ${isActive ? "ativado" : "desativado"} com sucesso.`,
            user: updatedUser,
        };
    }

    async loginUser(email, senha) {
        const connection = ConexaoPrisma.gerarConexao();

        try {
            // Busca o usuário pelo email
            const user = await connection.cliente.findUnique({ where: { email } });

            if (!user) {
                throw new Error("Usuário não encontrado.");
            }

            // Verifica se a senha está correta
            const senhaValida = await bcript.compare(senha, user.senha);
            if (!senhaValida) {
                throw new Error("Senha inválida.");
            }

            // Gera o token JWT
            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.SECRET_KEY ,
                { expiresIn: '1h' }
            );

            return { token, user };
        } catch (error) {
            console.error("Erro ao fazer login:", error.message);
            throw error;
        }
    }
}

