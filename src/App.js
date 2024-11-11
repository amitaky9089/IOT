import React, { useState } from "react";
import "./App.css";

function App() {
  const [rangeValues, setRangeValues] = useState({
    Device1: { low: "", high: "", temperature: "" },
    Device2: { low: "", high: "", temperature: "" },
    Device3: { low: "", high: "", temperature: "" }
  });

  const handleRangeChange = (device, field, value) => {
    const numericValue = parseInt(value, 10);

    // Validate Low Range and High Range inputs for Device
    if (field === "low" && (numericValue < 0 || numericValue > 100)) {
      alert("Low Range must be between 0 and 100.");
    } else if (field === "high" && (numericValue < 0 || numericValue > 100)) {
      alert("High Range must be between 0 and 100.");
    } else {
      // Update the range values in state
      setRangeValues({
        ...rangeValues,
        [device]: {
          ...rangeValues[device],
          [field]: value
        }
      });
    }
  };

  const handleTemperatureChange = (device, value) => {
    const temperatureValue = parseInt(value, 10);
    const { low, high } = rangeValues[device];

    // Validate if the temperature is an integer and within the specified range
    if (isNaN(temperatureValue)) {
      alert("Temperature must be an integer.");
    } else if (low !== "" && high !== "" && (temperatureValue < low || temperatureValue > high)) {
      alert(`Temperature must be between ${low} and ${high}.`);
    } else {
      // Update the temperature value in state
      setRangeValues({
        ...rangeValues,
        [device]: {
          ...rangeValues[device],
          temperature: value
        }
      });
    }
  };

  return (
    <div className="app-container">
      <h1>IoT-Based Temperature Control for Industrial Application</h1>
      <div className="content">
        {["Device1", "Device2", "Device3"].map((device) => (
          <div className="device-row" key={device}>
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
                <label>
                  Temperature:
                  <input
                    type="number"
                    placeholder="Temperature"
                    value={rangeValues[device].temperature}
                    onChange={(e) => handleTemperatureChange(device, e.target.value)}
                  />
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;


