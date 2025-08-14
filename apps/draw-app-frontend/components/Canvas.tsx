"use client"

import { initDraw } from "@/draw"
import { useEffect, useRef, useState } from "react"
import { Pencil } from 'lucide-react';
import { Square } from 'lucide-react';
import { Circle } from 'lucide-react';
import { MousePointer } from 'lucide-react';


export default function Canvas({ roomId, socket }: { roomId: string, socket: WebSocket }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const shapeRef = useRef("mouse");
    const [shape, setShape] = useState("mouse");

    useEffect(() => {
        shapeRef.current = shape; // keep ref updated with latest shape
    }, [shape]);

    useEffect(() => {
        if (canvasRef.current) {
            initDraw(canvasRef.current, roomId, socket, shapeRef);
        }
    }, [canvasRef, roomId, socket]);

    return (
        <div className="flex overflow-hidden">
            <div className="flex px-10 bg-gray-700 h-screen py-20 flex-col">
                <h2 className="my-16 font-black">Tools</h2>
                <MousePointer className={`my-6 ${shape === "mouse" ? "bg-blue-500" : "bg-gray-900"} p-2`}
                    size={60} onClick={() => setShape("mouse")} />
                <Pencil className={`my-6 ${shape === "pencil" ? "bg-blue-500" : "bg-gray-900"} p-2`}
                    size={60} onClick={() => setShape("pencil")} />
                <Square className={`my-6 ${shape === "rect" ? "bg-blue-500" : "bg-gray-900"} p-2`}
                    size={60} onClick={() => setShape("rect")} />
                <Circle className={`my-6 ${shape === "circle" ? "bg-blue-500" : "bg-gray-900"} p-2`}
                    size={60} onClick={() => setShape("circle")} />
            </div>
            <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
        </div>
    );
}