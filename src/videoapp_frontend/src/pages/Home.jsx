import React, { useEffect, useState } from "react";
import { videoapp_backend } from "../../../declarations/videoapp_backend";
import NavBar from "../components/navbar";
import HomePageContainer from "../components/home_page";
import VideoPageContainer from "../components/video_page";
import logo from "../../assets/logo2.svg";

export default function Home() {
  // const [greeting, setGreeting] = useState("");
  // const [error, setError] = useState("");
  const [startSession, setStartSession] = useState(false)
  const [joinSession, setJoinSession] = useState(false)
  const [hangUp, setHangUp] = useState(true)
  const [roomId, setRoomId] = useState("")
  const [darkToggle, setDarkToggle] = useState(true)

  return (
    <div className={`${darkToggle == false ? "bg-gray-800 text-white" : "bg-white text-black"} px-2  h-screen`}>
      <NavBar darkToggle={darkToggle} setDarkToggle={setDarkToggle} />
     
      { startSession == false && joinSession == false && hangUp == true ?
             <HomePageContainer 
             startSession={startSession} setStartSession={setStartSession}
             joinSession={joinSession} setJoinSession={setJoinSession}
             hangUp={hangUp} setHangUp={setHangUp}
             setRoomId={setRoomId} roomId={roomId} darkToggle={darkToggle} />
        :
          <VideoPageContainer 
             startSession={startSession} setStartSession={setStartSession}
             joinSession={joinSession} setJoinSession={setJoinSession} 
             hangUp={hangUp} setHangUp={setHangUp}
             roomId={roomId} setRoomId={setRoomId}
          />
      }

    </div>
  );
}