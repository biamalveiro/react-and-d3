import React, { useState } from "react";

import ChartNaive from "./ChartNaive";
import Chart from "./Chart";
import ChartVisx from "./ChartVisx";

import "./App.css";

const buttons = ["naive", "standard", "visx"];

function App() {
  const [option, setOption] = useState("visx");

  const renderChart = () => {
    switch (option) {
      case "naive":
        return <ChartNaive />;
      case "standard":
        return <Chart />;
      case "visx":
        return <ChartVisx />;
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <header className="text-center mt-16 mb-32">
        <h1 className="text-2xl font-bold text-gray-800	">D3 @ React</h1>
        <h2 className="text-l text-gray-500	">Wit-Sharpening Sessions</h2>
      </header>
      {renderChart()}
      <div className="flex flex-row m-auto w-min my-5">
        {buttons.map((value) => (
          <button
            key={`btn-${value}`}
            className={`border rounded border-gray-700 mx-1 px-2 py-1 ${
              option === value ? "bg-gray-700 text-white	" : null
            }`}
            onClick={() => setOption(value)}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
