// ColMap.jsx
import React, { useState, useMemo, useEffect, useRef } from "react";
import { Stage, Layer, Image, Line } from "react-konva";
import { MAPS } from "./mapLookup.js";
import "./map.css";
import { v4 as uuidv4 } from "uuid";

/* =========================
   Helper: Load Image
   ========================= */
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

/* =========================
   MapCanvas (Responsive + WS)
   ========================= */
function MapCanvas({ imageSrc, lines, setLines, undoneLines, setUndoneLines, shareCode }) {
  const backgroundImage = useImage(imageSrc);
  const containerRef = useRef(null);
  const isDrawing = useRef(false);
  const socketRef = useRef(null);

  const [brushColor, setBrushColor] = useState("#ff0000");
  const [brushWidth, setBrushWidth] = useState(4);
  const [stageSize, setStageSize] = useState({ width: 1000, height: 600 });

  /* -------------------------
     WebSocket Connection
  ------------------------- */
  useEffect(() => {
    if (!shareCode) return;

    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const socket = new WebSocket(`${protocol}://${window.location.hostname}:4000`); // <--- explicit port

    socketRef.current = socket;

    socket.onopen = () => {
      socket.send(JSON.stringify({
        type: "join",
        roomId: shareCode,
      }));
    };

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);

      if (msg.type === "stroke") {
        const stroke = msg.stroke.id ? msg.stroke : { ...msg.stroke, id: uuidv4() };
        setLines((prev) => [...prev, stroke]);
      }

      if (msg.type === "delete") {
        setLines(prev => prev.filter(line => line.id !== msg.lineId));
      }

      if (msg.type === "clear") {
        setLines([]);
        setUndoneLines([]);
      }
    };

    socket.onclose = () => {
      socketRef.current = null;
    };

    return () => socket.close();
  }, [shareCode, setLines, setUndoneLines]);

  /* -------------------------
     Resize Stage Responsively
  ------------------------- */
  useEffect(() => {
    const resize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.offsetWidth;
      const height = width * (600 / 1000);
      setStageSize({ width, height });
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* -------------------------
     Prevent scrolling while drawing
  ------------------------- */
  useEffect(() => {
    const preventScroll = (e) => {
      if (isDrawing.current) e.preventDefault();
    };
    window.addEventListener("touchmove", preventScroll, { passive: false });
    return () => window.removeEventListener("touchmove", preventScroll);
  }, []);

  /* -------------------------
     Normalize / Denormalize
  ------------------------- */
  const normalizePoint = (pos) => [pos.x / stageSize.width, pos.y / stageSize.height];
  const denormalizePoints = (points) =>
    points.map((p, i) => (i % 2 === 0 ? p * stageSize.width : p * stageSize.height));

  /* -------------------------
     Drawing Events
  ------------------------- */
  const handlePointerDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    const newLine = {
      id: uuidv4(),
      points: normalizePoint(pos),
      color: brushColor,
      width: brushWidth
    };
    setLines([...lines, newLine]);
    setUndoneLines([]);
  };

  const handlePointerMove = (e) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    const lastLine = { ...lines[lines.length - 1] };
    lastLine.points = lastLine.points.concat(normalizePoint(pos));
    setLines([...lines.slice(0, -1), lastLine]);
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
    const lastLine = lines[lines.length - 1];
    if (!lastLine || !shareCode) return;

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: "stroke",
        stroke: lastLine,
      }));
    }
  };

  /* -------------------------
     Undo / Redo / Clear
  ------------------------- */
  const handleUndo = () => {
    if (!lines.length) return;
    const last = lines[lines.length - 1];
    setLines(lines.slice(0, -1));
    setUndoneLines([last, ...undoneLines]);

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: "delete", lineId: last.id }));
    }
  };

  const handleRedo = () => {
  if (!undoneLines.length) return;

  const [first, ...rest] = undoneLines;
  setLines([...lines, first]);
  setUndoneLines(rest);

  if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
    socketRef.current.send(JSON.stringify({
      type: "stroke",   // reuse stroke event
      stroke: first,
    }));
  }
};

  const handleClear = () => {
    setLines([]);
    setUndoneLines([]);

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: "clear" }));
    }
  };

  /* -------------------------
     Image Scaling
  ------------------------- */
  const scale = backgroundImage
    ? Math.min(stageSize.width / backgroundImage.width, stageSize.height / backgroundImage.height)
    : 1;

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: "1000px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      {/* Controls */}
      <div className="map-canvas-controls">
        <label>
          Brush Color:
          <input type="color" value={brushColor} onChange={(e) => setBrushColor(e.target.value)} style={{ marginLeft: "4px" }} />
        </label>

        <label>
          Brush Width:
          <input type="number" min="1" max="50" value={brushWidth} onChange={(e) => setBrushWidth(Number(e.target.value))} style={{ width: "60px", marginLeft: "4px" }} />
        </label>

        <button onClick={handleUndo} disabled={!lines.length}>Undo</button>
        <button onClick={handleRedo} disabled={!undoneLines.length}>Redo</button>
        <button onClick={handleClear} disabled={!lines.length && !undoneLines.length}>Clear</button>
      </div>

      {/* Stage */}
      <Stage
        width={stageSize.width}
        height={stageSize.height}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ border: "1px solid #ccc", borderRadius: "6px" }}
      >
        <Layer>
          {backgroundImage && (
            <Image
              image={backgroundImage}
              x={stageSize.width / 2}
              y={stageSize.height / 2}
              offsetX={backgroundImage.width / 2}
              offsetY={backgroundImage.height / 2}
              scaleX={scale}
              scaleY={scale}
            />
          )}

          {lines.map((line) => (
            <Line
              key={line.id}
              points={denormalizePoints(line.points)}
              stroke={line.color}
              strokeWidth={line.width * scale}
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

/* =========================
   ColMap Page
   ========================= */
export function ColMap() {
  const raidNames = Object.keys(MAPS);
  const [selectedRaid, setSelectedRaid] = useState(raidNames[0]);
  const encounterNames = useMemo(() => Object.keys(MAPS[selectedRaid] || {}), [selectedRaid]);
  const [selectedEncounter, setSelectedEncounter] = useState(encounterNames[0]);

  const [lines, setLines] = useState([]);
  const [undoneLines, setUndoneLines] = useState([]);
  const [shareCode, setShareCode] = useState("");
  const [joinCode, setJoinCode] = useState("");

  useEffect(() => {
    setSelectedEncounter(encounterNames[0]);
    setLines([]);
    setUndoneLines([]);
  }, [selectedRaid, encounterNames]);

  const currentMap = MAPS[selectedRaid]?.[selectedEncounter];

  const handleGenerateCode = async () => {
    if (!selectedRaid || !selectedEncounter) return;
    try {
      const res = await fetch("/api/maps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raid: selectedRaid, encounter: selectedEncounter, lines }),
      });
      const data = await res.json();
      setShareCode(data.code);
    } catch (err) {
      console.error("Error generating code:", err);
    }
  };

  const handleCopyCode = () => {
    if (shareCode) navigator.clipboard.writeText(shareCode);
  };

  const handleJoin = async () => {
    if (!joinCode) return;
    try {
      const res = await fetch(`/api/maps/${joinCode}`);
      if (!res.ok) throw new Error("Invalid code");
      const { raid, encounter, lines: savedLines } = await res.json();
      setSelectedRaid(raid);
      setSelectedEncounter(encounter);
      setLines(savedLines);
      setUndoneLines([]);
      setShareCode(joinCode);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <main className="col-map-page">
      <section className="map-controls">
        <label>
          Raid:
          <select value={selectedRaid} onChange={(e) => setSelectedRaid(e.target.value)}>
            {raidNames.map((raid) => <option key={raid} value={raid}>{raid}</option>)}
          </select>
        </label>

        <label>
          Encounter:
          <select value={selectedEncounter} onChange={(e) => setSelectedEncounter(e.target.value)}>
            {encounterNames.map((enc) => <option key={enc} value={enc}>{enc}</option>)}
          </select>
        </label>
      </section>

      <section className="map-area">
        {currentMap && (
          <MapCanvas
            imageSrc={currentMap}
            lines={lines}
            setLines={setLines}
            undoneLines={undoneLines}
            setUndoneLines={setUndoneLines}
            shareCode={shareCode}
          />
        )}
      </section>

      <section className="collab">
        <div className="share">
          <h3>Share This Map</h3>
          <button onClick={handleGenerateCode}>Generate Code</button>
          {shareCode && (
            <div style={{ marginTop: "0.5rem" }}>
              <span style={{ fontWeight: "bold" }}>Code: {shareCode}</span>
              <button style={{ marginLeft: "8px" }} onClick={handleCopyCode}>Copy</button>
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