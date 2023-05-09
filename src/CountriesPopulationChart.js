import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

function CountiesPopulationChart() {
    const [chartData, setChartData] = useState(null);
    const [selectedContinent, setSelectedContinent] = useState("");
    const [selectedSort, setSelectedSort] = useState("");
    const [isLinearScale, setIsLinearScale] = useState(true);
    const chartRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://restcountries.com/v3.1/all");
                const data = await response.json();
                const continentData = {};

                data.forEach((country) => {
                    const continent = country.continents;

                    if (!continentData[continent]) {
                        continentData[continent] = [];
                    }

                    continentData[continent].push({
                        name: country.name.common,
                        population: country.population,
                        flag: country.flag,
                    });
                });

                // Sort the data based on selectedSort value
                Object.values(continentData).forEach((continent) => {
                    continent.sort((a, b) => {
                        if (selectedSort === "asc") {
                            return a.population - b.population;
                        } else if (selectedSort === "desc") {
                            return b.population - a.population;
                        }
                        return 0;
                    });
                });

                setChartData(continentData);
            } catch (error) {
                console.error("Error fetching API data:", error);
            }
        };

        fetchData();
    }, [selectedSort]);

    useEffect(() => {
        if (chartData) {
            const data = selectedContinent ? chartData[selectedContinent] : [];

            const initialChartConfig = {
                type: "bar",
                data: {
                    labels: data.map((country) => country.flag + " " + country.name),
                    datasets: [
                        {
                            label: "Population",
                            data: data.map((country) => country.population),
                            backgroundColor: "rgba(255, 99, 132, 0.2)",
                            borderColor: "rgba(255, 99, 132, 1)",
                            borderWidth: 1,
                            hoverBackgroundColor: "rgba(255, 99, 132, 0.5)",
                            hoverBorderColor: "rgba(255, 99, 132, 1)",
                        },
                    ],
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: "Country",
                            },
                            ticks: {
                                maxRotation: 90,
                                minRotation: -5,
                            },
                        },
                        y: {
                            type: isLinearScale ? "linear" : "logarithmic",
                            title: {
                                display: true,
                                text: "Population",
                            },
                        },
                    },
                },
            };

            if (chartRef.current) {
                chartRef.current.destroy();
            }

            const chartCanvas = document.getElementById("chart");
            if (chartCanvas) {
                chartRef.current = new Chart(chartCanvas, initialChartConfig);
            }
        }
    }, [chartData, selectedContinent, isLinearScale]);

    const handleSelectedContinentChange = (event) => {
        setSelectedContinent(event.target.value);
    };

    const handleSelectedSortChange = (event) => {
        setSelectedSort(event.target.value);
    };

    const handleSelectedLogChange = (event) => {
        setIsLinearScale(event.target.value === "linear");
    };

    return (
        <div className="container mx-auto">
            {chartData && (
                <div className="flex justify-center my-4 relative inline-block">
                    <select
                        className="px-4 py-2 border border-gray-300 rounded-md mx-4"
                        value={selectedContinent}
                        onChange={handleSelectedContinentChange}>
                        <option value="">Select Continent</option>

                        {Object.keys(chartData).map((continent) => (
                            <option key={continent} value={continent}>
                                {continent}
                            </option>
                        ))}
                    </select>

                    <select
                        className="px-4 py-2 border border-gray-300 rounded-md"
                        value={selectedSort}
                        onChange={handleSelectedSortChange}
                        disabled={!selectedContinent}>
                        <option value="">Select Sort</option>
                        <option value="asc">Sort Ascending</option>
                        <option value="desc">Sort Descending</option>
                    </select>

                    <select
                        className="px-4 py-2 border border-gray-300 rounded-md mx-4"
                        value={isLinearScale ? "linear" : "logarithmic"}
                        onChange={handleSelectedLogChange}
                        disabled={!selectedContinent}>
                        <option value="linear">Linear Scale</option>
                        <option value="logarithmic">Logarithmic Scale</option>
                    </select>
                </div>
            )}

            {selectedContinent ? (
                <div className="flex justify-center my-4">
                    <canvas id="chart" />
                </div>
            ) : (
                <p className="text-center text-red-700">
                    Please select a continent to view its countries and their populations.
                </p>
            )}
        </div>
    );
}

export default CountiesPopulationChart;
