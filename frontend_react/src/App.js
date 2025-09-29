import React, { useMemo, useState } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from "react-router-dom";
import "./index.css";

// Layout and UI Components
const Header = () => {
  return (
    <header className="header flex items-center justify-between px-6 bg-black/50 border-b border-border backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-black shadow-card" />
        <h1 className="text-lg font-bold tracking-wide">VizAI</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 text-muted">
          <span className="badge">Electric Orange</span>
          <span className="badge">Dark</span>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
};

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/import", label: "Import", icon: "⤴️" },
  { to: "/analysis", label: "Analysis", icon: "🧠" },
];

const Sidebar = () => {
  return (
    <aside className="sidebar hidden md:flex flex-col bg-black/60 border-r border-border backdrop-blur">
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                    isActive ? "bg-primary/15 text-primary" : "text-muted hover:bg-white/5 hover:text-white",
                  ].join(" ")
                }
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-semibold">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="px-3 py-3 text-xs text-muted border-t border-border">
        v0.1 • © VizAI
      </div>
    </aside>
  );
};

// PUBLIC_INTERFACE
function ThemeToggle() {
  /** Toggle dark class on html */
  const [dark, setDark] = useState(true);
  React.useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  return (
    <button
      onClick={() => setDark((d) => !d)}
      className="btn btn-primary"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {dark ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}

// Reusable Components
const Card = ({ title, action, children, className = "" }) => (
  <section className={`card p-5 ${className}`}>
    <div className="flex items-center justify-between mb-3">
      <h2 className="font-bold">{title}</h2>
      {action}
    </div>
    {children}
  </section>
);

// PUBLIC_INTERFACE
function SummaryStat({ label, value, change, positive = true }) {
  /** Small KPI card */
  return (
    <div className="card p-4">
      <div className="text-sm text-muted">{label}</div>
      <div className="mt-1 flex items-end gap-2">
        <div className="text-2xl font-extrabold">{value}</div>
        {change != null && (
          <div className={`text-xs font-semibold ${positive ? "text-green-400" : "text-red-400"}`}>
            {positive ? "▲" : "▼"} {change}
          </div>
        )}
      </div>
    </div>
  );
}

const Table = ({ columns, data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-muted border-b border-border">
            {columns.map((c) => (
              <th key={c.accessor} className="px-3 py-2 font-semibold">{c.Header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-b border-border/60 hover:bg-white/5">
              {columns.map((c) => (
                <td key={c.accessor} className="px-3 py-2">
                  {c.Cell ? c.Cell(row[c.accessor], row) : row[c.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const UploadButton = ({ onFiles }) => {
  const inputRef = React.useRef(null);
  return (
    <>
      <button className="btn btn-primary" onClick={() => inputRef.current?.click()}>
        ⤴️ Upload Images
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => onFiles?.(Array.from(e.target.files || []))}
      />
    </>
  );
};

// Pages
const Dashboard = () => {
  const metrics = useMemo(
    () => ({
      datasets: 12,
      images: 342,
      accuracy: "84.6%",
      mAP: "0.67",
    }),
    []
  );

  const history = [
    { id: "A-1021", name: "Retail Shelf", status: "Completed", accuracy: 0.86, time: "2m 14s" },
    { id: "A-1020", name: "Street Cam", status: "Completed", accuracy: 0.81, time: "1m 02s" },
    { id: "A-1019", name: "Factory Line", status: "Queued", accuracy: "-", time: "-" },
  ];

  // simple sparkline placeholder using unicode blocks
  const Spark = ({ values }) => (
    <div className="flex gap-0.5 text-primary/80">
      {values.map((v, i) => (
        <div key={i} style={{ height: `${v}%` }} className="w-1.5 bg-primary rounded-t" />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        <SummaryStat label="Datasets" value={metrics.datasets} change="+2" positive />
        <SummaryStat label="Images" value={metrics.images} change="+37" positive />
        <SummaryStat label="Accuracy" value={metrics.accuracy} change="+1.2%" positive />
        <SummaryStat label="mAP@0.5" value={metrics.mAP} change="-0.03" positive={false} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card title="Model Performance">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-muted mb-2">Accuracy Trend</div>
              <Spark values={[10, 40, 30, 60, 45, 70, 80, 65, 85]} />
            </div>
            <div>
              <div className="text-sm text-muted mb-2">Inference Time (ms)</div>
              <Spark values={[80, 60, 70, 55, 65, 50, 45, 60, 40]} />
            </div>
          </div>
        </Card>
        <Card title="Recent Analyses" className="lg:col-span-2">
          <Table
            columns={[
              { Header: "Run ID", accessor: "id" },
              { Header: "Name", accessor: "name" },
              { Header: "Status", accessor: "status", Cell: (v) => <span className="badge">{v}</span> },
              {
                Header: "Accuracy",
                accessor: "accuracy",
                Cell: (v) => (typeof v === "number" ? `${Math.round(v * 100)}%` : "-"),
              },
              { Header: "Time", accessor: "time" },
            ]}
            data={history}
          />
        </Card>
      </div>
    </div>
  );
};

const ImportPage = () => {
  const [files, setFiles] = useState([]);

  const onFiles = (incoming) => {
    setFiles((prev) => [...prev, ...incoming.map((f) => ({ name: f.name, size: f.size }))]);
  };

  return (
    <div className="space-y-6">
      <Card
        title="Import Images"
        action={<UploadButton onFiles={onFiles} />}
      >
        <p className="text-sm text-muted mb-4">
          Upload images to run detection. Supported formats: JPG, PNG. Max 10MB per file.
        </p>
        {files.length === 0 ? (
          <div className="border border-dashed border-border rounded-xl p-8 text-center text-muted">
            No files uploaded yet.
          </div>
        ) : (
          <Table
            columns={[
              { Header: "File", accessor: "name" },
              { Header: "Size (KB)", accessor: "size", Cell: (v) => Math.round(v / 1024) },
            ]}
            data={files}
          />
        )}
      </Card>
    </div>
  );
};

const AnalysisPage = () => {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState([]);

  // Mock YOLO detection: generate random boxes and accuracy
  const runAnalysis = () => {
    setRunning(true);
    setResults([]);
    setTimeout(() => {
      const mock = Array.from({ length: 6 }).map((_, i) => ({
        id: i + 1,
        image: `Sample ${i + 1}`,
        detections: Math.floor(Math.random() * 6) + 1,
        accuracy: (Math.random() * 0.2 + 0.78).toFixed(2), // 0.78 - 0.98
        time: `${Math.floor(Math.random() * 120) + 30}ms`,
      }));
      setResults(mock);
      setRunning(false);
    }, 900);
  };

  return (
    <div className="space-y-6">
      <Card
        title="Analysis Runner"
        action={
          <button disabled={running} onClick={runAnalysis} className="btn btn-primary disabled:opacity-60">
            {running ? "Running..." : "Run Detection"}
          </button>
        }
      >
        <p className="text-sm text-muted">
          This simulates YOLO object detection and computes mock accuracy metrics. Replace with real inference when backend is ready.
        </p>
      </Card>

      <Card title="Results">
        {results.length === 0 ? (
          <div className="text-muted">No results yet. Click "Run Detection" to start.</div>
        ) : (
          <Table
            columns={[
              { Header: "Image", accessor: "image" },
              { Header: "Detections", accessor: "detections" },
              {
                Header: "Accuracy",
                accessor: "accuracy",
                Cell: (v) => (
                  <span className={`font-semibold ${Number(v) > 0.9 ? "text-green-400" : "text-yellow-400"}`}>
                    {Math.round(Number(v) * 100)}%
                  </span>
                ),
              },
              { Header: "Latency", accessor: "time" },
            ]}
            data={results}
          />
        )}
      </Card>
    </div>
  );
};

// PUBLIC_INTERFACE
function App() {
  /** VizAI application root with sidebar and header, routing to pages */
  return (
    <Router>
      <div className="app-grid">
        <Sidebar />
        <Header />
        <main className="main p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/import" element={<ImportPage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
