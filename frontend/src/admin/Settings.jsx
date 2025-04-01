import React, { useState } from "react";
import axios from "axios";
import { domain } from '../utils';


function Settings() {
  const [passwordData, setPasswordData] = useState({
    username: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      const response = await axios({
        method: 'POST',
        url: `${domain}/api/update-password/`,
        data: {
          username: passwordData.username,
          old_password: passwordData.currentPassword,
          new_password: passwordData.newPassword,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.data.message) {
        setMessage(response.data.message);
        setError('');
      }
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Something went wrong. Please try again.");
      }
      setMessage("");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto mt-10 border-2 border-slate-400 rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <h2 className="text-lg font-semibold mb-4">Username</h2>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium">
            Username
          </label>
          <input type="text" name="username" id="username" value={passwordData.username} onChange={handleInputChange} placeholder="Enter your username"
            className="w-full px-3 py-2 border border-slate-400 rounded-md"
          />
        </div>

      <h2 className="text-lg font-semibold mb-4">Change Password</h2>
        <form onSubmit={handlePasswordSubmit}>
          <div className="mb-4"> 
            <label htmlFor="currentPassword" className="text-sm font-medium">
              Current Password
            </label>

            <input type="password" name="currentPassword" id="currentPassword" value={passwordData.currentPassword} onChange={handleInputChange}
              placeholder="Enter your current password"
              className="w-full px-3 py-2 border border-slate-400 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input type="password" name="newPassword" id="newPassword" value={passwordData.newPassword} onChange={handleInputChange} placeholder="Enter your new password" className="w-full px-3 py-2 border border-slate-400 rounded-md"/>
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input type="password" name="confirmPassword" id="confirmPassword" value={passwordData.confirmPassword} onChange={handleInputChange} placeholder="Confirm your new password" className="w-full px-3 py-2 border border-slate-400 rounded-md"/>
          </div>

          <div className="flex justify-end">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none">
              Save Password
            </button>
          </div>
        </form>
  
      {message && <div className="text-green-500">{message}</div>}
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
}

export default Settings;
