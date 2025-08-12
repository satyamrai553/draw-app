"use client"

import { authService } from "@/services/Auth";
import { roomService } from "@/services/Room";

import { useRouter } from "next/navigation";
import { useEffect, useState, } from "react";


export default function createRoom(){
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [roomName, setRoomName] = useState("");

    const router = useRouter();
    useEffect(()=>{
        const response = authService.getCurrentUser();
        setIsAuthenticated(response);
        if(!response){
            router.push("/signin")
        }
    },[router])



   async function createRoomHandler(){
        const data = await roomService.creatRoom(roomName);
        if(!data){
            return;
        }
        const response = (data.data);
        if(response.roomId){
            router.push(`canvas/${response.roomId}`)
        }

    }

    return (
        <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    Create a Room
                </h1>
                <div className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Enter room name"
                        className="border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onChange={(e)=>{setRoomName(e.target.value)}}
                    />
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-200"
                        onClick={createRoomHandler}
                    >
                        Create Room
                    </button>
                </div>
            </div>
        </div>
    );

}