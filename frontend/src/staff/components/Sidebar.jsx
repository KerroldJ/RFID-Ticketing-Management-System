import React from 'react'
import { Link } from 'react-router-dom'

function Sidebar() {
  return (
      <div className='p-6'>
          <div className="text-center mb-8">
              <h2 className="text-3xl font-bold">Staff Dashboard</h2>
          </div>

          <div className="w-full flex justify-center">
              <div className="space-y-4 text-center m-6 text-2xl">
                  <ul className="flex flex-col items-center">
                      <li>
                          <Link to="/staff" className="mt-10 font-bold text-lg flex items-center hover:bg-slate-200 py-2 px-4 rounded-lg">
                              <span className="material-icons"></span>
                              <span>Dashboard</span>
                          </Link>
                      </li>
                      <li>
                          <Link to="scan-card" className="mt-10 font-bold text-lg flex items-center hover:bg-slate-200 py-2 px-4 rounded-lg">
                              <span className="material-icons"></span>
                              <span>Scan Cards</span>
                          </Link>
                      </li>
                      <li>
                          <Link to="history" className="mt-10 font-bold text-lg flex items-center hover:bg-slate-200 py-2 px-4 rounded-lg">
                              <span className="material-icons"></span>
                              <span>History</span>
                          </Link>
                      </li>
                    {/*
                      <li>
                          <Link to="settings" className="m-5 flex items-center space-x-2 py-2 px-4 rounded-lg text-white hover:bg-gray-700 hover:text-gray-300 transition-all">
                              <span className="material-icons"></span>
                              <span>Settings</span>
                          </Link>
                      </li>
                    */}
                  </ul>
              </div>
          </div>
      </div>
  )
}

export default Sidebar