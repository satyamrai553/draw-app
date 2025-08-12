"use client"

import { initDraw } from "@/draw"
import { useEffect, useRef, useState } from "react"

export default function Canvas({roomId, socket}: {roomId: string, socket: WebSocket} ){
    const canvasRef = useRef<HTMLCanvasElement>(null)



    useEffect(()=>{
        if(canvasRef.current){
           initDraw(canvasRef.current,roomId,socket)
        }
    },[canvasRef])

    

    return <div>
        <canvas ref={canvasRef} width={1920} height={1080}></canvas>
    </div>
}