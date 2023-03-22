import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from "@dfinity/principal";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import { AuthClient } from "@dfinity/auth-client";
import {
  idlFactory,
  canisterId,
} from "../../../declarations/videoapp_backend";

// Variables
var activeRoom
var currentRoomId
var localStream
var localVideoTrack
var videoTrack
var remotes = []
var creator = false
let myOffers = []
let myAnswers = []

// Create new Identity - to test app without auth
function newIdentity() {
    const entropy = crypto.getRandomValues(new Uint8Array(32));
    const identity = Ed25519KeyIdentity.generate(entropy);
    localStorage.setItem("ic_vid_id", JSON.stringify(identity));
    // console.log("New id is: " + JSON.stringify(identity));
    return identity;
}

// Assign new Identity
const identity = newIdentity();
const user_id = identity

// Create Agent
const agent = new HttpAgent({ identity });
agent.fetchRootKey();
const ic_vid = Actor.createActor(idlFactory, {
  agent,
  canisterId
});

// Ice Servers
const iceServers = { iceServers: [
    { urls: "stun:stun.services.mozilla.com" },
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun.stunprotocol.org:3478"},
] , 'sdpSemantics': 'unified-plan'}

// Create/Start a room session
export function createRoom() {
    ic_vid?.createRoom().then(room => {
        activeRoom = room
        currentRoomId = room
        console.log("Just created a room: " + currentRoomId)
        creator = true
        console.log("heerere")
        return currentRoomId
      })
}

// Join a room session
export function joinRoom(room) {
  currentRoomId = room
  ic_vid.findRoom(parseInt(parseInt(currentRoomId))).then(result => {
    if(!result[0]) {
      return 0
    } else {
      return room
    }
  })
}

export function getRoomId() {
  return currentRoomId
}

// Set Local Stream
export function setLocalStreamVid(stream) {
    console.log("got stream")
    localStream = stream
    videoTrack = localStream.getVideoTracks()[0];
}

// Send an offer - sent by user/peer requesting to join a room 
const sendOffer = (recipient) => {
  console.log("Now trying")
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
            clearInterval(remote.initiatorTimer) 
            ic_vid.removeAnswer(parseInt(currentRoomId), answer).then(result => {
              console.log("just removed this answer: " + result)
            })
            ic_vid.joinRoom(parseInt(currentRoomId), user_id.getPrincipal()).then(result => {
              console.log("Trying to join room:" + currentRoomId + " " + result)
            })

            remotes.push(remote)
            return remote.stream
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

        remotes.push(remote)
        return remote.stream

      }, 2000)
    })
      .catch(e => console.log(e))
  })
}

// Check whether there are outstanding offers to join your room
export function checkForOffersAndAnswers() {
    ic_vid.getRoomOffers(parseInt(currentRoomId)).then(offers => {
      console.log(`Found ${offers.length} offers`)
      offers.forEach(offer => {
        console.log("The offer recipient is: " + offer.recipient )
        console.log("The current user id is: " + user_id)
        var recipient = offer.recipient
        if(recipient.toHex() === user_id.getPrincipal().toHex() && !myOffers.includes(offer.initiator.toHex())) {
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
          if (!remotes.some(remote => remote.idHex === participant.principal.toHex()) && participant.principal.toHex() != user_id.getPrincipal().toHex() && !myAnswers.includes(participant.principal.toHex())) {
            myAnswers.push(participant.principal.toHex())
            console.log(" I dont have this remote participant: " + participant.principal)
            console.log(`Sending an offer to (${participant.principal.toHex()})`)
            sendOffer(participant.principal)
          }
        }
      }
    })

    if(remotes[0] == null) {
      return null
    } else {
      return remotes[0].stream
    }
}

// Set up your local instance of the remote user's video stream once you are connected
export const setupRemotePeerAndComplete = (completion) =>  {
  var remote = {
    rtcPeerConnection: new RTCPeerConnection(iceServers),
    iceCandidates: [],
    stream: new MediaStream(),
    idHex: '',
    initiatorTimer: null,
    waitForIceDelay: null
  }

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
    remote.stream.addTrack(event.track, remote.stream)
  }

  // Add remote track to local connection
  for (const track of localStream.getTracks()) {
    console.log("add remote track to my collection")
    remote.rtcPeerConnection.addTrack(track);
  }

  completion(remote)
  return remote.stream
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





