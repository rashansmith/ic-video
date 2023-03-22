export const idlFactory = ({ IDL }) => {
  const List = IDL.Rec();
  const RoomId = IDL.Nat;
  const RoomId__1 = IDL.Nat;
  const MyOffer__1 = IDL.Record({
    'initiator' : IDL.Principal,
    'recipient' : IDL.Principal,
    'description' : IDL.Text,
    'roomId' : RoomId__1,
  });
  const Participant__1 = IDL.Record({
    'principal' : IDL.Principal,
    'alias' : IDL.Text,
  });
  List.fill(IDL.Opt(IDL.Tuple(Participant__1, List)));
  const MyRoom = IDL.Record({
    'participants' : List,
    'name' : IDL.Text,
    'roomId' : RoomId__1,
  });
  const MyOffer = IDL.Record({
    'initiator' : IDL.Principal,
    'recipient' : IDL.Principal,
    'description' : IDL.Text,
    'roomId' : RoomId__1,
  });
  const MyAnswer = IDL.Record({
    'offer' : MyOffer,
    'description' : IDL.Text,
    'roomId' : IDL.Nat,
  });
  const Participant = IDL.Record({
    'principal' : IDL.Principal,
    'alias' : IDL.Text,
  });
  return IDL.Service({
    'answerOffer' : IDL.Func(
        [RoomId, IDL.Text, MyOffer__1],
        [IDL.Opt(IDL.Text)],
        [],
      ),
    'createOffer' : IDL.Func(
        [IDL.Principal, RoomId, IDL.Text],
        [IDL.Opt(IDL.Text)],
        [],
      ),
    'createRoom' : IDL.Func([], [IDL.Nat], []),
    'findRoom' : IDL.Func([RoomId], [IDL.Opt(MyRoom)], ['query']),
    'getAllOffers' : IDL.Func([], [IDL.Vec(MyOffer__1)], ['query']),
    'getAllRooms' : IDL.Func([], [IDL.Vec(MyRoom)], ['query']),
    'getRoomAnswers' : IDL.Func([RoomId], [IDL.Vec(MyAnswer)], ['query']),
    'getRoomOffers' : IDL.Func([RoomId], [IDL.Vec(MyOffer__1)], ['query']),
    'greet' : IDL.Func([IDL.Text], [IDL.Text], ['query']),
    'isParticipantInRoom' : IDL.Func(
        [IDL.Principal, RoomId],
        [IDL.Bool],
        ['query'],
      ),
    'joinRoom' : IDL.Func([RoomId, IDL.Principal], [IDL.Opt(IDL.Text)], []),
    'participants' : IDL.Func(
        [RoomId],
        [IDL.Opt(IDL.Vec(Participant))],
        ['query'],
      ),
    'removeAnswer' : IDL.Func([RoomId, MyAnswer], [IDL.Text], []),
  });
};
export const init = ({ IDL }) => { return []; };
