import React, {useState, useEffect} from "react";
import { createRoom,  setLocalStreamVid , checkForOffersAndAnswers, joinRoom, getRoomId, hangUp} from "../services/video";

export default function VideoContainer({startSession, setStartSession, joinSession, setJoinSession, hangUp, setHangUp, roomId, setRoomId}) {
    const [localRoomId, setLocalRoomId] = useState(null)
    const [localStream, setLocalStream] = useState(null)
    const [remoteStream, setRemoteStream] = useState(null)
    const [showRoomId, setShowRoomId] = useState(false)
    const [showVideo, setShowVideo] = useState(true)
    const [showAudio, setShowAudio] = useState(true)

    function toggleShowRoomId(e) {
        e.preventDefault
        if(showRoomId == false){
            setShowRoomId(true)
            setLocalRoomId(getRoomId().toString())
        } else {
            if(showRoomId == true){
                setShowRoomId(false)
            } 
        }
    }

    function toggleShowVideo(e) {
        e.preventDefault
        if(showVideo == false){
            setShowVideo(true)
            const videoTrack = localStream.getVideoTracks()[0];
            videoTrack.enabled = !videoTrack.enabled;
        } else {
            if(showVideo == true){
                setShowVideo(false)
                const videoTrack = localStream.getVideoTracks()[0];
                videoTrack.enabled = !videoTrack.enabled;
            } 
        }
    }

    function toggleShowAudio(e) {
        e.preventDefault
        if(showAudio == false){
            setShowAudio(true)
            const audioTrack = localStream.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled;
        } else {
            if(showAudio == true){
                setShowAudio(false)
                const audioTrack = localStream.getAudioTracks()[0];
                audioTrack.enabled = !audioTrack.enabled;
            } 
        }
    }

    function hangUpVideo(e) {
        e.preventDefault
        const videoTrack = localStream.getVideoTracks()[0];
        videoTrack.enabled = !videoTrack.enabled;
        const audioTrack = localStream.getAudioTracks()[0];
        audioTrack.enabled = !audioTrack.enabled;
        videoTrack.stop()
        setHangUp(true)
        window.location.href = 'http://localhost:8080';
    }

    async function create() {
        const r_id = await createRoom()
        return r_id
    }

    useEffect(() => {
        try {

            setHangUp(false)
            const videoSetup = async () => {
            // If current user is starting a session, create room, start their local video and wait for offers
            if(localRoomId == null && startSession == true) {
                // Create a room
                create().then(result => {
                    console.log("roomId", result)
                    setLocalRoomId(result) 
                    setRoomId(result)  
                })
  
                if(localStream == null) {
                    // Start streaming local video
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
                    setLocalStream(stream)
                    setLocalStreamVid(stream)
                }

                // Check for offers and answers
                // setInterval(checkForOffersAndAnswers, 3000)
                setInterval(function() {
                    const result_ = checkForOffersAndAnswers()
                    if(result_ != null) {
                        setRemoteStream(result_)
                    }
                }, 3000)
            }
            
            // If current user is joining a room, send an offer and wait for acceptance to join
            if(localRoomId == null && joinSession == true) {
                console.log("here join")
                const remoteRoomId = await joinRoom(roomId) 
                console.log("here join 2")
                console.log("roomId", roomId)
                setLocalRoomId(roomId)
                
                if(localStream == null) {
                    // Start streaming local video
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
                    setLocalStream(stream)
                    setLocalStreamVid(stream)
                }

                 // Send offer to room and wait for answer
                 setInterval(function() {
                        const result_ = checkForOffersAndAnswers
                        if(result_ != null) {
                            setRemoteStream(result_)
                            setLocalRoomId(roomId)
                        }
                    }, 3000)
            }
            }
            videoSetup().catch(console.error)
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    }, []);

    return(
        <div>
            <div id="currentRoom" className="text-sm text-center font-light mr-3">
                    <div className="mt-4 mb-2">
                        <button id="invite" onClick={toggleShowRoomId} className="rounded-sm text-sm text-center bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 mx-2">Invite</button>
                    </div>
                    { showRoomId && 
                        <div value={getRoomId() || 0} className="text-center">Share Room Id: {localRoomId}</div>
                    }
            </div>
            <div className="flex flex-cols-2 sm:flex-wrap xs:flex-wrap lg:flex-wrap justify-center mt-12">
                <div id="localVideo" className="justify-left p-4 aspect-video">
                        <video
                        autoPlay
                        width="500" 
                        height="800"
                        ref={video => {
                            if (video) {
                                if(hangUp){
                                    video.srcObject = null;
                                } 
                                video.srcObject = localStream;
                            } 
                        }} />
                </div>
                <div id="remoteVideo"className="justify-right p-4" >
                { remoteStream && 
                    <video
                    autoPlay
                    width="500" 
                    height="800"
                    ref={video => {
                        if (video) {
                            if(hangUp){
                                video.srcObject = null;
                            } 
                            video.srcObject = remoteStream;
                        } 
                    }} />
                }
                </div>  
            </div>
            <div id="controlBar" className="flex flex-cols-1 sm:flex-wrap xs:flex-wrap lg:flex-wrap  justify-center "> 
            <div id="icons" className="py-10">
                { showAudio ?
                        <button id="mute" onClick={e => toggleShowAudio(e)} className="rounded-sm text-sm bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 mx-2">Mute</button>
                        :
                        <button id="unmute" onClick={e => toggleShowAudio(e)} className="rounded-sm text-sm bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 mx-2">Unmute</button>
                }
                {/* <button id="mute" className="rounded-sm text-sm bg-gray-600 hover:bg-gray-500 text-white px-2 py-1 mx-2">Mute</button> */}
                
                { showVideo ?
                        <button id="stopSharingVideo" onClick={e => toggleShowVideo(e)} className="rounded-sm text-sm bg-green-600 hover:bg-green-500 text-white px-2 py-1 mx-2">Hide Video</button>
                        :
                        <button id="startSharingVideo" onClick={e => toggleShowVideo(e)} className="rounded-sm text-sm bg-green-600 hover:bg-green-500 text-white px-2 py-1 mx-2">Show Video</button>
                }
                <button id="hangUp" onClick={e => hangUpVideo(e)} className="rounded-sm text-sm bg-red-600 hover:bg-red-500 text-white px-2 py-1 mx-2">Hang Up</button>
            </div>
          </div>
        </div>
    )
}