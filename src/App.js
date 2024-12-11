import React, { useState } from "react";
import Login from "./components/login";
import GraphTooltip from "./components/Graphtool";
import "./App.css";

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null); // Track logged-in user
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
    try {
      const response = await fetch("http://127.0.0.1:5000/api/devices");
      if (!response.ok) throw new Error("Failed to fetch device data.");
      const data = await response.json();

      setHoverInfo({
        device,
        lastUpdated: data[device].lastUpdated,
        isActive: data[device].isActive,
        visible: true,
        graphData: data[device].graphData,
      });
    } catch (error) {
      console.error("Error fetching device data:", error);
    }
  };

  const handleSubmit = async (device) => {
    const deviceData = rangeValues[device];
  
    try {
      const response = await fetch("http://127.0.0.1:5000/api/update-device", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          device,
          low: deviceData.low,
          high: deviceData.high,
        }),
      });
  
      if (!response.ok) throw new Error("Failed to update device data.");
  
      const data = await response.json();
      alert(`Device ${device} updated successfully: ${data.message}`);
    } catch (error) {
      console.error("Error updating device data:", error);
      alert("Failed to update the device. Please try again.");
    }
  };
  
  const handleMouseEnter = (device) => {
    fetchDeviceInfo(device);
  };

  const handleMouseLeave = () => {
    setHoverInfo({
      device: null,
      lastUpdated: "",
      isActive: null,
      visible: false,
      graphData: null,
    });
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

  // Handle successful login
  const handleLoginSuccess = (username) => {
    setLoggedInUser(username);
  };

  // Logout handler (optional)
  const handleLogout = () => {
    setLoggedInUser(null);
  };

  if (!loggedInUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      <h1>IoT-Based Temperature Control for Industrial Application</h1>
      {/* <button className="logout-button" onClick={handleLogout}>
        Logout
      </button> */}
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
                {/* Updated Submit Button */}
                <button onClick={() => handleSubmit(device)}>Submit</button>
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
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default App;
