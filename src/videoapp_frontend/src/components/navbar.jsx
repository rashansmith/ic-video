import React from "react";
import { FaGripLines } from "react-icons/fa";
import Auth from "../services/auth";
export default function Navbar({darkToggle, setDarkToggle}) {
  const [navbarOpen, setNavbarOpen] = React.useState(false);

  function setDarkToggleLocal(e) {
    e.preventDefault()
    if (darkToggle == false) {
      setDarkToggle(true)
    } 

    if(darkToggle == true) {
      setDarkToggle(false)
    }
  }
  return (
    <>
      <nav className={`relative flex flex-wrap items-center justify-between px-2 py-3 ${darkToggle == true ? "bg-white text-black" : "bg-gray-800 text-white"} mb-3`}>
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <a
              className="text-md font-normal leading-relaxed inline-block mr-4 py-2 whitespace-nowraptext-black"
              href="#pablo"
            >
              IC Video
            </a>
            <button
              className=" cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              {/* <i className="fas fa-bars"></i> */}
              <FaGripLines />
            </button>
          </div>
          <div
            className={
              "lg:flex flex-grow items-center" +
              (navbarOpen ? " flex" : " hidden")
            }
            id="example-navbar-danger"
          >
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
              {/* <li className="nav-item">
                <a
                  className="px-3 py-2 flex items-center text-sm  font-light leading-snug  hover:opacity-75"
                  href="/about"
                >
                  <span className="ml-2">About</span>
                </a>
              </li> */}
              <li className="nav-item">
                <a
                  className="px-3 py-2 flex items-center text-sm font-light leading-snug hover:opacity-75"
                  href="https://github.com/rashansmith/ic-video"
                >
                <span className="ml-2">Github</span>
                </a>
              </li>
                <Auth darkToggle={darkToggle} />
                <li className="nav-item ml-2">
                { darkToggle == false ?
                <button
                onClick={e => setDarkToggleLocal(e)}
                className="px-3 py-2 flex items-center border text-sm font-light leading-snug  hover:opacity-75"
                > 
                <span className="">Dark Mode</span></button>
                :
                <button
                onClick={e => setDarkToggleLocal(e)}
                className="px-3 py-2 flex border items-center text-sm font-light leading-snug  hover:opacity-75"
                >
                <span className="">Light Mode</span></button>
                }
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}