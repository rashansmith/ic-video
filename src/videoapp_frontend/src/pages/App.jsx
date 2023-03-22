// import React, { useEffect, useState } from "react";
// import { videoapp_backend } from "../../../declarations/videoapp_backend";
// import NavBar from "../components/navbar";
// import logo from "../../assets/logo2.svg";

// function App() {
//   const [greeting, setGreeting] = useState("");
//   const [error, setError] = useState("");
//   useEffect(() => {
//     (async () => {
//       try {
//         const result = await videoapp_backend.greet("React");
//         setGreeting(result);
//       } catch (error) {
//         console.error(error);
//         setError(error.message);
//       }
//     })();
//   }, []);
//   return (
//     <div className="bg-white text-black mx-4">
//       {/* <img src={logo} className="w-40 h-40" alt="logo" /> */}
//       {/* <div className="font-normal" >{greeting}</div> */}
//       {/* <p className="whitespace-pre text-red-600">{error}</p> */}
//       <NavBar />
//       <div className="text-center mt-12">

//       </div>
//     </div>
//   );
// }

// export default App;