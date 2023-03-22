## Overview
IC Video is a peer-to-peer video meeting platform service deployed on the Internet Computer Network. Currently it allows for two (2) users to video chat with each other at a time. The protocol that allows us to connect via video is WebRTC. WebRTC, (Web RealTime Communication) is a browser technology for users for communicate with each other in real time. Here is the logic behind this app:

- User 1 creates a room, and a Room Id is generated.
- User 1 can then share this room Id with user 2 
- User 2 then requests to join the room with the specific id 
- Behind the scenes, WebRTC creates an offer (from user 2) to user 1 (to join their room)
- Behind the scenes, user 1 accepts the offer (from user 2)
- Once this is done, the 2 users are able to video chat!


To learn more before you start working with IC Video, see the following documentation available online:
- [Quick Start](https://sdk.dfinity.org/docs/quickstart/quickstart-intro.html)
- [SDK Developer Tools](https://sdk.dfinity.org/docs/developers-guide/sdk-guide.html)
- [Motoko Programming Language Guide](https://sdk.dfinity.org/docs/language-guide/motoko.html)
- [Motoko Language Quick Reference](https://sdk.dfinity.org/docs/language-guide/language-manual.html)
- [JavaScript API Reference](https://erxue-5aaaa-aaaab-qaagq-cai.raw.ic0.app)

## Running this project locally

#### Prerequisites:
- Dfinity SDK: https://sdk.dfinity.org/docs/download.html
- Node/NPM: https://nodejs.org/en/download/ 
- Motoko VSCode Extension: https://marketplace.visualstudio.com/items?itemName=dfinity-foundation.vscode-motoko
(Note): This project was created in a linux environment

#### Instructions to run project on your machine

Step 1:
In one terminal/shell, run ```dfx start --background clean``` to start the local Internet Computer Network

Step 2: 


In another terminal/shell, run 
- ```npm install ```
- Option A: 
    - ```dfx canister create --all``` - Register unique canister identifiers in the project
    - ```dfx build``` - Build the executable canister
    - ```dfx canister install --all``` - Deploy the ic_video project on the local
     network
    - ```dfx canister install --all --mode reinstall``` if you are running it again
- Option B: 
    - ```dfx deploy``` - which handles the three previous steps   

- Take note of the canisterId from the logs, as this will be the address for the website

Step 3:
- View the app in your browser at ``` http://localhost:8000/?canisterId=<your_canister_id> ``` 

- The canisterId can be found in the terminal logs of the commands from Step 2

Step 3: Tear down
- In the very first terminal/shell  run ```dfx stop```
- In the terminal from step 2, run ```Control + C``` to stop the app.


#### Helpful Resources
- Dfinity Full Stack App Session: https://www.youtube.com/watch?v=2miweY9-vZc&list=PLuhDt1vhGcrf4DgKZecU3ar_RA1cB0vUT&index=7
- Tutorial: https://www.youtube.com/watch?v=DvlyzDZDEq4&t=901s
- Google WebRTC Overview: https://www.youtube.com/watch?v=p2HzZkd2A40&t=1453s  


### Error notes
- If you are getting a "ossl-evp-unsupported error, run ```export NODE_OPTIONS=--openssl-legacy-provider```
Source: https://stackoverflow.com/questions/69394632/webpack-build-failing-with-err-ossl-evp-unsupported
