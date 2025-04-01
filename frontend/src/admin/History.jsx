import React, { useState } from 'react';
import useFetchCardLogs from './js/FetchHistory'
import handleDeleteAll from './js/deleteHistory'

function History() {
  const [historyData, setHistoryData] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

//====================================================//
  useFetchCardLogs(setHistoryData, setLoading, setError);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

//====================================================//
  const handleDelete = () => {
    handleDeleteAll(setHistoryData);
  };
//====================================================//
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Activity History</h1>
        <button onClick={handleDelete} className="bg-rose-400 text-white py-2 px-4 rounded hover:bg-rose-600" > Delete All Logs </button>
      </div>


      <div className="overflow-x-auto" style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <table className="min-w-full">
          <thead className="sticky top-0 border-b-2 border-slate-400 bg-white">
            <tr>
              <th>Card ID</th>
              <th>Role</th>
              <th>Status</th>
              <th>Type</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {historyData.length > 0 ? (
              historyData.map((item, index) => (
                <tr key={index} className="hover:bg-slate-100">
                  <td className="px-6 py-4 text-center text-sm text-gray-700">{item.card_id}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-700">{item.role}</td>
                  <td className={`px-6 py-4 text-center text-sm ${item.status === 'Reactivated' || item.status === 'Created' ? 'text-green-500' : 'text-red-500'}`}> {item.status} </td>
                  <td className={`px-6 py-4 text-center text-sm ${item.type === 'Regular' ? 'text-blue-500' : 'text-yellow-500'}`}>{item.type}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-700">{item.date}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-700">{item.time}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-700">No history available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default History;
