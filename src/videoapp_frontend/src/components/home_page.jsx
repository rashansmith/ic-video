import React, { useEffect, useState} from "react";
import DfinityAuth from "../services/auth";
import { AuthClient } from "@dfinity/auth-client";
import VideoContainer from "./video_page";
import { videoapp_backend } from "../../../declarations/videoapp_backend";

export default function HomePageContainer({startSession, setStartSession, joinSession, setJoinSession, roomId, setRoomId, darkToggle}) {
    const [room, setRoom] = useState("")
    const [joinError, setJoinError] = useState(false)
    
    function onChange(e) {
        e.preventDefault()
        setRoom(Number(e.target.value))
    }

    function startSessionFunc(e) {
        console.log("here")
        e.preventDefault()
        setStartSession(true)
    }

    async function joinSessionFunc(e) {
        console.log("here")
        e.preventDefault()
        const getRoom = await videoapp_backend.findRoom(room);
        if(!getRoom[0]) {
            console.log("room not found")
            setJoinError(true)
        } else {
            setRoomId(room)
            setJoinError(false)
            setJoinSession(true)
            console.log("room found")
        }
    }
    
    return(
        <div className="px-2">
            <div className="text-center text-md font-light mt-16">
                Start or Join a Peer to Peer video session
            </div>
            <div className="px-4">
                <div className="flex mx-4 flex-cols justify-center text-center text-sm font-light mt-16 text-white">
                    <button onClick={startSessionFunc} className={`rounded-sm shadow-md px-5 py-1 ${darkToggle == false ? "bg-gray-700 hover:bg-gray-600" : "bg-green-600 hover:bg-green-500 text-white"}text-white mx-4`}>
                        Start Session
                    </button>
                </div>
                <div className="text-center mt-8 mb-8 text-sm">
                    OR
                </div>
                <div className="flex flex-cols mx-4 justify-center text-center text-sm font-light mt-5">
                    <input 
                    value={room || ""}
                    onChange={onChange}
                    placeholder="Enter room number"
                    className={`focus:border-transparent focus:ring-transparent rounded-sm shadow-sm px-5 py-1 border-b ${darkToggle == false ? "bg-gray-700 border-gray-800 text-white" :  "text-black border-green-600"} mx-4`} />
                    <button onClick={joinSessionFunc} className={`rounded-sm shadow-md px-5 py-1 ${darkToggle == false ? "bg-gray-700 hover:bg-gray-600" : "bg-green-600 hover:bg-green-500"}  text-white`}>
                        Join
                    </button>
                    {
                        joinError &&
                        <div className="ml-2 mt-1 text-red-500 font-light text-sm">Room not found</div>
                    }
                </div>
            </div>
        </div>
    )

}