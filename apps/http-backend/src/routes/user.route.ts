import { Router } from "express";
import {register, signin, createRoom} from "../controllers/user.controller"
import { middleware } from "../middlewares";

const router: Router = Router()

router.route("/register").post(register)
router.route("/signin").post(signin)
router.route("/create-room").post(middleware, createRoom)



export default router
