import { Bar, Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

// Registrar los componentes necesarios para Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend)

export function BarChart() {
  const data = {
    labels: ["Piscina", "Cancha de Tenis", "Sala de Pesas", "Cancha de Fútbol", "Sala de Yoga"],
    datasets: [
      {
        label: "Reservas",
        data: [65, 59, 80, 81, 56],
        backgroundColor: "rgba(99, 102, 241, 0.5)",
        borderColor: "rgb(99, 102, 241)",
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  }

  return <Bar data={data} options={options} />
}

export function LineChart() {
  const data = {
    labels: ["8:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"],
    datasets: [
      {
        label: "Reservas",
        data: [12, 19, 3, 5, 2, 30, 45],
        fill: false,
        backgroundColor: "rgb(99, 102, 241)",
        borderColor: "rgba(99, 102, 241, 0.5)",
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  }

  return <Line data={data} options={options} />
}
