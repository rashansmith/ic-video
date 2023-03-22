import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type List = [] | [[Participant__1, List]];
export interface MyAnswer {
  'offer' : MyOffer,
  'description' : string,
  'roomId' : bigint,
}
export interface MyOffer {
  'initiator' : Principal,
  'recipient' : Principal,
  'description' : string,
  'roomId' : RoomId__1,
}
export interface MyOffer__1 {
  'initiator' : Principal,
  'recipient' : Principal,
  'description' : string,
  'roomId' : RoomId__1,
}
export interface MyRoom {
  'participants' : List,
  'name' : string,
  'roomId' : RoomId__1,
}
export interface Participant { 'principal' : Principal, 'alias' : string }
export interface Participant__1 { 'principal' : Principal, 'alias' : string }
export type RoomId = bigint;
export type RoomId__1 = bigint;
export interface _SERVICE {
  'answerOffer' : ActorMethod<[RoomId, string, MyOffer__1], [] | [string]>,
  'createOffer' : ActorMethod<[Principal, RoomId, string], [] | [string]>,
  'createRoom' : ActorMethod<[], bigint>,
  'findRoom' : ActorMethod<[RoomId], [] | [MyRoom]>,
  'getAllOffers' : ActorMethod<[], Array<MyOffer__1>>,
  'getAllRooms' : ActorMethod<[], Array<MyRoom>>,
  'getRoomAnswers' : ActorMethod<[RoomId], Array<MyAnswer>>,
  'getRoomOffers' : ActorMethod<[RoomId], Array<MyOffer__1>>,
  'greet' : ActorMethod<[string], string>,
  'isParticipantInRoom' : ActorMethod<[Principal, RoomId], boolean>,
  'joinRoom' : ActorMethod<[RoomId, Principal], [] | [string]>,
  'participants' : ActorMethod<[RoomId], [] | [Array<Participant>]>,
  'removeAnswer' : ActorMethod<[RoomId, MyAnswer], string>,
}
