import { useRef, useState, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import API from "../services/api";
import Navbar from "../components/Navbar";

// Helper function to trim empty space from a canvas
const trimCanvas = (canvas) => {
  const ctx = canvas.getContext("2d");
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const l = pixels.data.length;
  let bound = {
    top: null,
    left: null,
    right: null,
    bottom: null,
  };
  let x, y;

  for (let i = 0; i < l; i += 4) {
    if (pixels.data[i + 3] !== 0) {
      x = (i / 4) % canvas.width;
      y = Math.floor((i / 4) / canvas.width);

      if (bound.top === null) bound.top = y;
      if (bound.left === null) {
        bound.left = x;
      } else if (x < bound.left) {
        bound.left = x;
      }

      if (bound.right === null) {
        bound.right = x;
      } else if (bound.right < x) {
        bound.right = x;
      }

      if (bound.bottom === null) {
        bound.bottom = y;
      } else if (bound.bottom < y) {
        bound.bottom = y;
      }
    }
  }

  if (bound.top === null) return canvas;

  const padding = 15;
  const startX = Math.max(0, bound.left - padding);
  const startY = Math.max(0, bound.top - padding);
  const endX = Math.min(canvas.width, bound.right + padding);
  const endY = Math.min(canvas.height, bound.bottom + padding);

  const trimWidth = endX - startX;
  const trimHeight = endY - startY;

  const trimmed = document.createElement("canvas");
  trimmed.width = trimWidth;
  trimmed.height = trimHeight;
  const trimmedCtx = trimmed.getContext("2d");

  trimmedCtx.drawImage(
    canvas,
    startX,
    startY,
    trimWidth,
    trimHeight,
    0,
    0,
    trimWidth,
    trimHeight
  );

  return trimmed;
};

function Signature() {
  const sigRef = useRef();
  const containerRef = useRef();
  const [saving, setSaving] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 500, height: 200 });

  // Customization States
  const [activeTab, setActiveTab] = useState("draw"); // "draw" or "type"
  const [penColor, setPenColor] = useState("#000000");
  const [brushThickness, setBrushThickness] = useState(3); // 1.5 = thin, 3 = medium, 5 = thick

  // Type Signature States
  const [typedText, setTypedText] = useState("");
  const [selectedFont, setSelectedFont] = useState("Great Vibes");

  const colors = [
    { name: "Black", value: "#000000" },
    { name: "Navy", value: "#0f172a" },
    { name: "Royal Blue", value: "#2563eb" },
    { name: "Crimson Red", value: "#dc2626" },
  ];

  const thicknesses = [
    { label: "Thin", val: 1.5 },
    { label: "Medium", val: 3 },
    { label: "Thick", val: 5 },
  ];

  const fonts = [
    { name: "Great Vibes", family: "'Great Vibes', cursive" },
    { name: "Alex Brush", family: "'Alex Brush', cursive" },
    { name: "Sacramento", family: "'Sacramento', cursive" },
    { name: "Allura", family: "'Allura', cursive" },
    { name: "Playball", family: "'Playball', cursive" },
    { name: "Caveat", family: "'Caveat', cursive" },
  ];

  // Dynamically size the canvas to match the container
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCanvasSize({
          width: Math.floor(rect.width),
          height: 200,
        });
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [activeTab]);

  const clearSignature = () => {
    if (activeTab === "draw") {
      sigRef.current.clear();
    } else {
      setTypedText("");
    }
  };

  const saveSignature = async () => {
    let signatureImage = "";

    if (activeTab === "draw") {
      // Manual empty check - more reliable than library's isEmpty() in alpha versions
      const rawCanvas = sigRef.current.getCanvas();
      const ctx = rawCanvas.getContext("2d");
      const pixelData = ctx.getImageData(0, 0, rawCanvas.width, rawCanvas.height).data;
      let hasDrawing = false;
      for (let i = 3; i < pixelData.length; i += 4) {
        if (pixelData[i] !== 0) {
          hasDrawing = true;
          break;
        }
      }
      if (!hasDrawing) {
        alert("Please draw your signature before saving");
        return;
      }
      // Use our own trimCanvas instead of the library's getTrimmedCanvas
      // which can be unreliable in alpha versions
      const trimmedCanvas = trimCanvas(rawCanvas);
      signatureImage = trimmedCanvas.toDataURL("image/png");
    } else {
      if (!typedText.trim()) {
        alert("Please type your name before saving");
        return;
      }

      // Draw styled typed text onto a canvas
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 250;
      const ctx = canvas.getContext("2d");

      // Set transparent background
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = penColor;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `italic 70px "${selectedFont}"`;

      // Draw text
      ctx.fillText(typedText, canvas.width / 2, canvas.height / 2);

      // Crop and get Data URL
      const trimmedCanvas = trimCanvas(canvas);
      signatureImage = trimmedCanvas.toDataURL("image/png");
    }

    setSaving(true);
    try {
      const { data } = await API.post(
        "/api/signature/save",
        {
          signatureImage,
        }
      );

      alert(data.message || "Signature saved successfully!");
      clearSignature();
    } catch (error) {
      console.error("Save signature error:", error);
      const errorMsg = error.response?.data?.message || error.message || "Unknown error";
      alert(`Failed to save signature: ${errorMsg}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-[#0f172a]/60 backdrop-blur border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl">
          <div className="mb-6 text-center">
            <span className="text-3xl">✍️</span>
            <h1 className="text-2xl font-extrabold text-white mt-3">Create Signature</h1>
            <p className="text-slate-400 text-xs mt-1">
              Customize your digital signature by drawing it or typing your name in cursive styles.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-slate-900/80 border border-slate-800 p-1 rounded-xl mb-6">
            <button
              onClick={() => setActiveTab("draw")}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "draw"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              🖌️ Draw Signature
            </button>
            <button
              onClick={() => setActiveTab("type")}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "type"
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              ⌨️ Type Signature
            </button>
          </div>

          {/* Configuration Panel */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {/* Color Swatch Picker */}
            <div className="md:col-span-2 space-y-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Signature Color
              </label>
              <div className="flex gap-3">
                {colors.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setPenColor(c.value)}
                    title={c.name}
                    className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer ${
                      penColor === c.value
                        ? "border-indigo-500 scale-105"
                        : "border-slate-800 hover:border-slate-600"
                    }`}
                    style={{ backgroundColor: c.value }}
                  >
                    {penColor === c.value && (
                      <span
                        className="text-xs"
                        style={{ color: c.value === "#000000" || c.value === "#0f172a" ? "#ffffff" : "#000000" }}
                      >
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Thickness Selection (For Draw Mode) */}
            {activeTab === "draw" && (
              <div className="md:col-span-2 space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Brush Thickness
                </label>
                <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                  {thicknesses.map((t) => (
                    <button
                      key={t.val}
                      onClick={() => setBrushThickness(t.val)}
                      className={`flex-1 py-1.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                        brushThickness === t.val
                          ? "bg-slate-800 text-white border border-slate-700"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Name field (For Type Mode) */}
            {activeTab === "type" && (
              <div className="md:col-span-2 space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Type Your Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={typedText}
                  onChange={(e) => setTypedText(e.target.value)}
                  maxLength={30}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            )}
          </div>

          {/* Core Interactive Area */}
          <div
            ref={containerRef}
            className="rounded-xl border-2 border-slate-700 focus-within:border-indigo-500/50 shadow-inner overflow-hidden mb-6"
          >
            {activeTab === "draw" ? (
              // Draw Canvas View
              <div className="relative" style={{ height: "200px", background: "#ffffff" }}>
                {/* Guideline line */}
                <div
                  className="absolute left-6 right-6 pointer-events-none"
                  style={{
                    bottom: "40px",
                    borderTop: "1px dashed #cbd5e1",
                  }}
                ></div>

                <SignatureCanvas
                  ref={sigRef}
                  penColor={penColor}
                  backgroundColor="rgba(0,0,0,0)"
                  minWidth={brushThickness - 0.5}
                  maxWidth={brushThickness + 0.5}
                  canvasProps={{
                    width: canvasSize.width,
                    height: canvasSize.height,
                    style: {
                      width: "100%",
                      height: "200px",
                      cursor: "crosshair",
                      position: "relative",
                      zIndex: 10,
                    },
                  }}
                />
              </div>
            ) : (
              // Cursive Type Live Preview
              <div
                className="flex items-center justify-center relative bg-white aspect-[5/2]"
                style={{ height: "200px" }}
              >
                {/* Guidelines */}
                <div
                  className="absolute left-6 right-6 pointer-events-none"
                  style={{
                    bottom: "40px",
                    borderTop: "1px dashed #cbd5e1",
                  }}
                ></div>
                <div
                  className="text-center w-full px-6 truncate relative z-10"
                  style={{
                    fontFamily: fonts.find((f) => f.name === selectedFont)?.family,
                    fontSize: "56px",
                    color: penColor,
                    fontStyle: "italic",
                    lineHeight: "200px",
                  }}
                >
                  {typedText.trim() ? typedText : "Type Signature"}
                </div>
              </div>
            )}

            <div style={{ background: "#f8fafc", padding: "6px" }}>
              <p className="text-[10px] text-slate-400 text-center italic">
                {activeTab === "draw"
                  ? "Use mouse, trackpad, or touchscreen to draw. Dotted line is for alignment only."
                  : "Select a cursive font style below. Dotted line is for alignment only."}
              </p>
            </div>
          </div>

          {/* Cursive Styles Selection Grid (Only in Type Tab) */}
          {activeTab === "type" && (
            <div className="mb-6">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                Select Signature Style
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {fonts.map((f) => (
                  <button
                    key={f.name}
                    onClick={() => setSelectedFont(f.name)}
                    className={`bg-slate-900 border p-3 rounded-lg text-left transition-all hover:bg-slate-850 hover:border-slate-600 cursor-pointer ${
                      selectedFont === f.name
                        ? "border-indigo-500 ring-1 ring-indigo-500"
                        : "border-slate-800"
                    }`}
                  >
                    <span className="block text-[9px] text-slate-500 font-medium mb-1.5 uppercase font-sans">
                      {f.name}
                    </span>
                    <span
                      className="block text-white text-base truncate py-1.5 font-semibold"
                      style={{ fontFamily: f.family, color: penColor }}
                    >
                      {typedText.trim() ? typedText : f.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Controls Footer */}
          <div className="flex gap-4">
            <button
              onClick={clearSignature}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-semibold border border-slate-700 transition-all cursor-pointer text-center"
            >
              {activeTab === "draw" ? "Clear Canvas" : "Clear Input"}
            </button>
            <button
              onClick={saveSignature}
              disabled={saving}
              className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all shadow-lg text-white flex items-center justify-center gap-2 cursor-pointer ${
                saving
                  ? "bg-slate-800 border border-slate-700 text-slate-500"
                  : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 shadow-indigo-500/10"
              }`}
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin"></div>
                  Saving...
                </>
              ) : (
                "Save Signature"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signature;