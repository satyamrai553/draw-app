import { Router } from "express";
import {register, login, createRoom} from "../controllers/user.controller"

const router: Router = Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/create-room").post(createRoom)



export default router
