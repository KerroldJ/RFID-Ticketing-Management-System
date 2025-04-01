import React, { useState, useEffect } from "react";
import { handleScanCardClick } from './js/deactivateCard'
import {domain} from '../utils'

function ScanCards() {
  const [cards, setCards] = useState([]);
//=================================================================//
// ===== PRE FETCH CARDS ===== //
  useEffect(() => {
    fetch(`${domain}/api/list-cards/`)
      .then((response) => response.json())
      .then((data) => setCards(data))
      .catch((error) => console.error("Error fetching initial data:", error));
  }, []);

//=================================================================//

  return (
    <div className="flex flex-col">
      <div className="flex gap-10 items-center justify-center">
        <div className="w-[300px] bg-blue-400 text-white p-4 rounded-lg text-center">
          <h3 className="text-xl font-semibold">Active Cards</h3>
          <p className="text-3xl font-bold">{cards.filter((card) => card.status === "Activated").length}</p>
        </div>
        <div className="w-[300px] bg-rose-400 text-white p-4 rounded-lg text-center">
          <h3 className="text-xl font-semibold">Deactivated Cards</h3>
          <p className="text-3xl font-bold">{cards.filter((card) => card.status === "Deactivated").length}</p>
        </div>
        <div className="w-[300px] bg-green-400 text-white p-4 rounded-lg text-center">
          <h3 className="text-xl font-semibold">Total Cards</h3>
          <p className="text-3xl font-bold">{cards.length}</p>
        </div>
      </div>

      <div className="flex justify-between p-6">
        <button onClick={() =>handleScanCardClick(setCards)}className="bg-green-400 text-white py-2 px-4 rounded-md"> Scan Card</button>
      </div>

      <div className="flex gap-8 overflow-x-auto text-sm">
        <div className="w-[700px]">
          <h2 className="text-lg mb-4 font-bold">Activated Cards</h2>
          <div className="max-h-[500px] overflow-y-auto">
            <table className="min-w-full rounded-lg rounded-lg">
              <thead className="border-b-2 border-slate-400 sticky top-0 z-10">
                <tr>
                  <th>Card ID</th>
                  <th>Status</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {cards
                  .filter((card) => card.status === 'Activated')
                  .map((card) => (
                    <tr key={card.card_id}>
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
        <div className="w-[800px]">
          <h2 className="text-lg mb-4 font-bold">Deactivated Cards</h2>
          <div className="max-h-[500px] overflow-y-auto">
            <table className="min-w-full rounded-lg">
              <thead className="border-b-2 border-slate-400 sticky top-0 z-10">
                <tr>
                  <th>Card ID</th>
                  <th>Status</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {cards
                  .filter((card) => card.status !== 'Activated')
                  .map((card) => (
                    <tr key={card.card_id}>
                      <td className="text-center p-3">{card.card_id}</td>
                      <td className="text-center p-3 text-red-500">{card.status}</td>
                      <td className={`text-center p-3 ${card.type === 'Regular' ? 'text-blue-500' : 'text-yellow-700'}`}>
                        {card.type} | {card.office_name}
                      </td>
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
