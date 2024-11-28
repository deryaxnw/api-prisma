import { PrismaClient } from "@prisma/client";

export class ConexaoPrisma {
    
    static gerarConexao(){
        return this.prisma ? this.prisma : this.prisma = new PrismaClient()
    }
}