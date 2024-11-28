import { Router } from "express";
import { ClientController } from "../controllers/clientController.js";

export const clientRota = Router()
clientRota.post("/", ClientController.create)
clientRota.get("/buscar", ClientController.getAll)