// ColMap.jsx
import React, { useState, useMemo, useEffect, useRef } from "react";
import { Stage, Layer, Image, Line } from "react-konva";
import { MAPS } from "./mapLookup.js";
import "./map.css";

// --- Helper hook to load images ---
const useImage = (url) => {
  const [image, setImage] = useState(null);
  useEffect(() => {
    if (!url) return;
    const img = new window.Image();
    img.src = url;
    img.onload = () => setImage(img);
  }, [url]);
  return image;
};

// --- MapCanvas Component ---
function MapCanvas({ imageSrc, width = 1000, height = 600, lines, setLines, undoneLines, setUndoneLines }) {
  const backgroundImage = useImage(imageSrc);

  const [brushColor, setBrushColor] = useState("#ff0000");
  const [brushWidth, setBrushWidth] = useState(4);

  const isDrawing = useRef(false);

  // --- Mouse events ---
  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines([
      ...lines,
      { points: [pos.x, pos.y], color: brushColor, width: brushWidth },
    ]);
    setUndoneLines([]); // clear redo stack
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([pos.x, pos.y]);
    lines.splice(lines.length - 1, 1, lastLine);
    setLines([...lines]);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  // --- Undo / Redo / Clear ---
  const handleUndo = () => {
    if (lines.length === 0) return;
    const last = lines[lines.length - 1];
    setLines(lines.slice(0, -1));
    setUndoneLines([last, ...undoneLines]);
  };

  const handleRedo = () => {
    if (undoneLines.length === 0) return;
    const [first, ...rest] = undoneLines;
    setLines([...lines, first]);
    setUndoneLines(rest);
  };

  const handleClear = () => {
    setLines([]);
    setUndoneLines([]);
  };

  // --- Compute scale to fit image ---
  const scale =
    backgroundImage && Math.min(width / backgroundImage.width, height / backgroundImage.height);

  return (
    <div>
      {/* --- Brush & Action Controls --- */}
      <div className="map-canvas-controls">
        <label>
          Brush Color:
          <input
            type="color"
            value={brushColor}
            onChange={(e) => setBrushColor(e.target.value)}
            style={{ marginLeft: "4px" }}
          />
        </label>

        <label>
          Brush Width:
          <input
            type="number"
            min="1"
            max="50"
            value={brushWidth}
            onChange={(e) => setBrushWidth(Number(e.target.value))}
            style={{ width: "60px", marginLeft: "4px" }}
          />
        </label>

        <button onClick={handleUndo} disabled={lines.length === 0}>
          Undo
        </button>
        <button onClick={handleRedo} disabled={undoneLines.length === 0}>
          Redo
        </button>
        <button
          onClick={handleClear}
          disabled={lines.length === 0 && undoneLines.length === 0}
        >
          Clear
        </button>
      </div>

      {/* --- Canvas --- */}
      <Stage
        width={width}
        height={height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ border: "1px solid #ccc", borderRadius: "6px" }}
      >
        <Layer>
          {backgroundImage && (
            <Image
              image={backgroundImage}
              x={width / 2}
              y={height / 2}
              offsetX={backgroundImage.width / 2}
              offsetY={backgroundImage.height / 2}
              scaleX={scale}
              scaleY={scale}
            />
          )}
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.color}
              strokeWidth={line.width}
              tension={0.5}
              lineCap="round"
              lineJoin="round"
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}

// --- ColMap Component ---
export function ColMap() {
  const raidNames = Object.keys(MAPS);
  const [selectedRaid, setSelectedRaid] = useState(raidNames[0]);
  const encounterNames = useMemo(
    () => Object.keys(MAPS[selectedRaid] || {}),
    [selectedRaid]
  );
  const [selectedEncounter, setSelectedEncounter] = useState(encounterNames[0]);

  const [lines, setLines] = useState([]);
  const [undoneLines, setUndoneLines] = useState([]);
  const [shareCode, setShareCode] = useState("");
  const [joinCode, setJoinCode] = useState("");

  // Reset encounter when raid changes
  useEffect(() => {
    setSelectedEncounter(encounterNames[0]);
    setLines([]);
    setUndoneLines([]);
  }, [selectedRaid, encounterNames]);

  const currentMap = MAPS[selectedRaid]?.[selectedEncounter];

  // --- Generate Code ---
  const handleGenerateCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const savedMaps = JSON.parse(localStorage.getItem("sharedMaps") || "{}");
    savedMaps[code] = {
      raid: selectedRaid,
      encounter: selectedEncounter,
      lines,
    };
    localStorage.setItem("sharedMaps", JSON.stringify(savedMaps));
    setShareCode(code);
  };

  // --- Copy code to clipboard ---
  const handleCopyCode = () => {
    if (!shareCode) return;
    navigator.clipboard.writeText(shareCode).then(() => {
      //alert("Code copied!"); // optional small notification
    });
  };

  // --- Join Map ---
  const handleJoin = () => {
    const savedMaps = JSON.parse(localStorage.getItem("sharedMaps") || "{}");
    if (!savedMaps[joinCode]) {
      alert("Invalid code!");
      return;
    }
    const { raid, encounter, lines: savedLines } = savedMaps[joinCode];
    setSelectedRaid(raid);
    setSelectedEncounter(encounter);
    setLines(savedLines);
    setUndoneLines([]);
  };

  return (
    <main className="col-map-page">
      {/* --- Controls --- */}
      <section className="map-controls">
        <label>
          Raid:
          <select value={selectedRaid} onChange={(e) => setSelectedRaid(e.target.value)}>
            {raidNames.map((raid) => (
              <option key={raid} value={raid}>
                {raid}
              </option>
            ))}
          </select>
        </label>

        <label>
          Encounter:
          <select
            value={selectedEncounter}
            onChange={(e) => setSelectedEncounter(e.target.value)}
          >
            {encounterNames.map((enc) => (
              <option key={enc} value={enc}>
                {enc}
              </option>
            ))}
          </select>
        </label>
      </section>

      {/* --- Map Canvas --- */}
      <section className="map-area">
        {currentMap && (
          <MapCanvas
            imageSrc={currentMap}
            lines={lines}
            setLines={setLines}
            undoneLines={undoneLines}
            setUndoneLines={setUndoneLines}
          />
        )}
      </section>

      {/* --- Collaboration Section --- */}
      <section className="collab">
        <div className="share">
          <h3>Share This Map</h3>
          <button onClick={handleGenerateCode}>Generate Code</button>
          {shareCode && (
            <div style={{ marginTop: "0.5rem" }}>
              <span style={{ fontWeight: "bold" }}>Code: {shareCode}</span>
              <button
                style={{ marginLeft: "8px" }}
                onClick={handleCopyCode}
              >
                Copy
              </button>
            </div>
          )}
        </div>

        <div className="join">
          <h3>Join a Map</h3>
          <input
            type="text"
            placeholder="Enter code"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
          />
          <button onClick={handleJoin}>Join</button>
        </div>
      </section>
    </main>
  );
}