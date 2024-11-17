import React, { useState } from "react";
import GraphTooltip from "./components/Graphtool";
import "./App.css";

function App() {
  const [rangeValues, setRangeValues] = useState({
    Device1: { low: "", high: "", temperature: "" },
    Device2: { low: "", high: "", temperature: "" },
    Device3: { low: "", high: "", temperature: "" },
  });

  const [hoverInfo, setHoverInfo] = useState({
    device: null,
    lastUpdated: "",
    isActive: null,
    visible: false,
    graphData: null,
  });

  const fetchDeviceInfo = async (device) => {
    const dummyData = {
      Device1: {
        lastUpdated: "2024-11-16 14:30:00",
        isActive: true,
        graphData: {
          time: ["14:00", "14:30", "15:00", "15:30", "16:00"],
          temperature: [22, 25, 23, 27, 26],
        },
      },
      Device2: {
        lastUpdated: "2024-11-16 15:00:00",
        isActive: false,
        graphData: {
          time: ["14:00", "14:30", "15:00", "15:30", "16:00"],
          temperature: [20, 21, 19, 22, 24],
        },
      },
      Device3: {
        lastUpdated: "2024-11-16 16:15:00",
        isActive: true,
        graphData: {
          time: ["14:00", "14:30", "15:00", "15:30", "16:00"],
          temperature: [23, 24, 22, 21, 25],
        },
      },
    };

    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulated delay

    setHoverInfo({
      device,
      lastUpdated: dummyData[device].lastUpdated,
      isActive: dummyData[device].isActive,
      visible: true,
      graphData: dummyData[device].graphData,
    });
  };

  const handleMouseEnter = (device) => {
    fetchDeviceInfo(device);
  };

  const handleMouseLeave = () => {
    setHoverInfo({ device: null, lastUpdated: "", isActive: null, visible: false, graphData: null });
  };

  const handleRangeChange = (device, field, value) => {
    const numericValue = parseInt(value, 10);

    if (field === "low" && (numericValue < 0 || numericValue > 100)) {
      alert("Low Range must be between 0 and 100.");
    } else if (field === "high" && (numericValue < 0 || numericValue > 100)) {
      alert("High Range must be between 0 and 100.");
    } else {
      setRangeValues({
        ...rangeValues,
        [device]: {
          ...rangeValues[device],
          [field]: value,
        },
      });
    }
  };

  return (
    <div className="app-container">
      <h1>IoT-Based Temperature Control for Industrial Application</h1>
      <div className="content">
        {["Device1", "Device2", "Device3"].map((device) => (
          <div
            className="device-row"
            key={device}
            onMouseEnter={() => handleMouseEnter(device)}
            onMouseLeave={handleMouseLeave}
          >
            {/* Device Box */}
            <div className="device-box">{device}</div>

            {/* Control Unit for Each Device */}
            <div className="control-box">
              <h2>{device} Control</h2>
              <div className="input-row">
                <label>
                  Low Range:
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Low"
                    value={rangeValues[device].low}
                    onChange={(e) => handleRangeChange(device, "low", e.target.value)}
                  />
                </label>
                <label>
                  High Range:
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="High"
                    value={rangeValues[device].high}
                    onChange={(e) => handleRangeChange(device, "high", e.target.value)}
                  />
                </label>
                <button>Submit</button>
              </div>
            </div>

            {/* Graph Tooltip */}
            {hoverInfo.device === device && hoverInfo.visible && (
              <GraphTooltip
                graphData={hoverInfo.graphData}
                lastUpdated={hoverInfo.lastUpdated}
                isActive={hoverInfo.isActive}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
