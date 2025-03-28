import React, { useState } from "react";
import deactivateAllCards from './js/deactivateAllCards';
import handleClearButtonClick from './js/deleteCards';
import handleScanCardClick from './js/ScanCards';
import handleAddButtonClick from './js/addCards';
import useAutoDeactivateCards from './js/AutoDeactivateCards'
import useFetchCards from "./js/FetchCards";


function ManageCards() {
  const [cards, setCards] = useState([]); 

//=================================================================//
  const addCards = () => {
    handleAddButtonClick(setCards);
  };

  const handleDeactivate = () => {
    deactivateAllCards(setCards); 
  };

  const handleClear = () => {
    handleClearButtonClick(setCards);
  };

  const ScanCards = () => {
    handleScanCardClick(setCards);
  }

  useAutoDeactivateCards();
  useFetchCards(setCards);

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

      <div className="flex p-6 justify-between">
        <div className="flex space-x-4">
          <button onClick={addCards} className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md">
            Add Card
          </button>
          <button onClick={ScanCards} className="bg-green-500 text-white py-2 px-4 rounded-md shadow-md">
            Activate Card
          </button>
        </div>
        <div className="flex space-x-4">
          <button onClick={handleDeactivate} className="bg-gray-500 text-white py-2 px-4 rounded-md shadow-md">
            Deactivate Regular Cards
          </button>
          <button onClick={handleClear} className="bg-red-500 text-white py-2 px-4 rounded-md shadow-md">
            Delete All Cards
          </button>
        </div>
      </div>

      <div className="flex gap-8 overflow-x-auto text-sm">
        <div className="w-1/2">
          <h2 className="text-lg mb-4 text-center font-bold">Activated Cards</h2>
          <div className="max-h-[500px] overflow-y-auto">
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
          <h2 className="text-lg mb-4 text-center font-bold">Deactivated Cards</h2>
          <div className="max-h-[500px] overflow-y-auto">
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
                      <td className={`text-center p-3 ${card.type === 'Regular' ? 'text-blue-500' : 'text-yellow-700'}`}>{card.type} | {card.office_name}</td>
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

export default ManageCards;