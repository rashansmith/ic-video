import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import List "mo:base/List";
import Option "mo:base/Option";
import Debug "mo:base/Debug";
import Trie "mo:base/Trie";
import Nat32 "mo:base/Nat32";
import Types "./types";
import Utils "./utils";


actor {

    // Types
    public type Participant = Types.Participant;
    public type RoomId = Types.RoomId;
    public type MyAnswer = Types.MyAnswer;
    public type MyOffer = Types.MyOffer;
    public type MyRoom = Types.MyRoom;

    // Variables
    flexible var roomIdNum : Nat = 0;
    flexible var myRooms : List.List<MyRoom> = List.nil();
    flexible var myOpenOffers : List.List<MyOffer> = List.nil();
    flexible var myAnswers : List.List<MyAnswer> = List.nil();
    flexible var myAcceptances : List.List<MyAnswer> = List.nil();

    // Sample function
    public query func greet(name : Text) : async Text {
      return "Hello, " # name # "!";
    };
    // Create Room Ids
    func newRoomId() : Nat {
        roomIdNum += 1;
        return roomIdNum;
    };

    // Create a new room (and include the creator as a participant)
    public shared(msg) func createRoom() : async Nat {
        var id = newRoomId();
        myRooms := List.push({ roomId = id; name = "roomName"; participants = List.make({
            principal = msg.caller;
            alias = "creatorAlias";
        })}, myRooms);
        return id;
    };

    // Get all rooms 
    public query func getAllRooms() : async [MyRoom] {
        return List.toArray(
            myRooms);
    };

    // Send an invite to join a specific room
    public shared(msg) func createOffer(peerPrincipal : Principal, room : RoomId, desc : Text) : async ?Text {
        if (Option.isNull(findRoom2(room))) {
            return ?"Room not found";
        };

        if (Option.isSome(List.find(myOpenOffers, func (o : MyOffer) : Bool { 
            o.roomId == room and 
            (
              (o.initiator == msg.caller and o.recipient == peerPrincipal) or 
              (o.initiator == peerPrincipal and o.recipient == msg.caller)
            )
        }))) {
            return ?"Already existing offer";
        };
        
        if (Option.isSome(List.find(myAnswers, func (a : MyAnswer) : Bool { 
            a.offer.roomId == room and 
            (
              (a.offer.initiator == msg.caller and a.offer.recipient == peerPrincipal) or 
              (a.offer.initiator == peerPrincipal and a.offer.recipient == msg.caller)
            )
        }))) {
            return ?"Already existing accepted offer";
        };

        var offer: MyOffer = {
        initiator = msg.caller;
        recipient = peerPrincipal;
        roomId = room;
        description = desc;
        };
        myOpenOffers := List.push(offer, myOpenOffers);
        return ?"Done";

    };



    // Get all offers specific user
    public shared query(msg) func getAllOffers() : async [MyOffer] {
        return List.toArray(
            List.filter(myOpenOffers, func (offer : MyOffer) : Bool {
                   Debug.print(debug_show(offer.recipient));
                offer.recipient == msg.caller;
            }))
    };

    // Get all offers for a specific room
    public shared query(msg) func getRoomOffers(room : RoomId) : async [MyOffer] {
        // let n : async ?MyRoom = findRoom(room);
        // let m : ?MyRoom = await n;
        // Note: shared query(msg) functions cant call other shared query functions!
        let n : ?MyRoom = findRoom2(room);
        let m : ?MyRoom = n;
        return List.toArray(
            List.filter(myOpenOffers, func (offer : MyOffer) : Bool {
                offer.roomId == room and offer.recipient == msg.caller;
            })
        );
    };

    // Find a Room by its room id
    public shared query(msg) func findRoom(room : RoomId) : async ?MyRoom {
        List.find(myRooms, func ({ roomId }: MyRoom): Bool = room == roomId);
    };

    // Find a Room by its room id
    func findRoom2(room : RoomId) : ?MyRoom {
        List.find(myRooms, func ({ roomId }: MyRoom): Bool = room == roomId);
    };

    // Join a Room 
    public shared(msg) func joinRoom(room : RoomId, partner : Principal) : async ?Text {
        let n : async Bool = isParticipantInRoom(msg.caller, room);
        let m : Bool = await n;
        if (not m) {
        addParticipantToRoom(room, func(r : MyRoom) : MyRoom { 
            { roomId = r.roomId;
                name = r.name;
                participants = List.push({
                    principal = partner;
                    alias = "partnerAlias";
                }, r.participants);
            } 
        });
        return ?"added caller to room"
        };

        return ?"caller already in room"
    };

      // Get all participants in a room
    public shared query func participants(room : RoomId) : async (?[Participant]) {
        switch(findRoom2(room)) {
            case null null;
            case (?r) ?(List.toArray(r.participants));
        };
    };

    // Find out if a participant is in a room 
    public shared query func isParticipantInRoom(participant : Principal, room : RoomId) : async Bool {
        // let n : async ?MyRoom = findRoom(room);
        // let m : ?MyRoom = await n;
        let n : ?MyRoom = findRoom2(room);
        let m : ?MyRoom = n;
        switch(m) {
            case (null) {
                return false;
            };
            case (?m) {
               Option.isSome(List.find(m.participants, func (p : Participant): Bool = p.principal == participant));
            };
        };
    };


    // Update a room by adding a new participant to the room
    func addParticipantToRoom(room : RoomId, f : (MyRoom) -> MyRoom) {
        myRooms := List.map(myRooms, func (r : MyRoom): MyRoom { 
            if (r.roomId == room) { 
                f(r) 
            } else { 
                r
        } })
    };

    // Answer an offer
    public shared(msg) func answerOffer(room: RoomId, desc : Text, offr : MyOffer) : async ?Text {
        let n : async ?MyRoom = findRoom(room);
        let m : ?MyRoom = await n;
        switch(m) {
            case (null) {
                return ?"No room found to answer to";
            };
            case (?m) {
                var answer : MyAnswer = {
                    roomId =  room;
                    offer  = offr;
                    description = desc;
                };
                myAnswers := List.push(answer, myAnswers);
                return ?"Offer found, and now its been answered";
            };
        };
        if (Option.isNull(await findRoom(room))) {
            return ?"Room not found"
        };
        
        let offer = List.find(myOpenOffers, matchOffer(room, offr.initiator, offr.recipient));

        switch offer {
            case null ?"No offer found";
            case (?MyOffer) {
                myOpenOffers := Utils.listKeep(myOpenOffers, matchOffer(room, offr.initiator, offr.recipient));
                myAnswers := List.push({
                    roomId = room;
                    offer = offr;
                    description = desc;
                }, myAnswers);
                null
            }
        }
    };

    // Get all answers
    public shared query(msg) func getRoomAnswers(room : RoomId) : async [MyAnswer] {
        return List.toArray(
            List.filter(myAnswers, func (answer : MyAnswer) : Bool {
                answer.roomId == room and answer.offer.initiator == msg.caller
            })
        );
    };

    public shared(msg) func removeAnswer(room : RoomId, answer : MyAnswer) : async Text {
        myAnswers :=  List.filter(myAnswers, func (answer : MyAnswer) : Bool {
            answer.roomId == room and answer.offer.initiator == msg.caller
        });
        return "Answer removed";
    };

    // Update a room
    func updateRoom(room : RoomId, f : (MyRoom) -> MyRoom) {
    myRooms := List.map(myRooms, func (r : MyRoom): MyRoom { 
        if (r.roomId == room) { 
            f(r) 
        } else { 
            r
        } })
    };


    // Match an offer
    func matchOffer(room : RoomId, initiator : Principal, recipient : Principal) : (MyOffer) -> Bool {
        func (offer : MyOffer) : Bool =
            offer.roomId == room and offer.initiator == initiator and offer.recipient == recipient
    };

};
