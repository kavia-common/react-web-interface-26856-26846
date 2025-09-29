import React, { useMemo, useState } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from "react-router-dom";
import "./index.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

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
      <div className="px-3 py-3 text-xs text-muted border-t border-border">v0.1 • © VizAI</div>
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
    <button onClick={() => setDark((d) => !d)} className="btn btn-primary" aria-label="Toggle theme" title="Toggle theme">
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
          <div className={`text-xs font-semibold ${positive ? "text-green-400" : "text-red-400"}`}>{positive ? "▲" : "▼"} {change}</div>
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
              <th key={c.accessor} className="px-3 py-2 font-semibold">
                {c.Header}
              </th>
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
  // Mock overall KPI metrics
  const metrics = useMemo(
    () => ({
      totalVideos: 128,
      accuracyPct: 92.4,
      bearsDetected: 47,
      mobileCount: 29,
      nonMobileCount: 18,
    }),
    []
  );

  // Mock mobility distribution for bar chart
  const mobilityBarData = useMemo(
    () => [
      { type: "Mobile", count: metrics.mobileCount },
      { type: "Non-Mobile", count: metrics.nonMobileCount },
    ],
    [metrics.mobileCount, metrics.nonMobileCount]
  );

  // Mock movement over time for line chart (e.g., number of movements detected per hour)
  const movementLineData = useMemo(
    () => [
      { time: "08:00", movements: 2 },
      { time: "09:00", movements: 4 },
      { time: "10:00", movements: 6 },
      { time: "11:00", movements: 5 },
      { time: "12:00", movements: 7 },
      { time: "13:00", movements: 9 },
      { time: "14:00", movements: 6 },
      { time: "15:00", movements: 8 },
      { time: "16:00", movements: 10 },
      { time: "17:00", movements: 7 },
    ],
    []
  );

  // Optional pie chart data for mobility distribution
  const pieData = useMemo(
    () => [
      { name: "Mobile", value: metrics.mobileCount },
      { name: "Non-Mobile", value: metrics.nonMobileCount },
    ],
    [metrics.mobileCount, metrics.nonMobileCount]
  );

  const COLORS = ["#F97316", "#374151"]; // primary orange and neutral surface-600

  // Recent history stays for context
  const history = [
    { id: "A-1021", name: "Forest North", status: "Completed", accuracy: 0.93, time: "2m 14s" },
    { id: "A-1020", name: "River Watch", status: "Completed", accuracy: 0.89, time: "1m 02s" },
    { id: "A-1019", name: "Valley Cam", status: "Queued", accuracy: "-", time: "-" },
  ];

  return (
    <div className="space-y-6">
      {/* Summary KPI cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <SummaryStat label="Total Videos Analyzed" value={metrics.totalVideos} change="+8" positive />
        <SummaryStat label="Accuracy" value={`${metrics.accuracyPct.toFixed(1)}%`} change="+0.7%" positive />
        <SummaryStat label="Bears Detected" value={metrics.bearsDetected} change="+3" positive />
      </div>

      {/* Charts Row */}
      <div className="grid xl:grid-cols-3 gap-6">
        {/* Bar Chart: Mobile vs Non-Mobile */}
        <Card title="Mobility Distribution (Bears)">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mobilityBarData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="type" tick={{ fill: "rgba(255,255,255,0.7)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.7)" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, color: "#fff" }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="#F97316" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Line Chart: Movement Over Time */}
        <Card title="Bear Movement Over Time">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={movementLineData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="time" tick={{ fill: "rgba(255,255,255,0.7)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.7)" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, color: "#fff" }}
                />
                <Line type="monotone" dataKey="movements" stroke="#F97316" strokeWidth={3} dot={{ r: 3, stroke: "#000", strokeWidth: 1 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Optional Pie Chart */}
        <Card title="Mobility vs Non-Mobility (%)">
          <div className="h-64 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  formatter={(val) => [`${val}`, "Count"]}
                  contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, color: "#fff" }}
                />
                <Legend verticalAlign="bottom" height={24} wrapperStyle={{ color: "rgba(255,255,255,0.7)" }} />
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  outerRadius={70}
                  label={(e) => `${e.name} ${Math.round((e.value / (metrics.mobileCount + metrics.nonMobileCount)) * 100)}%`}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#111827" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Existing Performance + Recent Analyses */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card title="Model Performance">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-muted mb-2">Accuracy Trend</div>
              <div className="flex gap-0.5 text-primary/80 items-end h-16">
                {[10, 40, 30, 60, 45, 70, 80, 65, 85].map((v, i) => (
                  <div key={i} style={{ height: `${v}%` }} className="w-1.5 bg-primary rounded-t" />
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted mb-2">Inference Time (ms)</div>
              <div className="flex gap-0.5 text-primary/80 items-end h-16">
                {[80, 60, 70, 55, 65, 50, 45, 60, 40].map((v, i) => (
                  <div key={i} style={{ height: `${v}%` }} className="w-1.5 bg-primary rounded-t" />
                ))}
              </div>
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
      <Card title="Import Images" action={<UploadButton onFiles={onFiles} />}>
        <p className="text-sm text-muted mb-4">Upload images to run detection. Supported formats: JPG, PNG. Max 10MB per file.</p>
        {files.length === 0 ? (
          <div className="border border-dashed border-border rounded-xl p-8 text-center text-muted">No files uploaded yet.</div>
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
