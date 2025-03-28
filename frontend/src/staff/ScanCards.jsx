import React, { useState, useEffect } from "react";
import { handleScanCardClick } from './js/deactivateCard'
import {domain} from '../utils'

function ScanCards() {
  const [cards, setCards] = useState([]);
//=================================================================//
// ===== PRE FETCH CARDS ===== //
  useEffect(() => {
    fetch(`${domain}/api/cards/`)
      .then((response) => response.json())
      .then((data) => setCards(data))
      .catch((error) => console.error("Error fetching initial data:", error));
  }, []);

//=================================================================//

  return (
    <div className="flex flex-col bg-gray-100">
      <div className="grid grid-cols-3 gap-6 p-6">

        <div className="bg-blue-600 text-white p-4 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold">Active Cards</h3>
          <p className="text-3xl font-bold">{cards.filter((card) => card.status === "Activated").length}</p>
        </div>

        <div className="bg-red-600 text-white p-4 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold">Deactivated Cards</h3>
          <p className="text-3xl font-bold">{cards.filter((card) => card.status === "Deactivated").length}</p>
        </div>

        <div className="bg-green-600 text-white p-4 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold">Total Cards</h3>
          <p className="text-3xl font-bold">{cards.length}</p>
        </div>
      </div>
      <div className="flex justify-between p-6">
        <button onClick={() =>handleScanCardClick(setCards)}className="bg-green-500 text-white py-2 px-4 rounded-md shadow-md"> Scan Card</button>
      </div>

      <div className="flex gap-8 overflow-x-auto text-sm">
        <div className="w-1/2">
          <h2 className="text-lg font-bold mb-4 text-center">Activated Cards</h2>
          <div className="max-h-[500px] overflow-y-auto relative">
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead className="bg-gray-800 text-white sticky top-0 z-10">
                <tr>
                  <th className="text-center p-3">Card ID</th>
                  <th className="text-center p-3">Status</th>
                  <th className="text-center p-3">Type</th>
                  <th className="text-center p-3">Date</th>
                  <th className="text-center p-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {cards
                  .filter((card) => card.status === 'Activated')
                  .map((card) => (
                    <tr key={card.card_id} className="border-b">
                      <td className="text-center p-3">{card.card_id}</td>
                      <td className="text-center p-3 text-green-500">{card.status}</td>
                      <td className={`text-center p-3 ${card.type === 'Regular' ? 'text-blue-500' : 'text-yellow-700'}`}>{card.type} | {card.office_name}</td>
                      <td className="text-center p-3">{card.date}</td>
                      <td className="text-center p-3">{card.time}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="w-1/2">
          <h2 className="text-lg font-bold mb-4 text-center">Deactivated Cards</h2>
          <div className="max-h-[500px] overflow-y-auto relative">
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead className="bg-gray-800 text-white sticky top-0 z-10">
                <tr>
                  <th className="text-center p-3">Card ID</th>
                  <th className="text-center p-3">Status</th>
                  <th className="text-center p-3">Type</th>
                  <th className="text-center p-3">Date</th>
                  <th className="text-center p-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {cards
                  .filter((card) => card.status !== 'Activated')
                  .map((card) => (
                    <tr key={card.card_id} className="border-b">
                      <td className="text-center p-3">{card.card_id}</td>
                      <td className="text-center p-3 text-red-500">{card.status}</td>
                      <td className={`text-center p-3 ${card.type === 'Regular' ? 'text-blue-500' : 'text-yellow-500'}`}>{card.type}</td>
                      <td className="text-center p-3">{card.date}</td>
                      <td className="text-center p-3">{card.time}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ScanCards;
