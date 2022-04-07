import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Option "mo:base/Option";
import List "mo:base/List";

module {
    public type RoomId = Nat;

    public type Participant = {
        principal : Principal;
        alias : Text;
    };

    public type MyAnswer = {
        roomId: Nat;
        offer: MyOffer;
        description : Text;
    };

    public type MyOffer = {
        initiator : Principal;
        recipient : Principal;
        roomId : RoomId;
        description : Text;
    };

    public type MyRoom = {
        roomId : RoomId;
        name : Text;
        participants : List.List<Participant>;
    };

}