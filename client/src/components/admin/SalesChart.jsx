import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function SalesChart({ salesData }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Sales Revenue',
        font: { size: 18 }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value;
          }
        }
      }
    }
  };

  const data = {
    labels: salesData.map(d => d.month),
    datasets: [
      {
        label: 'Sales ($)',
        data: salesData.map(d => d.sales),
        backgroundColor: 'rgba(239, 68, 68, 0.7)', // red-500 with opacity
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      },
    ],
  };

  return <div className="bg-white p-6 rounded-lg shadow-md"><Bar options={options} data={data} /></div>;
}