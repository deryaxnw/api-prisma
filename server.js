import express from "express"
const app = express()

import dotenv from "dotenv";
dotenv.config();

import { clientRota } from "./src/router/user.js";

const port = process.env.PORTA;
app.use(express.json());
app.listen(port, () => {
    console.log("meu servidor está escutando na porta " + port);
})

app.use("/user", clientRota);
