import React from 'react'

function Header({onLogout}) {

  return (
      <header className="p-4 flex items-center justify-between border-b-2">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <button onClick={onLogout} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              Logout
          </button>
      </header>
  )
}

export default Header