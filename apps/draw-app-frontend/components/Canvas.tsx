"use client"

import { initDraw } from "@/draw"
import { useEffect, useRef, useState } from "react"
import { Pencil } from 'lucide-react';
import { Square } from 'lucide-react';
import { Circle } from 'lucide-react';
import { MousePointer } from 'lucide-react';


export default function Canvas({ roomId, socket }: { roomId: string, socket: WebSocket }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [shape, setShape] = useState("mouse");

    function pencilHandler() {
        setShape("pencil")
    }
    function squareHandler() {
        setShape("rect")
    }
    function circleHandler() {
        setShape("circle")
    }
    function mouseHandler() {
        setShape("mouse");
    }



    useEffect(() => {
        if (canvasRef.current) {
            initDraw(canvasRef.current, roomId, socket, shape)
        }
    }, [canvasRef])



    return <div className="flex">
        <div className="flex px-10 bg-gray-700 h-screen  py-20 flex-col">
            <h2 className="my-16 font-black">Tools</h2>
            <MousePointer
                className={`my-6 ${shape === "mouse" ? "bg-blue-500" : "bg-gray-900"} hover:bg-blue-400 border-1 p-2`}
                size={60}
                onClick={mouseHandler}
            />
            <Pencil
                className={`my-6 ${shape === "pencil" ? "bg-blue-500" : "bg-gray-900"} hover:bg-blue-400 border-1 p-2`}
                size={60}
                onClick={pencilHandler}
            />

            <Square
                className={`my-6 ${shape === "rect" ? "bg-blue-500" : "bg-gray-900"} hover:bg-blue-400 border-1 p-2`}
                size={60}
                onClick={squareHandler}
            />

            <Circle
                className={`my-6 ${shape === "circle" ? "bg-blue-500" : "bg-gray-900"} hover:bg-blue-400 border-1 p-2`}
                size={60}
                onClick={circleHandler}
            />


        </div>
        <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
    </div>
}