

import { useEffect, useState } from "react";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  AlignmentType
} from "docx";

import { saveAs } from "file-saver";

import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

const styles = {
  container: {
  width: "100vw",
  padding: "40px",
  boxSizing: "border-box",
  background: "#F8FAFC"
},

  title: {
  fontSize: "clamp(24px, 5vw, 42px)", // 🔥 responsive
  fontWeight: "700",
  color: "#2563EB"
},


  card: {
    display: "flex",
    gap: "10px",
    marginBottom: "25px",
    background: "white",
    padding: "18px",
    borderRadius: "14px",
    border: "1px solid #E5E7EB"
  },

  input: {
    padding: "12px",
    fontSize: "15px",
    flex: 1,
    borderRadius: "10px",
    border: "1px solid #CBD5F5"
  },

  button: {
    padding: "10px 18px",
    background: "#2563EB",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    color: "white"
  },


  list: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "15px"
  },

  item: {
    padding: "18px",
    background: "white",
    borderRadius: "12px",
    border: "1px solid #E5E7EB"
  },

  back: {
    marginBottom: "20px",
    padding: "8px 16px",
    borderRadius: "8px",
    border: "1px solid #E5E7EB",
    cursor: "pointer"
  },

  section: {
    marginTop: "20px",
    padding: "20px",
    background: "white",
    borderRadius: "14px",
    border: "1px solid #E5E7EB"
  }
};


function App() {
  const [selectedCorner, setSelectedCorner] = useState(null);
  const [search, setSearch] = useState("");
  const [filterSide, setFilterSide] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterOutcome, setFilterOutcome] = useState("all");
  const [showInfo, setShowInfo] = useState(false);

  const [view, setView] = useState("matches");
  const [allCorners, setAllCorners] = useState([]);
  const [matches, setMatches] = useState([]);
  const [newMatch, setNewMatch] = useState("");
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [activeTab, setActiveTab] = useState("corners");

  const [corners, setCorners] = useState([]);
  if (!Array.isArray(corners)) {
    console.log("Corners not array:", corners);
  }
  const [summaryData, setSummaryData] = useState({
    general: "",
    attacking: "",
    defensive: "",
    players: ""
  });

  // initial data fetches (moved after state declarations so setters exist)
  useEffect(() => {
    fetch("https://corner-forge-backend.onrender.com/api/matches")
      .then(res => res.json())
      .then(data => {
        console.log("MATCHES:", data); // debug
        setMatches(data);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    fetch("https://corner-forge-backend.onrender.com/api/corners")
      .then(res => res.json())
      .then(data => setAllCorners(data))
      .catch(err => console.error(err));
  }, []);

useEffect(() => {
  window.setSelectedCorner = setSelectedCorner;
}, []);
useEffect(() => {
  const handleKey = (e) => {
    if (e.key === "Escape") {
      setShowInfo(false);
    }
  };

  window.addEventListener("keydown", handleKey);

  return () => window.removeEventListener("keydown", handleKey);
}, []);

if (!Array.isArray(corners)) {
  console.log("Corners not array:", corners);
}

  useEffect(() => {
  if (view === "allCorners") {
    fetch("https://corner-forge-backend.onrender.com/api/corners")
      .then(res => res.json())
      .then(data => {
        console.log("ALL CORNERS:", data);
        setAllCorners(data);
      })
      .catch(err => console.error(err));
  }
}, [view]);

  const addMatch = () => {
  if (!newMatch) return;

  fetch("https://corner-forge-backend.onrender.com/api/matches", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ 
      name: newMatch // ✅ CSAK EZ KELL
    })
  })
    .then(res => res.json())
    .then(data => {
      setMatches(prev => [...prev, data]);
      setNewMatch("");
    });
};


 return (
  <div style={{ background: "#F8FAFC", minHeight: "100vh" }}>

    {/* 🔝 NAVBAR */}
    <div style={{
  display: "flex",
  justifyContent: "center",
  marginBottom: "30px"
}}>
  <div style={{
    display: "flex",
    background: "#E5E7EB",
    padding: "6px",
    borderRadius: "12px",
    gap: "6px"
  }}>

    <button
      onClick={() => setView("matches")}
      style={{
        ...styles.button,
        background: view === "matches" ? "#2563EB" : "transparent",
        color: view === "matches" ? "white" : "#1E293B"
      }}
    >
      Matches
    </button>

    <button
      onClick={() => setView("allCorners")}
      style={{
        ...styles.button,
        background: view === "allCorners" ? "#2563EB" : "transparent",
        color: view === "allCorners" ? "white" : "#1E293B"
      }}
    >
      All Corners
    </button>

    <button
      onClick={() => setView("favorites")}
      style={{
        ...styles.button,
        background: view === "favorites" ? "#2563EB" : "transparent",
        color: view === "favorites" ? "white" : "#1E293B"
      }}
    >
      Favorites
    </button>

  </div>
</div>

{/* 🟢 MATCHES VIEW */}
{view === "matches" && !selectedMatch && (
  <div>

    {/* HEADER */}
    <div style={{ 
      display: "flex", 
      alignItems: "center", 
      gap: "15px", 
      marginBottom: "20px",
      flexWrap: "wrap"
    }}>
      <img src="/logo.png" style={{ width: "60px" }} />
      <h1 style={styles.title}>Corner Forge</h1>
    </div>

    {/* STATS */}
    <div style={{ 
      display: "flex",
      gap: "10px",
      flexWrap: "wrap",
      justifyContent: "center",
      marginBottom: "20px"
    }}>

      <div style={{
        background: "white",
        padding: "10px 16px",
        borderRadius: "10px",
        border: "1px solid #E5E7EB",
        minWidth: "120px"
      }}>
        📊 Total: {allCorners.length}
      </div>

      <div style={{
        background: "white",
        padding: "10px 16px",
        borderRadius: "10px",
        border: "1px solid #E5E7EB",
        minWidth: "120px"
      }}>
        ⚽ Goals: {allCorners.filter(c => c.outcome === "goal").length}
      </div>

      <div style={{
        background: "white",
        padding: "10px 16px",
        borderRadius: "10px",
        border: "1px solid #E5E7EB",
        minWidth: "120px"
      }}>
        ⭐ Favorites: {allCorners.filter(c => c.favorite).length}
      </div>

    </div>

    {/* ADD MATCH */}
    <div style={styles.card}>
      <input
        style={styles.input}
        placeholder="Pl: Real Madrid vs Barca"
        value={newMatch}
        onChange={(e) => setNewMatch(e.target.value)}
      />
      <button style={styles.button} onClick={addMatch}>
        + Add Match
      </button>
    </div>

    {/* MATCH LIST */}
    <div style={styles.list}>
      {matches.map((match) => (
        <div
          key={match.id}
          style={{
            ...styles.item,
            position: "relative",
            cursor: "pointer"
          }}
        >

          <button
            onClick={(e) => {
              e.stopPropagation();

              fetch(`https://corner-forge-backend.onrender.com/api/matches/${match.id}`, {
                method: "DELETE"
              }).then(() => {
                setMatches(prev => prev.filter(m => m.id !== match.id));
              });
            }}
            style={{
              position: "absolute",
              top: "5px",
              right: "5px",
              background: "red",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              zIndex: 999
            }}
          >
            ❌
          </button>

          <div
            onClick={() => {
              fetch(`https://corner-forge-backend.onrender.com/api/matches/${match.id}`)
                .then(res => res.json())
                .then(data => {
                  setSelectedMatch(data);
                  setCorners(data.corners || []);
                });
            }}
          >
            <h3>{match.name}</h3>
          </div>

        </div>
      ))}
    </div>

  </div>
)}

    {/* 🔵 MATCH DETAIL */}
{view === "matches" && selectedMatch && (
  <>
    <button onClick={() => setSelectedMatch(null)} style={styles.back}>
      ← Back
    </button>

    <h1 style={{ color: "#1E3A8A" }}>
  {selectedMatch.name}
</h1>

    <StatsTabs
      corners={corners}
      setCorners={setCorners}
      match={selectedMatch}
      selectedCorner={selectedCorner}
      setSelectedCorner={setSelectedCorner}
    />

  </>
)}
    
{/* 🟡 ALL CORNERS */}
{view === "allCorners" && (
  <div style={styles.section}>

    {!selectedCorner && (
      <>
        <h2 style={{
  color: "#1E3A8A",
  textAlign: "center",
  marginBottom: "20px",
  fontSize: "28px"
}}>
  All Corners
</h2>
 <div style={{
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "10px",
  marginBottom: "20px"
}}>

  {/* 🔍 SEARCH */}
  <input
    placeholder="Search by name..."
    value={search}
    onChange={e => setSearch(e.target.value)}
    style={{
  width: "300px",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #BFDBFE",
  background: "#EFF6FF",
  color: "#1E3A8A",
  textAlign: "center",
  outline: "none"
}}
  />

  {/* 🎛 FILTERS */}
  <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
  
  <select
    value={filterSide}
    onChange={e => setFilterSide(e.target.value)}
    style={{
      padding: "10px 14px",
      borderRadius: "10px",
      border: "1px solid #BFDBFE",
      background: "#EFF6FF",
      color: "#1E3A8A",
      fontWeight: "500",
      cursor: "pointer"
    }}
  >
    <option value="all">All Sides</option>
    <option value="left">Left</option>
    <option value="right">Right</option>
  </select>

  <select
    value={filterType}
    onChange={e => setFilterType(e.target.value)}
    style={{
      padding: "10px 14px",
      borderRadius: "10px",
      border: "1px solid #BFDBFE",
      background: "#EFF6FF",
      color: "#1E3A8A",
      fontWeight: "500",
      cursor: "pointer"
    }}
  >
    <option value="all">All Types</option>
    <option value="inswing">Inswing</option>
    <option value="outswing">Outswing</option>
  </select>

  <select
    value={filterOutcome}
    onChange={e => setFilterOutcome(e.target.value)}
    style={{
      padding: "10px 14px",
      borderRadius: "10px",
      border: "1px solid #BFDBFE",
      background: "#EFF6FF",
      color: "#1E3A8A",
      fontWeight: "500",
      cursor: "pointer"
    }}
  >
    <option value="all">All Outcomes</option>
    <option value="goal">Goal</option>
    <option value="shot">Shot</option>
    <option value="clearance">Clearance</option>
    <option value="lost">Lost</option>
  </select>

</div>
</div>

        {allCorners.length === 0 && (
  <p style={{ color: "#64748B", marginTop: "20px" }}>
    No corners yet ⚽ <br />
    Go to Matches and add one
  </p>
)}

        {allCorners
  .filter(c => {
    const matchSearch =
      (c.name || "")
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchSide =
      filterSide === "all" || c.side === filterSide;

    const matchType =
  filterType === "all" || c.type === filterType;

const matchOutcome =
  filterOutcome === "all" || c.outcome === filterOutcome;

return matchSearch && matchSide && matchType && matchOutcome;
  })
  .map((c) => (
    <div
      key={c.id}
      style={{
  ...styles.item,
  cursor: "pointer",
  background: selectedCorner?.id === c.id ? "#DBEAFE" : "white"
}}
      onClick={() => setSelectedCorner(c)}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>
          {c.name || `${c.side} | ${c.type}`}
        </span>

        <button
  onClick={(e) => {
    e.stopPropagation();

    fetch(`https://corner-forge-backend.onrender.com/api/corners/${c.id}/favorite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        favorite: !c.favorite
      })
    }).then(() => {
      setAllCorners(prev =>
        prev.map(x =>
          x.id === c.id ? { ...x, favorite: !x.favorite } : x
        )
      );
    });
  }}
  style={{
    background: c.favorite ? "#FACC15" : "#EFF6FF",
    color: c.favorite ? "#92400E" : "#1E3A8A",
    border: "1px solid #BFDBFE",
    borderRadius: "8px",
    padding: "6px 10px",
    cursor: "pointer",
    transition: "all 0.2s ease"
  }}
  onMouseEnter={(e) => {
    if (!c.favorite) e.target.style.background = "#DBEAFE";
  }}
  onMouseLeave={(e) => {
    e.target.style.background = c.favorite ? "#FACC15" : "#EFF6FF";
  }}
>
  {c.favorite ? "★" : "☆"}
</button>
      </div>
    </div>
))}
          
      </>
    )}

    {selectedCorner && (
      <CornerDetail
        corner={selectedCorner}
        onBack={() => setSelectedCorner(null)}
      />
    )}

  </div>
)}
    

{/* ⭐ FAVORITES */}
{view === "favorites" && (
  <div style={styles.section}>

    {!selectedCorner && (
      <>
        <h2 style={{ color: "#1E3A8A" }}>Favorites</h2>

        {allCorners
          .filter(c => c.favorite)
          .map(c => (
            <div
              key={c.id}
              style={{
                ...styles.item,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer"
              }}
              onClick={() => setSelectedCorner(c)} // 🔥 EZ A LÉNYEG
            >
              <div>
  <strong>
    {c.name || "Corner"}
  </strong>

  <div style={{
    fontSize: "13px",
    color: "#64748B",
    marginTop: "4px"
  }}>
    {c.side} • {c.type} • {c.outcome}
  </div>
</div>

              <span style={{ color: "#FACC15" }}>★</span>
            </div>
          ))}
      </>
    )}

    {selectedCorner && (
      <CornerDetail
        corner={selectedCorner}
        onBack={() => setSelectedCorner(null)}
      />
    )}

  </div>
)}
{showInfo && (
  <div style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999
  }}>

    <div style={{
      background: "white",
      padding: "30px",
      borderRadius: "14px",
      width: "400px",
      textAlign: "center"
    }}>
      
      <h2 style={{ color: "#1E3A8A" }}>
        About Corner Forge
      </h2>

      <p style={{ marginTop: "10px", color: "#475569" }}>
        This tool is designed to analyze football corner situations in detail.

You can:
- Track corner types and patterns
- Analyze outcomes (goal, shot, etc.)
- Store videos and notes
- Identify strengths and weaknesses

Ideal for match analysis and coaching preparation.
      </p>

      <button
        style={{ ...styles.button, marginTop: "20px" }}
        onClick={() => setShowInfo(false)}
      >
        Close
      </button>

    </div>
  </div>
)}
<div style={{ display: "flex", gap: "10px" }}>

  <button
    onClick={() => window.open("https://corner-forge-backend.onrender.com/api/backup")}
    style={{
      padding: "8px 12px",
      background: "#16A34A",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer"
    }}
  >
    💾
  </button>

  <button
    onClick={() => setShowInfo(true)}
    style={{
      padding: "8px 12px",
      background: "#F1F5F9",
      color: "#1E3A8A",
      border: "1px solid #CBD5F5",
      borderRadius: "8px",
      cursor: "pointer"
    }}
  >
    ℹ
  </button>

</div>
</div>
);
}

function Notes({ corner }) {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!corner) return;

    fetch(`https://corner-forge-backend.onrender.com/api/corners/${corner.id}/notes`)
      .then(res => res.json())
      .then(data => setNotes(data));
  }, [corner]);

  const addNote = () => {
    if (!text || !corner) return;

    fetch(`https://corner-forge-backend.onrender.com/api/corners/${corner.id}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    })
      .then(res => res.json())
      .then(data => {
        setNotes(prev => [...prev, data]);
        setText("");
      });
  };

  const deleteNote = (noteId) => {
    fetch(`https://corner-forge-backend.onrender.com/api/corners/${corner.id}/notes/${noteId}`, {
      method: "DELETE"
    }).then(() => {
      setNotes(prev => prev.filter(n => n.id !== noteId));
    });
  };

  return (
    <div style={styles.section}>
      <h2 style={{ color: "#1E3A8A" }}>
  Notes
</h2>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        style={styles.input}
      />

      <button style={styles.button} onClick={addNote}>
        Add
      </button>

      {notes.map(note => (
        <div key={note.id} style={{ ...styles.item, position: "relative" }}>
          <button onClick={() => deleteNote(note.id)}>❌</button>
          {note.text}
        </div>
      ))}
    </div>
  );
}

function Videos({ corner, tempVideos, setTempVideos }) {
  const [videos, setVideos] = useState([]);
  const [file, setFile] = useState(null);

  // 🔄 mentett videók betöltése
  useEffect(() => {
    if (!corner) return;

    fetch(`https://corner-forge-backend.onrender.com/api/corners/${corner.id}/videos`)
      .then(res => res.json())
      .then(data => {
        console.log("VIDEOS LOADED:", data);
        setVideos(data);
      });
  }, [corner]);

  // ➕ TEMP videó (preview)
  const addVideo = () => {
    if (!file) return;

    const preview = URL.createObjectURL(file);

    setTempVideos(prev => [...prev, { file, preview }]);
    setFile(null);
  };

  return (
    <div style={styles.section}>
      <h2 style={{ color: "#1E3A8A" }}>
  Videos
</h2>

     <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
  
  {/* 🔴 REJTETT INPUT */}
  <input
    type="file"
    id="fileUpload"
    style={{ display: "none" }}
    onChange={e => setFile(e.target.files[0])}
  />

  {/* 🔵 GOMB HELYETTE */}
  <label
  htmlFor="fileUpload"
  style={{
    ...styles.button,
    padding: "6px 12px",
    fontSize: "13px"
  }}
>
  Choose File
</label>

  {/* 📄 FÁJL NÉV */}
  <span>
    {file ? file.name : "No file selected"}
  </span>

  {/* 🟢 ADD GOMB */}
  <button
    style={{
      ...styles.button,
      background: "#16A34A"
    }}
    onClick={addVideo}
  >
    + Add
  </button>

</div>

      {/* 🟡 2. TEMP VIDEÓK */}
      {tempVideos.length > 0 && (
        <>
          <h4>New Videos (not saved yet)</h4>

          {tempVideos.map((v, i) => (
            <video key={i} width="100%" controls style={{ marginTop: "10px" }}>
              <source src={v.preview} />
            </video>
          ))}
        </>
      )}

      {/* 🟢 3. MENTETT VIDEÓK */}
      {corner && videos.length > 0 && (
        <>
          <h4>Saved Videos</h4>

          {videos.map((v, i) => (
            <video key={v.id || i} width="100%" controls style={{ marginTop: "10px" }}>
              <source src={v.url} />
            </video>
          ))}
        </>
      )}
    </div>
  );
}

function Summary({ match, corners, summaryData, setSummaryData }) {

  const generateSummary = () => {
  const notesText = (match.notes || [])
    .map(n => "- " + (n.text || ""))
    .join("\n");

  setSummaryData(prev => ({
    ...prev,
    general: notesText
  }));
};

  const downloadWord = async () => {
  try {
    console.log("START DOWNLOAD");

    const response = await fetch("/template.docx");
    console.log("FETCH OK?", response);

    const content = await response.arrayBuffer();

    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip);

    doc.render({
  match: match.name,
  date: new Date().toLocaleDateString(),

  general: summaryData.general || "-",
attacking: summaryData.attacking || "-",
defensive: summaryData.defensive || "-",
players: summaryData.players || "-",

  // ✅ NOTES
  notes: (match.notes || [])
    .map(n => "- " + (n.text || ""))
    .join("\n") || "-",

  // ✅ VIDEOS
  videos: (match.videos || [])
    .map(v => v.url)
    .join("\n") || "-",

  cornersText: corners.map((c, i) => 
  `Corner ${i + 1}:
Side: ${c.side}
Type: ${c.type}
Delivery: ${c.delivery}
Players in box: ${c.playersInBox}
First contact: ${c.firstContact} (Zone ${c.firstContactZone})
Finish zone: ${c.finishingZone}
Outcome: ${c.outcome}
Kicker: ${c.kicker}
`
).join("\n\n") || "-"
});


    const blob = doc.getZip().generate({
      type: "blob",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    });

    saveAs(blob, `${match.name}_report.docx`);
  } catch (err) {
    console.error(err);
  }
};

  const textareaStyle = {
    width: "100%",
    marginTop: "10px",
    padding: "12px",
    background: "#F1F5F9",
    color: "#1E3A8A",
    border: "1px solid #CBD5F5",
    borderRadius: "10px",
    outline: "none"
  };

  return (
    <div style={styles.section}>
      <h2 style={{ color: "#1E3A8A", marginBottom: "10px" }}>
  Summary
</h2>

      <button style={styles.button} onClick={generateSummary}>
        Generate Summary
      </button>

      <button style={styles.button} onClick={downloadWord}>
        Export Word
      </button>

<button
  style={styles.button}
  onClick={() => {
    fetch(`https://corner-forge-backend.onrender.com/api/matches/${match.id}/summary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(summaryData)
    });
  }}
>
  Save Summary
</button>


      <h3>General Observations</h3>
<textarea
  value={summaryData.general}
  onChange={e =>
    setSummaryData(prev => ({ ...prev, general: e.target.value }))
  }
  style={textareaStyle}
/>

<h3>Attacking Corners</h3>
<textarea
  value={summaryData.attacking}
  onChange={e =>
    setSummaryData(prev => ({ ...prev, attacking: e.target.value }))
  }
  style={textareaStyle}
/>

<h3>Defensive Issues</h3>
<textarea
  value={summaryData.defensive}
  onChange={e =>
    setSummaryData(prev => ({ ...prev, defensive: e.target.value }))
  }
  style={textareaStyle}
/>

<h3>Key Players</h3>
<textarea
  value={summaryData.players}
  onChange={e =>
    setSummaryData(prev => ({ ...prev, players: e.target.value }))
  }
  style={textareaStyle}
/>    </div>
  );
}
function CornerInput({ match, corners, setCorners, setSelectedCorner, tempVideos, setTempVideos}) {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [side, setSide] = useState("left");
  const [type, setType] = useState("inswing");
  const [delivery, setDelivery] = useState("direct");

  const [playersInBox, setPlayersInBox] = useState(0);
  const [playersOutBox, setPlayersOutBox] = useState(0);

  const [firstContact, setFirstContact] = useState("attack");
  const [firstContactZone, setFirstContactZone] = useState(1);
  const [finishingZone, setFinishingZone] = useState(1);

  const [blockers, setBlockers] = useState(false);
  const [secondBall, setSecondBall] = useState(false);

  const [outcome, setOutcome] = useState("shot");
  const [kicker, setKicker] = useState("");

  const inputStyle = {
    padding: "10px",
    marginTop: "10px",
    width: "100%",
    borderRadius: "10px",
    border: "1px solid #CBD5F5",
    background: "#F1F5F9",
    color: "#1E3A8A"
  };

  const saveCorner = async () => {
  console.log("TEMP VIDEOS:", tempVideos);

  const res = await fetch(
    `https://corner-forge-backend.onrender.com/api/matches/${match.id}/corners`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
  name, // 🔥 EZ KELL
  side,
  type,
  delivery,
  playersInBox,
  playersOutBox,
  firstContact,
  firstContactZone,
  finishingZone,
  blockers,
  secondBall,
  outcome,
  kicker
})
    }
  );

  const data = await res.json();

  setCorners(prev => [...prev, data]);
  setSelectedCorner(data);

  // 🎥 VIDEÓK
  for (let v of tempVideos) {
    const formData = new FormData();
    formData.append("video", v.file);

    const uploadRes = await fetch("https://corner-forge-backend.onrender.com/api/upload", {
      method: "POST",
      body: formData
    });

    const uploadData = await uploadRes.json();

    await fetch(
      `https://corner-forge-backend.onrender.com/api/corners/${data.id}/videos`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: uploadData.url })
      }
    );
  }

  setTempVideos([]);
  // 🔄 ALL CORNERS FRISSÍTÉS
fetch("https://corner-forge-backend.onrender.com/api/corners")
  .then(res => res.json())
  .then(data => {
    setAllCorners(data);
  });

// 🔄 újratöltjük a videókat
const resVideos = await fetch(
  `https://corner-forge-backend.onrender.com/api/corners/${data.id}/videos`
);

const newVideos = await resVideos.json();

console.log("VIDEOS AFTER SAVE:", newVideos);
};


  return (
  <div style={styles.section}>
    <h2 style={{ color: "#1E3A8A", marginBottom: "10px" }}>
      Corner Input
    </h2>

<label>Corner Name</label>
<input
  placeholder="Pl: Near post flick"
  value={name}
  onChange={e => setName(e.target.value)}
  style={inputStyle}
/>
  
    <label>Side</label>
    <select value={side} onChange={e => setSide(e.target.value)} style={inputStyle}>
      <option value="left">Left</option>
      <option value="right">Right</option>
    </select>

    <label>Type</label>
    <select value={type} onChange={e => setType(e.target.value)} style={inputStyle}>
      <option value="inswing">Inswing</option>
      <option value="outswing">Outswing</option>
    </select>

    <label>Delivery</label>
    <select value={delivery} onChange={e => setDelivery(e.target.value)} style={inputStyle}>
      <option value="direct">Direct</option>
      <option value="short">Short</option>
    </select>

    <label>Players in box</label>
    <input
      type="number"
      value={playersInBox}
      onChange={e => setPlayersInBox(Number(e.target.value))}
      style={inputStyle}
    />

    <label>Players out box</label>
    <input
      type="number"
      value={playersOutBox}
      onChange={e => setPlayersOutBox(Number(e.target.value))}
      style={inputStyle}
    />

    <label>Outcome</label>
    <select value={outcome} onChange={e => setOutcome(e.target.value)} style={inputStyle}>
      <option value="goal">Goal</option>
      <option value="shot">Shot</option>
      <option value="clearance">Clearance</option>
      <option value="lost">Lost</option>
    </select>

    <input
      placeholder="Kicker name"
      value={kicker}
      onChange={e => setKicker(e.target.value)}
      style={inputStyle}
    />

    <button style={styles.button} onClick={saveCorner}>
      Save Corner
    </button>

    <h3>Saved Corners</h3>

    {Array.isArray(corners) &&
      corners.map((c) => (
        <div key={c.id} style={{ ...styles.item, position: "relative" }}>
          <button
            onClick={() => {
              fetch(
                `"https://corner-forge-backend.onrender.com/api/matches/${match.id}/corners/${c.id}`,
                { method: "DELETE" }
              ).then(() => {
                setCorners(prev => prev.filter(x => x.id !== c.id));
              });
            }}
          >
            ❌
          </button>
<button
  onClick={() => {
    setName(c.name || "");
    setSide(c.side);
    setType(c.type);
    setDelivery(c.delivery);
    setPlayersInBox(c.playersInBox);
    setPlayersOutBox(c.playersOutBox);
    setFirstContact(c.firstContact);
    setFirstContactZone(c.firstContactZone);
    setFinishingZone(c.finishingZone);
    setBlockers(c.blockers);
    setSecondBall(c.secondBall);
    setOutcome(c.outcome);
    setKicker(c.kicker);
  }}
>
  📋
</button>

          {c.name || `${c.side} | ${c.type} | ${c.outcome}`}
        </div>
      ))}
  </div>
);
}

function CornerStats({ corners }) {
  const total = corners.length;

  const goals = corners.filter(c => c.outcome === "goal").length;
  const shots = corners.filter(c => c.outcome === "shot").length;

  const inswing = corners.filter(c => c.type === "inswing").length;
  const outswing = corners.filter(c => c.type === "outswing").length;

  const left = corners.filter(c => c.side === "left").length;
  const right = corners.filter(c => c.side === "right").length;

  const avgPlayers =
    total > 0
      ? (corners.reduce((sum, c) => sum + c.playersInBox, 0) / total).toFixed(1)
      : 0;

  return (
    <div style={styles.section}>
      <h2 style={{ color: "#1E3A8A" }}>
  Corner Stats
</h2>
      <p>Total: {total}</p>
      <p>Goals: {goals}</p>
      <p>Shots: {shots}</p>

      <p>Inswing: {inswing}</p>
      <p>Outswing: {outswing}</p>

      <p>Left: {left}</p>
      <p>Right: {right}</p>

      <p>Avg players in box: {avgPlayers}</p>
    </div>
  );
}

function StatsTabs({ corners, setCorners, match, selectedCorner, setSelectedCorner }) {
  const [tempVideos, setTempVideos] = useState([]);
  const [tab, setTab] = useState("input");

  const [summaryData, setSummaryData] = useState({
    general: "",
    attacking: "",
    defensive: "",
    players: ""
  });

  return (
    <div>

      {/* 🔝 TAB BUTTONS */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button style={styles.button} onClick={() => setTab("input")}>Input</button>
        <button style={styles.button} onClick={() => setTab("list")}>Corners</button>
        <button style={styles.button} onClick={() => setTab("stats")}>Stats</button>
        <button style={styles.button} onClick={() => setTab("summary")}>Summary</button>
      </div>

      {tab === "input" && (
        <div style={{ display: "flex", gap: "20px" }}>
          <div style={{ flex: 1 }}>
            {/* 🎥 VIDEÓ MINDIG LÁTSZÓDJON */}
            <Videos
              corner={selectedCorner}
              tempVideos={tempVideos}
              setTempVideos={setTempVideos}
            />

            {/* 📝 NOTES csak ha van corner */}
            {selectedCorner && <Notes corner={selectedCorner} />}
          </div>

          <div style={{ flex: 1 }}>
            <CornerInput
              match={match}
              corners={corners}
              setCorners={setCorners}
              setSelectedCorner={setSelectedCorner}
              tempVideos={tempVideos}
              setTempVideos={setTempVideos}
            />
          </div>
        </div>
      )}
      {/* 🔵 CORNER LIST */}
      {tab === "list" && (
        <div>
          {corners.map((c, i) => (
            <div
              key={c.id}
              onClick={() => {
                setSelectedCorner(c);
                setTab("input"); // 🔥 fontos, hogy visszavigyen inputra
              }}
              style={{
                padding: "12px",
                border: "1px solid #ccc",
                marginBottom: "8px",
                cursor: "pointer",
                borderRadius: "8px",
                background: selectedCorner?.id === c.id ? "#DBEAFE" : "white"
              }}
            >
              Corner {i + 1} – {c.side} / {c.type}
            </div>
          ))}
        </div>
      )}

      {/* 🟣 STATS */}
      {tab === "stats" && <CornerStats corners={corners} />}

      {/* 🟡 SUMMARY */}
      {tab === "summary" && (
        <Summary
          match={match}
          corners={corners}
          summaryData={summaryData}
          setSummaryData={setSummaryData}
        />
      )}

    </div>
  );
}

function CornerDetail({ corner, onBack }) {
  const [tempVideos, setTempVideos] = useState([]);

  return (
    <div>
      <button
  onClick={onBack}
  style={{
    marginBottom: "20px",
    padding: "10px 18px",
    borderRadius: "10px",
    border: "1px solid #BFDBFE",
    background: "#EFF6FF",
    color: "#1E3A8A",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease"
  }}
  onMouseEnter={(e) => {
    e.target.style.background = "#DBEAFE";
  }}
  onMouseLeave={(e) => {
    e.target.style.background = "#EFF6FF";
  }}
>
  ← Back
</button>

      <h2
  style={{
    color: "#1E3A8A",
    fontSize: "26px",
    fontWeight: "600",
    marginBottom: "5px",
    textAlign: "center"
  }}
>
  {corner.name || `${corner.side} | ${corner.type}`}
</h2>

{corner.name && (
  <div
    style={{
      textAlign: "center",
      color: "#64748B",
      marginBottom: "20px"
    }}
  >
    {corner.side} | {corner.type}
  </div>
)}

      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ flex: 1 }}>
          <Videos
            corner={corner}
            tempVideos={tempVideos}
            setTempVideos={setTempVideos}
          />

          <Notes corner={corner} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={styles.section}>
            <h3>Details</h3>
            <p>Delivery: {corner.delivery}</p>
            <p>Players in box: {corner.playersInBox}</p>
            <p>Outcome: {corner.outcome}</p>
            <p>Kicker: {corner.kicker}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;