import React, { useState, useEffect } from 'react';
import fetchCardLogs from './js/fetchCardLogs'

function StaffHistory() {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ============================================================== //
  useEffect(() => {
    fetchCardLogs(setHistoryData, setLoading, setError);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

// ============================================================== //  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Activity History</h1>
      <div className="overflow-x-auto" style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="sticky top-0 bg-gray-800 text-white">
            <tr>
              <th className="px-6 py-3 text-center text-sm font-medium uppercase tracking-wider">Card ID</th>
              <th className="px-6 py-3 text-center text-sm font-medium uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-center text-sm font-medium uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-center text-sm font-medium uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-center text-sm font-medium uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-center text-sm font-medium uppercase tracking-wider">Time</th>
            </tr>
          </thead>
          <tbody>
            {historyData.length > 0 ? (
              historyData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="px-6 py-4 text-center text-sm text-gray-700">{item.card_id}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-700">{item.role}</td>
                  <td className={`px-6 py-4 text-center text-sm ${item.status === 'Reactivated' || item.status === 'Created' ? 'text-green-500' : 'text-red-500'}`}>{item.status}</td>
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
export default StaffHistory;
