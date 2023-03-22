import React, { useCallback, useEffect, useState } from "react"
import { AuthClient } from "@dfinity/auth-client"


// Note: This is just a basic example to get you started
export default function Auth({darkToggle}) {
  const [signedIn, setSignedIn] = useState(false)
  const [principal, setPrincipal] = useState("")
  const [client, setClient] = useState(null)

  const initAuth = async () => {
    const client = await AuthClient.create()
    const isAuthenticated = await client.isAuthenticated()

    setClient(client)

    if (isAuthenticated) {
      const identity = client.getIdentity()
      const principal = identity.getPrincipal().toString()
      setSignedIn(true)
      setPrincipal(principal)
    }
  }

  const signIn = async () => {
    const { identity, principal } = await new Promise((resolve, reject) => {
      client.login({
        identityProvider: "https://identity.ic0.app",
        onSuccess: () => {
          const identity = client.getIdentity()
          const principal = identity.getPrincipal().toString()
          resolve({ identity, principal })
        },
        onError: reject,
      })
    })
    setSignedIn(true)
    setPrincipal(principal)
  }

  const signOut = async () => {
    await client.logout()
    setSignedIn(false)
    setPrincipal("")
  }

  useEffect(() => {
    initAuth()
  }, [])

  return (
    <li className={`auth-section ${darkToggle == false ? "text-white" : "text-black"}`}>
      {!signedIn && client ? (
        // <button onClick={signIn} className="auth-button">
        <a href="#" onClick={signIn} className="px-3 py-2 flex items-center text-sm font-light  hover:opacity-75">
            <span className="ml-2">Sign In </span>
        </a>
        // </button>
      ) : null}

      {signedIn ? (
        <>
          {/* <div className="text-sm font-light">Signed in as: {principal}</div> */}
          {/* <button onClick={signOut} className="auth-button">Sign out</button> */}
          <a href="#" onClick={signOut}  className="px-3 py-2 flex items-center text-sm font-light  hover:opacity-75">
            <span className="ml-2">Sign Out </span>
        </a>
        </>
      ) : null}

    </li>
  )
}

export { Auth }