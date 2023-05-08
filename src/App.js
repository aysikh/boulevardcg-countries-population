import React from "react";
import CountriesPopulationChart from "./CountriesPopulationChart";

function App() {
    return (
        <div className="container mx-auto">
            <h2 className="text-2xl font-bold text-center my-4">
                Countries Populations by Continent
            </h2>
            <CountriesPopulationChart />
        </div>
    );
}

export default App;
