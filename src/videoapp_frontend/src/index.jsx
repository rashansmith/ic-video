// import React from "react";
// import "../assets/main.css";
// import { createRoot } from 'react-dom/client';

// const container = document.getElementById('app');
// const root = createRoot(container);

// const App = require("./pages/App").default;

// root.render(<App />);

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "../assets/main.css";
import Home from "./pages/Home";
import About from "./pages/About";
import { createRoot } from 'react-dom/client';

export default function App() {
  return (
     <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
     </BrowserRouter>
  );
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);
