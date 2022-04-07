
## Overview
IC Video is a video meeting platform service deployed on the Internet Computer Network. This project deploys a PeerJS based Video Chat application.

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



#### What is WebRTC
Web RealTime Communication is a browser technology for users for communicate with each other in real time. 
The PeerJs https://peerjs.com/docs.html library is used in this project to make working with WebRTC a bit simpler. 



#### Instructions to run project on your machine
In one terminal/shell, run ```dfx start``` to start the local Internet Computer Network

In another terminal/shell, run 
- Step 1: 
- Option A: 
    - ```dfx canister create --all``` - Register unique canister identifiers in the project
    - ```dfx build``` - Build the executable canister
    - ```dfx canister install --all``` - Deploy the ic_video project on the local
     network
    - ```dfx canister install --all --mode reinstall``` if you are running it again
- Option B: 
    - ```dfx deploy``` - which handles the three previous steps

Step 2:
- ```run npm install``` - Make sure modules are available in your project directory
- ```npm run start``` - Launches the frontend on localhost:8080


#### Helpful Resources
- Dfinity Full Stack App Session: https://www.youtube.com/watch?v=2miweY9-vZc&list=PLuhDt1vhGcrf4DgKZecU3ar_RA1cB0vUT&index=7
- Tutorial: https://www.youtube.com/watch?v=DvlyzDZDEq4&t=901s
- Google WebRTC Overview: https://www.youtube.com/watch?v=p2HzZkd2A40&t=1453s  



### Error notes
- If you are getting a "ossl-evp-unsupported error, run ```export NODE_OPTIONS=--openssl-legacy-provider```
Source: https://stackoverflow.com/questions/69394632/webpack-build-failing-with-err-ossl-evp-unsupported
