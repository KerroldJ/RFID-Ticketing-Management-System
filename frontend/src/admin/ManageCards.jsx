import React, { useState } from "react";
import deactivateAllCards from './js/deactivateAllCards';
import handleClearButtonClick from './js/deleteAllCards';
import handleScanCardClick from './js/ScanCards';
import handleAddButtonClick from './js/addCards';
import useAutoDeactivateCards from './js/AutoDeactivateCards'
import useFetchCards from "./js/FetchCards";

import axios from 'axios';
import Swal from 'sweetalert2';
import { domain } from "../utils";


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
//==================================================================//
const handleDelete = (cardId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete card ${cardId}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${domain}/api/delete-card/${cardId}/`).then(() => {
            setCards(cards.filter(card => card.card_id !== cardId));
            Swal.fire(
              'Deleted!',
              'The card has been deleted.',
              'success'
            );
          }).catch((error) => {
            console.error('Error deleting card:', error);
            Swal.fire(
              'Error!',
              'Failed to delete the card.',
              'error'
            );
          });
      }
    });
  };

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

      <div className="flex p-6 justify-between mt-10">
        <div className="flex space-x-4">
          <button onClick={addCards} className="bg-blue-400 text-white py-2 px-4 rounded-md shadow-md">
            Add Card
          </button>
          <button onClick={ScanCards} className="bg-green-400 text-white py-2 px-4 rounded-md shadow-md">
            Activate Card
          </button>
        </div>
        <div className="flex space-x-4">
          <button onClick={handleDeactivate} className="bg-gray-400 text-white py-2 px-4 rounded-md shadow-md">
            Deactivate Regular Cards
          </button>
          <button onClick={handleClear} className="bg-rose-400 text-white py-2 px-4 rounded-md shadow-md">
            Delete All Cards
          </button>
        </div>
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
                  <th>Action</th>
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
                      <td className="text-center p-3">
                        <button onClick={() => handleDelete(card.card_id)} className="text-red-500 hover:text-red-700 focus:outline-none" title="Delete Card">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4M3 7h18"/>
                          </svg>
                        </button>
                      </td>
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
                    <tr key={card.card_id} className="border-b">
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

export default ManageCards;