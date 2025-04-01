import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { domain } from '../utils';
import axios from "axios";

function AdminDashboard() {
  const [cards, setCards] = useState([]);
  const [data, setData] = useState({
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Weekly Clients",
        data: [0, 0, 0, 0, 0, 0, 0],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
        pointBackgroundColor: "rgba(255, 99, 132, 1)",
      },
    ],
  });

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          display: false,
        },
        grid: {
          drawTicks: false,
        },
      },
    },
  };
  // ====================================================================== //
  // Fetching weekly deactivated cards data
  useEffect(() => {
    axios
      .get(`${domain}/api/weekly-clients/`)
      .then((response) => {
        const { labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], data = [0, 0, 0, 0, 0, 0, 0] } = response.data;

        setData((prevData) => ({
          ...prevData,
          labels,
          datasets: [
            {
              ...prevData.datasets[0],
              data,
            },
          ],
        }));
      })
      .catch((error) => {
        console.error("Error fetching weekly deactivated cards:", error);
      });
  }, []);

  // ====================================================================== //
  // Fetch cards from backend initially
  const fetchCards = async () => {
    try {
      const response = await fetch(`${domain}/api/list-cards/`);
      if (response.ok) {
        const data = await response.json();
        setCards(data);
      } else {
        console.error("Error fetching cards");
      }
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  };
  useEffect(() => {
    fetchCards();
  }, []);
  // ====================================================================== //

  return (
    <div className="flex-1 w-full p-6">
      
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

      <div className="flex gap-6 mt-10">
        <div className="border rounded-lg w-full h-[500px] max-w-[1200px] mx-auto p-6">
          <h2 className="text-xl font-bold text-center mb-4">Weekly Clients</h2>
          <div className="h-[400px] w-full">
            <Line data={data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
