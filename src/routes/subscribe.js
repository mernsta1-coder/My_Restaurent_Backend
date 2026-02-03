import { subscribeUser } from "../controller/subscribe.js";
import express from "express";
 const router = express.Router();

 router.post("/subscribe",subscribeUser);

 export default router


