import type { Principal } from '@dfinity/principal';
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
  'answerOffer' : (arg_0: RoomId, arg_1: string, arg_2: MyOffer__1) => Promise<
      [] | [string]
    >,
  'createOffer' : (arg_0: Principal, arg_1: RoomId, arg_2: string) => Promise<
      [] | [string]
    >,
  'createRoom' : () => Promise<bigint>,
  'findRoom' : (arg_0: RoomId) => Promise<[] | [MyRoom]>,
  'getAllOffers' : () => Promise<Array<MyOffer__1>>,
  'getAllRooms' : () => Promise<Array<MyRoom>>,
  'getRoomAnswers' : (arg_0: RoomId) => Promise<Array<MyAnswer>>,
  'getRoomOffers' : (arg_0: RoomId) => Promise<Array<MyOffer__1>>,
  'isParticipantInRoom' : (arg_0: Principal, arg_1: RoomId) => Promise<boolean>,
  'joinRoom' : (arg_0: RoomId, arg_1: Principal) => Promise<[] | [string]>,
  'participants' : (arg_0: RoomId) => Promise<[] | [Array<Participant>]>,
  'removeAnswer' : (arg_0: RoomId, arg_1: MyAnswer) => Promise<string>,
}
