import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ stateCounts }) => {
    const counts = stateCounts || { 좋음: 0, 보통: 0, 나쁨: 0 };
    const total = counts.좋음 + counts.보통 + counts.나쁨 || 1;

    const data = {
        labels: ["Min", "More", "Max"],
        datasets: [
            {
                data: [counts.나쁨, counts.보통, counts.좋음],
                backgroundColor: [
                    "rgba(248, 113, 113, 0.3)",
                    "rgba(250, 204, 21, 0.3)",
                    "rgba(102, 187, 106, 0.3)",
                ],
                borderColor: [
                    "rgba(248, 113, 113, 1)",
                    "rgba(250, 204, 21, 1)",
                    "rgba(102, 187, 106, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        plugins: {
            legend: { 
                position: "bottom",
                labels: {
                    boxWidth : 12
                }
            },
            tooltip: {
                enabled: true,
                callbacks: {
                    label: function (tooltipItem) {
                        const percentage = ((tooltipItem.raw / total) * 100).toFixed(2);
                        return ` ${percentage}%`;
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
