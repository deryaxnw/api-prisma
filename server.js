import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { clientRota } from "./src/router/user";

const app = express()
const port = process.env.PORTA;
app.use(express.json());
app.use("usuário", clientRota)
app.listen(port, () => {
    console.log("meu servidor está escutando na porta " + port);
})