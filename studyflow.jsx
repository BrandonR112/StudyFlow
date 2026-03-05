import { useState } from "react";

const COLORS = {
  bg: "#F0F4F8",
  card: "#FFFFFF",
  navy: "#1A3355",
  blue: "#2D6BE4",
  teal: "#1DB8A4",
  green: "#2ECC8A",
  softBlue: "#E8F0FE",
  softGreen: "#E6FAF5",
  muted: "#8A9BB0",
  border: "#DDE6F0",
  text: "#1A2E45",
  lightText: "#5A6E85",
};

const initialTasks = [
  { id: 1, subject: "Biology", label: "ATP Synthesis", desc: "Complete 20 flashcards on ATP synthesis — focus on electron transport chain steps", done: false, color: "#2D6BE4" },
  { id: 2, subject: "Physiology", label: "Essay Draft", desc: "Write 250 words on cardiovascular physiology for intro section", done: false, color: "#1DB8A4" },
  { id: 3, subject: "Chemistry", label: "Problem Set", desc: "Solve questions 4–9 on organic reaction mechanisms (pg. 112)", done: false, color: "#2ECC8A" },
  { id: 4, subject: "Maths", label: "Past Paper", desc: "Complete 2019 Paper 2 under timed conditions (45 min)", done: true, color: "#7B61FF" },
];

const assignments = [
  { id: 1, title: "Physiology Essay", due: "Mar 12", progress: 38, color: "#1DB8A4", total: "2,500 words", done: "950 words" },
  { id: 2, title: "Chemistry Lab Report", due: "Mar 15", progress: 65, color: "#2D6BE4", total: "8 sections", done: "5 sections" },
  { id: 3, title: "Biology Exam Prep", due: "Mar 20", progress: 52, color: "#2ECC8A", total: "120 cards", done: "62 cards" },
  { id: 4, title: "Maths Revision", due: "Mar 22", progress: 80, color: "#7B61FF", total: "10 topics", done: "8 topics" },
];

const forecast = [
  { id: 1, title: "Physiology Essay", date: "Wed, 12 Mar", type: "assignment", urgent: true, color: "#1DB8A4" },
  { id: 2, title: "Chemistry Lab Report", date: "Sat, 15 Mar", type: "assignment", urgent: true, color: "#2D6BE4" },
  { id: 3, title: "Biology Mock Exam", date: "Thu, 20 Mar", type: "exam", urgent: false, color: "#FF6B6B" },
  { id: 4, title: "Maths Final Exam", date: "Sun, 22 Mar", type: "exam", urgent: false, color: "#7B61FF" },
  { id: 5, title: "Physics Coursework", date: "Fri, 28 Mar", type: "assignment", urgent: false, color: "#F5A623" },
];

const journalEntries = [
  { id: 1, date: "Mar 5", mood: "😤", title: "Tough day but pushed through", body: "Struggled with organic mechanisms but finally cracked the SN2 reactions after watching 3 videos. Note to self: draw every step." },
  { id: 2, date: "Mar 4", mood: "🔥", title: "Super productive session", body: "Knocked out 40 flashcards in one go. The Pomodoro technique is genuinely working — 25 min focus blocks feel sustainable." },
  { id: 3, date: "Mar 3", mood: "😴", title: "Low energy, did what I could", body: "Only got 90 min of study done. Prioritised biology since the exam is closest. Rest is important too." },
];

const collaborators = [
  { id: 1, name: "Aisha R.", avatar: "AR", subject: "Biology Exam Prep", role: "Study Partner", status: "online", color: "#2ECC8A" },
  { id: 2, name: "Tom K.", avatar: "TK", subject: "Physiology Essay", role: "Peer Reviewer", status: "offline", color: "#2D6BE4" },
  { id: 3, name: "Priya S.", avatar: "PS", subject: "Chemistry Lab", role: "Lab Partner", status: "online", color: "#1DB8A4" },
];

const ProgressRing = ({ pct, size = 44, stroke = 4, color }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={COLORS.border} strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s ease" }} />
    </svg>
  );
};

const DaysUntil = (dateStr) => {
  const now = new Date(2026, 2, 5);
  const parts = dateStr.split(" ");
  const months = { Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11 };
  const d = new Date(2026, months[parts[2]], parseInt(parts[1]));
  return Math.ceil((d - now) / 86400000);
};

export default function Studyflow() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [tasks, setTasks] = useState(initialTasks);
  const [showModal, setShowModal] = useState(false);
  const [modalTab, setModalTab] = useState("assignment");
  const [journalOpen, setJournalOpen] = useState(null);
  const [newEntry, setNewEntry] = useState(false);
  const [entryText, setEntryText] = useState({ title: "", body: "", mood: "😊" });

  const toggleTask = (id) => setTasks(t => t.map(x => x.id === id ? { ...x, done: !x.done } : x));
  const doneTasks = tasks.filter(t => t.done).length;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: COLORS.bg, minHeight: "100vh", maxWidth: 430, margin: "0 auto", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { display: none; }
        .tab-content { animation: fadeUp 0.3s ease; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .task-item { transition: all 0.2s ease; }
        .task-item:active { transform: scale(0.98); }
        .nav-btn { transition: all 0.2s ease; }
        .nav-btn:active { transform: scale(0.9); }
        .progress-bar-fill { transition: width 0.8s cubic-bezier(0.25,1,0.5,1); }
        .chip { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; letter-spacing: 0.04em; }
        .card { background: #fff; border-radius: 18px; padding: 16px; margin-bottom: 12px; box-shadow: 0 2px 12px rgba(26,51,85,0.06); }
        .modal-overlay { position: fixed; inset: 0; background: rgba(10,20,40,0.45); z-index: 100; display: flex; align-items: flex-end; justify-content: center; animation: fadeIn 0.2s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .modal-sheet { background: #fff; border-radius: 28px 28px 0 0; width: 100%; max-width: 430px; padding: 24px; padding-bottom: 40px; animation: slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1); }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        input, textarea { outline: none; font-family: 'DM Sans', sans-serif; }
        button { cursor: pointer; border: none; font-family: 'DM Sans', sans-serif; }
        .avatar { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; color: white; }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
      `}</style>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1A3355 0%, #2D6BE4 100%)", padding: "52px 20px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 140, height: 140, borderRadius: "50%", background: "rgba(29,184,164,0.2)" }} />
        <div style={{ position: "absolute", top: 20, right: 60, width: 60, height: 60, borderRadius: "50%", background: "rgba(46,204,138,0.15)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>Thursday, 5 Mar</p>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", color: "#fff", fontSize: 26, fontWeight: 400, marginTop: 4, lineHeight: 1.2 }}>
              Good morning,<br /><span style={{ fontStyle: "italic", color: "#A8D5FF" }}>Jamie 👋</span>
            </h1>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", borderRadius: 14, padding: "8px 14px" }}>
              <p style={{ color: "#fff", fontSize: 22, fontWeight: 700 }}>{doneTasks}/{tasks.length}</p>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, fontWeight: 500 }}>done today</p>
            </div>
          </div>
        </div>
        {/* Mini streak */}
        <div style={{ display: "flex", gap: 6, marginTop: 16 }}>
          {["M","T","W","T","F","S","S"].map((d, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, fontWeight: 600 }}>{d}</p>
              <div style={{ width: "100%", height: 6, borderRadius: 4, background: i <= 3 ? (i === 3 ? "#2ECC8A" : "rgba(46,204,138,0.7)") : "rgba(255,255,255,0.15)" }} />
            </div>
          ))}
        </div>
      </div>

      {/* Scrollable Content */}
      <div style={{ height: "calc(100vh - 150px)", overflowY: "auto", padding: "16px 16px 90px" }}>

        {activeTab === "dashboard" && (
          <div className="tab-content">

            {/* Forecast Strip */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <h2 style={{ fontSize: 13, fontWeight: 700, color: COLORS.muted, letterSpacing: "0.07em", textTransform: "uppercase" }}>📅 Upcoming Deadlines</h2>
                <span style={{ fontSize: 12, color: COLORS.blue, fontWeight: 600 }}>View all</span>
              </div>
              <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
                {forecast.map(f => {
                  const days = DaysUntil(f.date);
                  return (
                    <div key={f.id} style={{ minWidth: 128, background: "#fff", borderRadius: 16, padding: "12px 14px", boxShadow: "0 2px 10px rgba(26,51,85,0.06)", borderTop: `3px solid ${f.color}`, flexShrink: 0 }}>
                      <span className="chip" style={{ background: f.type === "exam" ? "#FFF0F0" : COLORS.softBlue, color: f.type === "exam" ? "#E05050" : COLORS.blue, marginBottom: 6 }}>
                        {f.type === "exam" ? "📝 Exam" : "📋 Task"}
                      </span>
                      <p style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, marginBottom: 2, lineHeight: 1.3 }}>{f.title}</p>
                      <p style={{ fontSize: 11, color: COLORS.muted, fontWeight: 500 }}>{f.date}</p>
                      <div style={{ marginTop: 8, background: days <= 7 ? "#FFF5F5" : COLORS.softGreen, borderRadius: 8, padding: "3px 8px", display: "inline-block" }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: days <= 7 ? "#E05050" : "#1DB8A4" }}>{days}d left</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Today's Tasks */}
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <h2 style={{ fontSize: 13, fontWeight: 700, color: COLORS.muted, letterSpacing: "0.07em", textTransform: "uppercase" }}>✅ Today's Tasks</h2>
                <span className="chip" style={{ background: COLORS.softBlue, color: COLORS.blue }}>{doneTasks}/{tasks.length} done</span>
              </div>

              {/* Progress micro bar */}
              <div style={{ height: 5, background: COLORS.border, borderRadius: 10, marginBottom: 14, overflow: "hidden" }}>
                <div className="progress-bar-fill" style={{ height: "100%", width: `${(doneTasks/tasks.length)*100}%`, background: "linear-gradient(90deg, #2D6BE4, #2ECC8A)", borderRadius: 10 }} />
              </div>

              {tasks.map(task => (
                <div key={task.id} className="task-item" onClick={() => toggleTask(task.id)}
                  style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 0", borderBottom: `1px solid ${COLORS.border}`, cursor: "pointer", opacity: task.done ? 0.5 : 1 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 7, border: task.done ? "none" : `2px solid ${task.color}`, background: task.done ? task.color : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2, transition: "all 0.2s" }}>
                    {task.done && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                      <span className="chip" style={{ background: `${task.color}18`, color: task.color, fontSize: 10 }}>{task.subject}</span>
                      <p style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, textDecoration: task.done ? "line-through" : "none" }}>{task.label}</p>
                    </div>
                    <p style={{ fontSize: 12, color: COLORS.lightText, lineHeight: 1.5 }}>{task.desc}</p>
                  </div>
                </div>
              ))}
              <button style={{ width: "100%", marginTop: 12, padding: "10px", background: COLORS.softBlue, border: "none", borderRadius: 12, fontSize: 13, fontWeight: 600, color: COLORS.blue, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                + Add task
              </button>
            </div>

            {/* Progress Stats */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <h2 style={{ fontSize: 13, fontWeight: 700, color: COLORS.muted, letterSpacing: "0.07em", textTransform: "uppercase" }}>📊 Assignment Progress</h2>
              </div>
              {assignments.map(a => (
                <div key={a.id} className="card" style={{ marginBottom: 10, padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <ProgressRing pct={a.progress} color={a.color} size={48} stroke={4} />
                      <p style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: a.color }}>{a.progress}%</p>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{a.title}</p>
                        <span className="chip" style={{ background: "#FFF8EC", color: "#D4820A", fontSize: 10 }}>Due {a.due}</span>
                      </div>
                      <div style={{ height: 6, background: COLORS.border, borderRadius: 10, overflow: "hidden", marginBottom: 4 }}>
                        <div className="progress-bar-fill" style={{ height: "100%", width: `${a.progress}%`, background: `linear-gradient(90deg, ${a.color}99, ${a.color})`, borderRadius: 10 }} />
                      </div>
                      <p style={{ fontSize: 11, color: COLORS.muted, fontWeight: 500 }}>{a.done} of {a.total}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── JOURNAL ── */}
        {activeTab === "journal" && (
          <div className="tab-content">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: COLORS.navy }}>Study Journal</h2>
                <p style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>Reflect. Review. Improve.</p>
              </div>
              <button onClick={() => setNewEntry(true)} style={{ background: "linear-gradient(135deg, #2D6BE4, #1DB8A4)", color: "#fff", border: "none", borderRadius: 12, padding: "8px 16px", fontSize: 13, fontWeight: 600 }}>+ New</button>
            </div>

            {newEntry && (
              <div className="card" style={{ border: `2px solid ${COLORS.blue}` }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: COLORS.navy, marginBottom: 10 }}>New Entry — Today</p>
                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  {["😊","😤","🔥","😴","💪"].map(m => (
                    <button key={m} onClick={() => setEntryText(e => ({...e, mood: m}))} style={{ fontSize: 20, background: entryText.mood === m ? COLORS.softBlue : "transparent", border: "none", borderRadius: 10, padding: "4px 8px", cursor: "pointer" }}>{m}</button>
                  ))}
                </div>
                <input value={entryText.title} onChange={e => setEntryText(x => ({...x, title: e.target.value}))} placeholder="Title..." style={{ width: "100%", fontSize: 14, fontWeight: 600, border: "none", borderBottom: `1px solid ${COLORS.border}`, paddingBottom: 8, marginBottom: 10, color: COLORS.text, background: "transparent" }} />
                <textarea value={entryText.body} onChange={e => setEntryText(x => ({...x, body: e.target.value}))} placeholder="How did your study session go..." rows={4} style={{ width: "100%", fontSize: 13, border: "none", color: COLORS.lightText, resize: "none", background: "transparent", lineHeight: 1.6 }} />
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button onClick={() => setNewEntry(false)} style={{ flex: 1, padding: 10, background: COLORS.border, borderRadius: 12, fontSize: 13, fontWeight: 600, color: COLORS.lightText }}>Cancel</button>
                  <button onClick={() => setNewEntry(false)} style={{ flex: 2, padding: 10, background: "linear-gradient(135deg, #2D6BE4, #1DB8A4)", borderRadius: 12, fontSize: 13, fontWeight: 600, color: "#fff" }}>Save Entry</button>
                </div>
              </div>
            )}

            {journalEntries.map(e => (
              <div key={e.id} className="card" style={{ cursor: "pointer", border: journalOpen === e.id ? `2px solid ${COLORS.blue}` : "2px solid transparent" }} onClick={() => setJournalOpen(journalOpen === e.id ? null : e.id)}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <span style={{ fontSize: 24 }}>{e.mood}</span>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{e.title}</p>
                      <p style={{ fontSize: 11, color: COLORS.muted, fontWeight: 500 }}>{e.date}</p>
                    </div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: journalOpen === e.id ? "rotate(180deg)" : "none", transition: "transform 0.2s", marginTop: 4 }}>
                    <path d="M4 6l4 4 4-4" stroke={COLORS.muted} strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                {journalOpen === e.id && (
                  <p style={{ fontSize: 13, color: COLORS.lightText, lineHeight: 1.7, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${COLORS.border}` }}>{e.body}</p>
                )}
              </div>
            ))}

            <div className="card" style={{ background: "linear-gradient(135deg, #F0F7FF, #E6FAF5)", textAlign: "center", padding: "20px 16px" }}>
              <p style={{ fontSize: 28, marginBottom: 8 }}>🔥</p>
              <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: COLORS.navy }}>4-day study streak</p>
              <p style={{ fontSize: 12, color: COLORS.muted, marginTop: 4 }}>Keep it going — log today's session</p>
            </div>
          </div>
        )}

        {/* ── COLLABORATION ── */}
        {activeTab === "collab" && (
          <div className="tab-content">
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: COLORS.navy }}>Collaboration</h2>
              <p style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>Group projects & study partners</p>
            </div>

            <div className="card" style={{ background: "linear-gradient(135deg, #1A3355, #2D6BE4)", padding: "18px 16px", marginBottom: 16 }}>
              <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: "#fff", marginBottom: 4 }}>Invite a Study Partner</p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginBottom: 14 }}>Share workload, assign tasks, review each other's work</p>
              <div style={{ display: "flex", gap: 8 }}>
                <input placeholder="Enter email or name..." style={{ flex: 1, background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#fff", backdropFilter: "blur(4px)" }} />
                <button style={{ background: "#2ECC8A", border: "none", borderRadius: 10, padding: "10px 16px", fontSize: 13, fontWeight: 700, color: "#fff" }}>Invite</button>
              </div>
            </div>

            <h3 style={{ fontSize: 13, fontWeight: 700, color: COLORS.muted, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 10 }}>Active Collaborators</h3>

            {collaborators.map(c => (
              <div key={c.id} className="card" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="avatar" style={{ background: `linear-gradient(135deg, ${c.color}, ${c.color}99)` }}>{c.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{c.name}</p>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: c.status === "online" ? "#2ECC8A" : COLORS.border, ...(c.status === "online" ? {} : {}) }} className={c.status === "online" ? "pulse" : ""} />
                  </div>
                  <p style={{ fontSize: 12, color: COLORS.muted }}>{c.role} · {c.subject}</p>
                </div>
                <button style={{ background: COLORS.softBlue, border: "none", borderRadius: 10, padding: "7px 12px", fontSize: 12, fontWeight: 600, color: COLORS.blue }}>Message</button>
              </div>
            ))}

            <h3 style={{ fontSize: 13, fontWeight: 700, color: COLORS.muted, letterSpacing: "0.07em", textTransform: "uppercase", margin: "16px 0 10px" }}>Assigned to Others</h3>

            {[
              { to: "Aisha R.", task: "Review ATP flashcards", due: "Today", color: "#2ECC8A" },
              { to: "Priya S.", task: "Compile lab data table", due: "Mar 12", color: "#1DB8A4" },
            ].map((t, i) => (
              <div key={i} className="card" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 4, height: 40, background: t.color, borderRadius: 4 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{t.task}</p>
                  <p style={{ fontSize: 12, color: COLORS.muted }}>→ {t.to} · Due {t.due}</p>
                </div>
                <span className="chip" style={{ background: COLORS.softGreen, color: "#1DB8A4" }}>Pending</span>
              </div>
            ))}
          </div>
        )}

        {/* ── SETTINGS ── */}
        {activeTab === "settings" && (
          <div className="tab-content">
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: COLORS.navy }}>Settings</h2>
              <p style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>Personalise your Studyflow</p>
            </div>

            {/* Profile */}
            <div className="card" style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16, background: "linear-gradient(135deg, #F0F7FF, #E6FAF5)" }}>
              <div className="avatar" style={{ width: 52, height: 52, background: "linear-gradient(135deg, #2D6BE4, #1DB8A4)", fontSize: 18 }}>JM</div>
              <div>
                <p style={{ fontSize: 16, fontWeight: 700, color: COLORS.navy }}>Jamie Matthews</p>
                <p style={{ fontSize: 12, color: COLORS.muted }}>Year 3 · Biomedical Sciences</p>
              </div>
            </div>

            {[
              { section: "Notifications", items: [
                { label: "Deadline reminders", sub: "24h & 1h before due", on: true },
                { label: "Daily task digest", sub: "8:00 AM every day", on: true },
                { label: "Collaborator updates", sub: "When tasks are completed", on: false },
              ]},
              { section: "Preferences", items: [
                { label: "Focus mode", sub: "Hide distractions during study", on: false },
                { label: "Dark mode", sub: "Easier on the eyes at night", on: false },
                { label: "Weekly summary", sub: "Every Sunday evening", on: true },
              ]},
            ].map(group => (
              <div key={group.section} style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: COLORS.muted, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 8 }}>{group.section}</h3>
                <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                  {group.items.map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", padding: "14px 16px", borderBottom: i < group.items.length - 1 ? `1px solid ${COLORS.border}` : "none" }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{item.label}</p>
                        <p style={{ fontSize: 12, color: COLORS.muted }}>{item.sub}</p>
                      </div>
                      <div style={{ width: 44, height: 24, borderRadius: 12, background: item.on ? "linear-gradient(90deg, #2D6BE4, #1DB8A4)" : COLORS.border, position: "relative", transition: "background 0.3s", cursor: "pointer" }}>
                        <div style={{ position: "absolute", top: 3, left: item.on ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)", transition: "left 0.3s" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <button style={{ width: "100%", padding: "14px", background: "#FFF0F0", border: "none", borderRadius: 14, fontSize: 14, fontWeight: 600, color: "#E05050", marginTop: 8 }}>Sign Out</button>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(16px)", borderTop: `1px solid ${COLORS.border}`, padding: "10px 8px 24px", display: "flex", justifyContent: "space-around", alignItems: "center", zIndex: 50 }}>
        {[
          { id: "dashboard", icon: (a) => <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="2" y="2" width="8" height="8" rx="2.5" fill={a ? COLORS.blue : "none"} stroke={a ? COLORS.blue : COLORS.muted} strokeWidth="1.6"/><rect x="12" y="2" width="8" height="8" rx="2.5" fill={a ? "#1DB8A4" : "none"} stroke={a ? "#1DB8A4" : COLORS.muted} strokeWidth="1.6"/><rect x="2" y="12" width="8" height="8" rx="2.5" fill="none" stroke={a ? COLORS.blue : COLORS.muted} strokeWidth="1.6"/><rect x="12" y="12" width="8" height="8" rx="2.5" fill="none" stroke={a ? "#1DB8A4" : COLORS.muted} strokeWidth="1.6"/></svg>, label: "Dashboard" },
          { id: "journal", icon: (a) => <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="4" y="2" width="14" height="18" rx="3" fill={a ? COLORS.softBlue : "none"} stroke={a ? COLORS.blue : COLORS.muted} strokeWidth="1.6"/><line x1="8" y1="8" x2="14" y2="8" stroke={a ? COLORS.blue : COLORS.muted} strokeWidth="1.4" strokeLinecap="round"/><line x1="8" y1="12" x2="14" y2="12" stroke={a ? COLORS.blue : COLORS.muted} strokeWidth="1.4" strokeLinecap="round"/><line x1="8" y1="16" x2="12" y2="16" stroke={a ? COLORS.blue : COLORS.muted} strokeWidth="1.4" strokeLinecap="round"/></svg>, label: "Journal" },
          { id: "add", icon: () => null, label: "Add" },
          { id: "collab", icon: (a) => <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="8" cy="8" r="3" fill={a ? COLORS.softBlue : "none"} stroke={a ? COLORS.blue : COLORS.muted} strokeWidth="1.6"/><circle cx="15" cy="7" r="2.5" fill="none" stroke={a ? COLORS.blue : COLORS.muted} strokeWidth="1.4"/><path d="M2 18c0-3 2.7-5 6-5s6 2 6 5" stroke={a ? COLORS.blue : COLORS.muted} strokeWidth="1.6" strokeLinecap="round"/><path d="M15 13c2 0 4 1.3 4 3.5" stroke={a ? COLORS.blue : COLORS.muted} strokeWidth="1.4" strokeLinecap="round"/></svg>, label: "Collab" },
          { id: "settings", icon: (a) => <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="3" fill={a ? COLORS.softBlue : "none"} stroke={a ? COLORS.blue : COLORS.muted} strokeWidth="1.6"/><path d="M11 2v2M11 18v2M2 11h2M18 11h2M4.9 4.9l1.4 1.4M15.7 15.7l1.4 1.4M4.9 17.1l1.4-1.4M15.7 6.3l1.4-1.4" stroke={a ? COLORS.blue : COLORS.muted} strokeWidth="1.6" strokeLinecap="round"/></svg>, label: "Settings" },
        ].map(btn => {
          const isAdd = btn.id === "add";
          const active = activeTab === btn.id;
          return (
            <button key={btn.id} className="nav-btn" onClick={() => isAdd ? setShowModal(true) : setActiveTab(btn.id)}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "transparent", border: "none", cursor: "pointer", padding: isAdd ? 0 : "4px 12px", position: "relative" }}>
              {isAdd ? (
                <div style={{ width: 52, height: 52, borderRadius: 18, background: "linear-gradient(135deg, #2D6BE4, #1DB8A4)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(45,107,228,0.4)", marginTop: -22 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><line x1="12" y1="6" x2="12" y2="18" stroke="white" strokeWidth="2.2" strokeLinecap="round"/><line x1="6" y1="12" x2="18" y2="12" stroke="white" strokeWidth="2.2" strokeLinecap="round"/></svg>
                </div>
              ) : (
                <>
                  {btn.icon(active)}
                  <p style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? COLORS.blue : COLORS.muted, letterSpacing: "0.02em" }}>{btn.label}</p>
                  {active && <div style={{ width: 4, height: 4, borderRadius: "50%", background: COLORS.blue, position: "absolute", bottom: -2 }} />}
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div style={{ width: 36, height: 4, background: COLORS.border, borderRadius: 4, margin: "0 auto 20px" }} />
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: COLORS.navy, marginBottom: 16 }}>Add New</h2>

            {/* Tab selector */}
            <div style={{ display: "flex", background: COLORS.bg, borderRadius: 14, padding: 4, marginBottom: 20, gap: 4 }}>
              {["assignment", "exam", "progress"].map(t => (
                <button key={t} onClick={() => setModalTab(t)} style={{ flex: 1, padding: "9px 0", background: modalTab === t ? "#fff" : "transparent", border: "none", borderRadius: 11, fontSize: 12, fontWeight: 700, color: modalTab === t ? COLORS.blue : COLORS.muted, textTransform: "capitalize", boxShadow: modalTab === t ? "0 2px 8px rgba(45,107,228,0.1)" : "none", transition: "all 0.2s" }}>
                  {t === "assignment" ? "📋 Task" : t === "exam" ? "📝 Exam" : "📈 Progress"}
                </button>
              ))}
            </div>

            {modalTab === "assignment" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[["Subject", "e.g. Biology"], ["Assignment title", "e.g. Essay Draft"], ["What needs doing", "e.g. Write 250 words on..."]].map(([label, ph], i) => (
                  <div key={i}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: COLORS.muted, marginBottom: 6 }}>{label}</p>
                    {i === 2 ? <textarea rows={3} placeholder={ph} style={{ width: "100%", border: `1.5px solid ${COLORS.border}`, borderRadius: 12, padding: "10px 14px", fontSize: 13, color: COLORS.text, resize: "none", background: COLORS.bg }} /> : <input placeholder={ph} style={{ width: "100%", border: `1.5px solid ${COLORS.border}`, borderRadius: 12, padding: "10px 14px", fontSize: 13, color: COLORS.text, background: COLORS.bg }} />}
                  </div>
                ))}
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: COLORS.muted, marginBottom: 6 }}>Due date</p>
                  <input type="date" style={{ width: "100%", border: `1.5px solid ${COLORS.border}`, borderRadius: 12, padding: "10px 14px", fontSize: 13, color: COLORS.text, background: COLORS.bg }} />
                </div>
              </div>
            )}

            {modalTab === "exam" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[["Subject", "e.g. Chemistry"], ["Exam title", "e.g. Paper 1 Mock"]].map(([label, ph], i) => (
                  <div key={i}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: COLORS.muted, marginBottom: 6 }}>{label}</p>
                    <input placeholder={ph} style={{ width: "100%", border: `1.5px solid ${COLORS.border}`, borderRadius: 12, padding: "10px 14px", fontSize: 13, color: COLORS.text, background: COLORS.bg }} />
                  </div>
                ))}
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: COLORS.muted, marginBottom: 6 }}>Exam date</p>
                  <input type="date" style={{ width: "100%", border: `1.5px solid ${COLORS.border}`, borderRadius: 12, padding: "10px 14px", fontSize: 13, color: COLORS.text, background: COLORS.bg }} />
                </div>
              </div>
            )}

            {modalTab === "progress" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: COLORS.muted, marginBottom: 6 }}>Select assignment</p>
                  <select style={{ width: "100%", border: `1.5px solid ${COLORS.border}`, borderRadius: 12, padding: "10px 14px", fontSize: 13, color: COLORS.text, background: COLORS.bg }}>
                    {assignments.map(a => <option key={a.id}>{a.title}</option>)}
                  </select>
                </div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: COLORS.muted, marginBottom: 6 }}>Progress update</p>
                  <input placeholder="e.g. Completed intro section, 400 words written" style={{ width: "100%", border: `1.5px solid ${COLORS.border}`, borderRadius: 12, padding: "10px 14px", fontSize: 13, color: COLORS.text, background: COLORS.bg }} />
                </div>
              </div>
            )}

            <button onClick={() => setShowModal(false)} style={{ width: "100%", marginTop: 20, padding: "14px", background: "linear-gradient(135deg, #1A3355, #2D6BE4)", border: "none", borderRadius: 14, fontSize: 15, fontWeight: 700, color: "#fff", letterSpacing: "0.02em" }}>
              Save →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
