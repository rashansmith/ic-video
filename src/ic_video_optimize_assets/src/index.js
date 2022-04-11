
import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from "@dfinity/principal";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import { AuthClient } from "@dfinity/auth-client";
import {
  idlFactory as ic_video_idl,
  canisterId as ic_video_id,
} from "../../declarations/ic_video_optimize";


// Setting up interaction with Principal
function newIdentity() {
  const entropy = crypto.getRandomValues(new Uint8Array(32));
  const identity = Ed25519KeyIdentity.generate(entropy);
  localStorage.setItem("ic_vid_id", JSON.stringify(identity));
  console.log("New id is: " + JSON.stringify(identity));
  return identity;
}

function readIdentity() {
  const stored = localStorage.getItem("ic_video_id");
  if (!stored) {
    return newIdentity();
  }
  try {
    return Ed25519KeyIdentity.fromJSON(stored);
  } catch (error) {
    console.log(error);
    return newIdentity();
  }
}
const identity = readIdentity();
const user_id = identity.getPrincipal();

const agent = new HttpAgent({ identity });
agent.fetchRootKey();
const ic_vid = Actor.createActor(ic_video_idl, {
  agent,
  canisterId : ic_video_id
});

// Variables related to application logic. Store results from querying the canister.
const $ = document.querySelector.bind(document);
const link = document.createElement('link');
link.setAttribute('rel', 'stylesheet');
link.setAttribute('type', 'text/css');
link.setAttribute('href', 'https://fonts.googleapis.com/css2?family=Comic+Neue&family=Parisienne&display=swap');
document.head.appendChild(link);

let callerId = 'TBD';
let activeRoom;
let remotes = []
let myOffers = []
let myAnswers = []
var localStream
let currentRoomId
var rooms  = [];
var currentRoom = 0;
var joinRoomButton = document.getElementById("joinRoom")
var currentRoomInfo = document.getElementById("currentRoomInfo");
var leaveRoomButton = document.getElementById("leaveRoom")
var roomToJoinId = document.getElementById("roomToJoinId")
var localVideo = document.getElementById("localVideo")
var remoteVideo = document.getElementById("remoteVideo")
var createRoomButton = document.getElementById("createRoom")
var roomIdInfo = document.getElementById("roomIdInfo")
var inviteParticipantId = document.getElementById("inviteParticipantId")
var sendInvite = document.getElementById("inviteParticipantId")
var signUpButton = document.getElementById("signUp")
var vids = document.getElementById("videos")
var controlBar = document.getElementById("controlBar")
var lSpinner = document.getElementById("loadingSpinner")
var startMenu = document.getElementById("optionsBar")
var stopSharingVideo = document.getElementById("stopSharingVideo")
var startSharingVideo = document.getElementById("startSharingVideo")
var welcomePage = document.getElementById("welcomePage")
var welcomeVideo = document.getElementById("welcome")
var getStarted = document.getElementById("getStarted")
var width = 100
var height = 100
var foundOffer = 0
var sentOffer = 0
let poll
let roomInt = 0
var foundAnswer = false;
var creator = false;

// Ice Servers
const iceServers = { iceServers: [
  { urls: "stun:stun.services.mozilla.com" },
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun.stunprotocol.org:3478"},
] , 'sdpSemantics': 'unified-plan'}


// Event listeners for the buttons create, join and leave room
document.addEventListener("DOMContentLoaded", function(event) {
  controlBar.style.display = "none";

  // Create a room listener
  createRoomButton.addEventListener("click", e => {
    e.stopImmediatePropagation()
    let loadingSpinner = document.getElementById("loadingSpinner")
    loadingSpinner.style.display = "flex"
    ic_vid?.createRoom().then(room => {
      activeRoom = room
      currentRoomId = room
      console.log("Just created a room: " + room)
      creator = true
      const node = document.createElement("p");
      const textnode = document.createTextNode("Room Id: " + room);
      node.appendChild(textnode);
      currentRoomInfo.appendChild(node);

      setupLocalRoomOnCreate(() => {
        console.log("Room has been set up")
        loadingSpinner.style.display = "none"
        controlBar.style.display = "flex";
        options.style.display = "none";
       startSharingVideo.style.display = "none";
      })
    })
    poll = setInterval(checkForOffersAndAnswers, 3000)
  })

  // Join a room listener
  joinRoomButton.addEventListener("click", e => {
    e.stopImmediatePropagation()
    currentRoomId = roomToJoinId.value
    let loadingSpinner = document.getElementById("loadingSpinner")
    loadingSpinner.style.display = "flex"
    ic_vid.findRoom(parseInt(parseInt(currentRoomId))).then(result => {
      if(!result[0]) {
        alert("Room does not exist")
        return
      } else {
        setupLocalRoomOnCreate(() => {
          console.log("setup local complete")
          loadingSpinner.style.display = "none"
          const node = document.createElement("p");
          const textnode = document.createTextNode("Room Id: " + currentRoomId);
          node.appendChild(textnode);
          currentRoomInfo.appendChild(node);
        })
      }
    })
  })

  // Leave a room listener
  leaveRoomButton.addEventListener("click", e => {
    e.stopImmediatePropagation()
    leaveRoomButton.disabled = false;
    location.reload()
  })

})

// Set up room you created
const setupLocalRoomOnCreate = (completion) => {
  createRoomButton.disabled = true;
  joinRoomButton.disabled = true;
  navigator.getUserMedia = navigator.getUserMedia ||
                           navigator.webkitGetUserMedia ||
                           navigator.mozGetUserMedia
  navigator.mediaDevices.getUserMedia({ audio: false, video: true }).then(stream => {
  localStream = stream
  let video_ = document.getElementById("localVideo")
  video_.setAttribute('id', "localVideo")
  video_.srcObject = stream
  video_.autoplay = true
  video_.playsInline = true
  video_.controls = false

  completion()
  poll = setInterval(checkForOffersAndAnswers, 5000)
 }).catch(err => console.error(`Failed to connect 1: ${err}`))
}


// Send an offer - sent by user/peer requesting to join a room 
const sendOffer = (recipient) => {
  let loadingSpinner = document.getElementById("loadingSpinner")
  let loadingMessage = document.getElementById("loadingMessage")
  loadingMessage.innerHTML = "Joining Room.."
  setupRemotePeerAndComplete(remote => {
    console.log("This is the remote " + remote)
    remote.idHex = recipient
    console.log("This is the remote idHex " + remote.idHex)
    remote.rtcPeerConnection.createOffer().then(offer => {
      return remote.rtcPeerConnection.setLocalDescription(offer)
    }).then(() => {
       remote.waitForIceDelay = setTimeout(() => {
        const ice_c = JSON.stringify({
          ice: remote.iceCandidates,
          description: remote.rtcPeerConnection.localDescription
        })
        ic_vid.createOffer(recipient, parseInt(currentRoomId), ice_c).then(result => 
          console.log("Result of creating an offer: " + result))
      }, 2000)
    })
    .catch(e => console.log(e))

    // Poll the answers until our offer is accepted. This should have a timeout at
    // some point.
    remote.initiatorTimer = setInterval(() => {
      ic_vid.getRoomAnswers(parseInt(currentRoomId)).then(answers => {
        console.log("The answer is:" + answers)
        answers.forEach(function(answer) {
          if(answer.offer.recipient.toHex() === recipient.toHex() && !remotes.includes(remote)){
            clearInterval(remote.initiatorTimer) 
            var info = answer.description
            var details = JSON.parse(info)
            console.log("This is the new answer:" + details.description)
            remote.rtcPeerConnection.setRemoteDescription(details.description)
            addRemoteIceCandidates(details.ice, remote.rtcPeerConnection)    
            loadingSpinner.style.display = "none"  
            clearInterval(remote.initiatorTimer) 
            ic_vid.removeAnswer(parseInt(currentRoomId), answer).then(result => {
              console.log("just removed this answer: " + result)
            })
            ic_vid.joinRoom(parseInt(currentRoomId), user_id).then(result => {
              console.log("Trying to join room:" + currentRoomId + " " + result)
            })

            // Add remote video to page
            let div_ = document.createElement('div')
            div_.setAttribute('id', 'videoDiv')
            div_.className="col-sm-6"
            
            var vids = document.getElementById("videos")
            div_.append(remote.video)
            vids.appendChild(div_)
            console.log("append video")
            remotes.push(remote)
          }
        })
      })
    }, 1000)
  })
}

// Send answer - when a creator of a room gets an offer, then accept it by sending an answer
const sendAnswer = (offer) => {
  console.log(`sending answer to ${offer.initiator.toHex()}`);
  setupRemotePeerAndComplete(remote => {
    remote.idHex = offer.initiator.toHex()
      
    var details = JSON.parse(offer.description)
    remote.rtcPeerConnection.setRemoteDescription(details.description)
    addRemoteIceCandidates(details.ice, remote.rtcPeerConnection)
  
    remote.rtcPeerConnection.createAnswer().then(answer => {
      return remote.rtcPeerConnection.setLocalDescription(answer)
    }).then(() => {
      remote.waitForIceDelay = setTimeout(() => {
        console.log("about to send answer")
        ic_vid.answerOffer(parseInt(currentRoomId), JSON.stringify({
          ice: remote.iceCandidates,
          description: remote.rtcPeerConnection.localDescription
        }), offer).then(result => {
          console.log("Result of sending answer: " + result)
        })

        // Add remote video to page
        let div_ = document.createElement('div')
        div_.setAttribute('id', 'videoDiv')
        div_.className="col-sm-6"
        
        var vids = document.getElementById("videos")
        div_.append(remote.video)
        lSpinner.style.display = "none"
        vids.appendChild(div_)
        console.log("append video")

        remotes.push(remote)

      }, 2000)
    })
      .catch(e => console.log(e))
  })
}

// Check whether there are outstanding offers to join your room
const checkForOffersAndAnswers = () =>  {
  ic_vid.getRoomOffers(parseInt(currentRoomId)).then(offers => {
    console.log(`Found ${offers.length} offers`)
    offers.forEach(offer => {
      console.log("The offer recipient is: " + offer.recipient )
      console.log("The current user id is: " + user_id)
      var recipient = offer.recipient
      if(recipient.toHex() === user_id.toHex() && !myOffers.includes(offer.initiator.toHex())) {
        myOffers.push(offer.initiator.toHex())
        console.log("found an offer for me")
        sendAnswer(offer)
      }
    })
  })

  // Check if I should be sending offers
  ic_vid?.participants(parseInt(currentRoomId)).then(participants => {
    console.log("looking through participants")
    var p = participants[0]
    for (const participant of participants[0]) {
      if(p != null && user_id != p[0].principal){
        if (!remotes.some(remote => remote.idHex === participant.principal.toHex()) && participant.principal.toHex() != user_id.toHex() && !myAnswers.includes(participant.principal.toHex())) {
          myAnswers.push(participant.principal.toHex())
          console.log(" I dont have this remote participant: " + participant.principal)
          console.log(`Sending an offer to (${participant.principal.toHex()})`)
          sendOffer(participant.principal)
        }
      }
    }
  })
}


// Set up your local instance of the remote user's video stream once you are connected
const setupRemotePeerAndComplete = (completion) => {
  var remote = {
    rtcPeerConnection: new RTCPeerConnection(iceServers),
    iceCandidates: [],
    video: document.createElement("video"),
    stream: new MediaStream(),
    label: document.createElement("span"),
    idHex: '',
    initiatorTimer: null,
    waitForIceDelay: null
  }

  lSpinner.style.display = "flex"
  remote.video.autoplay = true
  remote.video.playsInline = true
  remote.video.controls = false
  remote.video.setAttribute('id', 'remoteVideo')
  
  remote.rtcPeerConnection.onicecandidate = event => {
    event.stopImmediatePropagation()
    console.log("onIceCandidate:", event)
    if (event.candidate) {
      remote.iceCandidates.push({
        label: event.candidate.sdpMLineIndex,
        candidate: event.candidate.candidate
      })
    }
  }

  // Setup receiving track from remote video
  remote.rtcPeerConnection.ontrack = event => {
    console.log("getting remote stream")
    remote.video.srcObject = remote.stream
    remote.stream.addTrack(event.track, remote.stream)
  }

  // Add remote track to local connection
  for (const track of localStream.getTracks()) {
    console.log("add remote track to my collection")
    remote.rtcPeerConnection.addTrack(track);
  }

  completion(remote)
}

// Add ICE candidates received from the partner to local WebRTC object
const addRemoteIceCandidates = (candidates, rtcPeerConnection) => {
  for (const c of candidates) {
    const candidate = new RTCIceCandidate({
      sdpMLineIndex: c.label,
      candidate: c.candidate
    })
    rtcPeerConnection.addIceCandidate(candidate)
  }
}

