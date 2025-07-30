import { Router } from "express";
import {register, login, createRoom} from "../controllers/user.controller"
import { middleware } from "../middlewares";

const router: Router = Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/create-room").post(middleware, createRoom)



export default router
