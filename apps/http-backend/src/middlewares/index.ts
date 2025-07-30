import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import {JWT_SECRET} from "@repo/backend-common/config"
// Extend Express Request interface to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}



export function middleware( req: Request, res: Response, next: NextFunction){
    const token = req.headers["authorization"] ?? "";
    const jwtSecret = JWT_SECRET;
    if (!jwtSecret) {
        return res.status(500).json({ error: "JWT secret is not defined" });
    }
    const decoded = jwt.verify(token, jwtSecret);

    if (decoded && typeof decoded === "object" && "userId" in decoded) {
        req.userId = (decoded as jwt.JwtPayload).userId as string;
        next();
    } else {
        res.status(403).json({
            message: "Unauthorized"
        });
    }

}