import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ stateCounts }) => {
    const counts = stateCounts || { 좋음: 0, 보통: 0, 나쁨: 0 };
    const total = counts.좋음 + counts.보통 + counts.나쁨 || 1;

    const data = {
        labels: ["좋음", "보통", "나쁨"],
        datasets: [
            {
                data: [counts.좋음, counts.보통, counts.나쁨],
                backgroundColor: [
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(255, 205, 86, 0.2)",
                    "rgba(255, 99, 132, 0.2)",
                ],
                borderColor: [
                    "rgba(75, 192, 192, 1)",
                    "rgba(255, 205, 86, 1)",
                    "rgba(255, 99, 132, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        plugins: {
            legend: { position: "bottom" },
            tooltip: {
                enabled: true,
                callbacks: {
                    label: function (tooltipItem) {
                        const label = tooltipItem.label || "";
                        const percentage = ((tooltipItem.raw / total) * 100).toFixed(2);
                        return `${label}: ${percentage}%`;
                    },
                },
            },
        },
        maintainAspectRatio: false,
    };

    return (
        <div className="relative w-full h-full">
            <Pie data={data} options={options} />
        </div>
    );
};

export default PieChart;
