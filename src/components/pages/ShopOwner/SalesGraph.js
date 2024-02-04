import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import Typography from '@mui/material/Typography'; // Import Typography from MUI

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const SalesGraph = ({ orders }) => {
  const { data, totalRevenue, totalOrderCount } = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // Note: January is 0, February is 1, etc.

    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt.seconds * 1000);
      return orderDate.getFullYear() === currentYear && orderDate.getMonth() === currentMonth;
    });

    const groupedByDay = filteredOrders.reduce((acc, order) => {
      const date = new Date(order.createdAt.seconds * 1000);
      const day = date.toISOString().split('T')[0];

      if (!acc[day]) {
        acc[day] = 0;
      }

      const totalOrderValue = order.flowers.reduce((total, flower) => total + flower.price * flower.quantity, 0);
      acc[day] += totalOrderValue;

      return acc;
    }, {});

    const labels = Object.keys(groupedByDay).sort();
    const dataValues = labels.map(label => groupedByDay[label]);

    const totalRevenue = Object.values(groupedByDay).reduce((sum, currentValue) => sum + currentValue, 0);
    const totalOrderCount = filteredOrders.length; // Total number of orders for the current month

    return {
      data: {
        labels,
        datasets: [
          {
            label: 'Sales',
            data: dataValues,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
          },
        ],
      },
      totalRevenue,
      totalOrderCount,
    };
  }, [orders]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales Over the Month',
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          displayFormats: {
            day: 'yyyy-MM-dd'
          },
        },
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Sales ($)',
        },
      },
    },
  };

  return (
    <div>
      <Line data={data} options={options} />
      <Typography variant="h6" component="div" style={{ marginTop: '20px' }}>
        Total Sales Revenue: ${totalRevenue.toFixed(2)}
      </Typography>
      <Typography variant="h6" component="div" style={{ marginTop: '10px' }}>
        Total Orders: {totalOrderCount}
      </Typography>
    </div>
  );
};

export default SalesGraph;
