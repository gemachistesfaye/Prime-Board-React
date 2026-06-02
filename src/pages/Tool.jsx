import { useState, useEffect, useRef } from "react";
import {
  Calculator, BookOpen, Timer, Play, Pause, RefreshCw, Copy, CheckCircle2,
  Plus, Trash2, BookMarked, PenTool, List, MessageSquare, Calendar,
  BarChart2, ArrowLeftRight, Layers, Brain, Target, FileText, Hash,
  ChevronLeft, ChevronRight, Shuffle, Download, Star, StarOff, Filter,
  AlertTriangle, Clock, CheckSquare, Square, Flag, BookMarkedIcon
} from "lucide-react";

// ─── Tool Registry ────────────────────────────────────────────────────────────
const toolOptions = [
  { key: "gpa",        label: "GPA Calculator",      icon: Calculator,    color: "blue"   },
  { key: "timer",      label: "Pomodoro Timer",       icon: Timer,         color: "emerald"},
  { key: "citation",   label: "Citation Generator",   icon: BookOpen,      color: "amber"  },
  { key: "words",      label: "Word Counter",         icon: PenTool,       color: "purple" },
  { key: "todo",       label: "To‑Do List",           icon: List,          color: "indigo" },
  { key: "quote",      label: "Random Quote",         icon: MessageSquare, color: "green"  },
  { key: "assignment", label: "Assignment Tracker",   icon: Calendar,      color: "rose"   },
  { key: "attendance", label: "Attendance Calc",      icon: BarChart2,     color: "cyan"   },
  { key: "converter",  label: "Unit Converter",       icon: ArrowLeftRight,color: "orange" },
  { key: "flashcard",  label: "Flashcard Maker",      icon: Layers,        color: "violet" },
  { key: "planner",    label: "Study Planner",        icon: Brain,         color: "pink"   },
  { key: "exam",       label: "Exam Countdown",       icon: Clock,         color: "red"    },
  { key: "goal",       label: "Goal Tracker",         icon: Target,        color: "teal"   },
  { key: "notepad",    label: "Note Pad",             icon: FileText,      color: "slate"  },
  { key: "loan",       label: "Loan Calculator",      icon: Hash,          color: "yellow" },
  { key: "text",       label: "Text Converter",       icon: BookMarkedIcon,color: "fuchsia"},
];

const colorMap = {
  blue:    "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  emerald: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  amber:   "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  purple:  "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  indigo:  "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
  green:   "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  rose:    "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
  cyan:    "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400",
  orange:  "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  violet:  "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
  pink:    "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
  red:     "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  teal:    "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400",
  slate:   "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  yellow:  "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
  fuchsia: "bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-900/30 dark:text-fuchsia-400",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getPointFromScore = (score) => {
  const s = parseFloat(score);
  if (isNaN(s)) return 0;
  if (s >= 93) return 4.0;
  if (s >= 90) return 3.7;
  if (s >= 87) return 3.3;
  if (s >= 83) return 3.0;
  if (s >= 80) return 2.7;
  if (s >= 77) return 2.3;
  if (s >= 73) return 2.0;
  if (s >= 70) return 1.7;
  if (s >= 67) return 1.3;
  if (s >= 60) return 1.0;
  return 0.0;
};

const getLetterGrade = (score) => {
  const s = parseFloat(score);
  if (isNaN(s)) return "—";
  if (s >= 93) return "A";
  if (s >= 90) return "A-";
  if (s >= 87) return "B+";
  if (s >= 83) return "B";
  if (s >= 80) return "B-";
  if (s >= 77) return "C+";
  if (s >= 73) return "C";
  if (s >= 70) return "C-";
  if (s >= 67) return "D+";
  if (s >= 60) return "D";
  return "F";
};

const getGpaStatus = (gpa) => {
  const g = parseFloat(gpa);
  if (g >= 3.7) return { label: "Distinction", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" };
  if (g >= 3.0) return { label: "Good Standing", color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20" };
  if (g >= 2.0) return { label: "Satisfactory", color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20" };
  return { label: "At Risk", color: "text-red-600 bg-red-50 dark:bg-red-900/20" };
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Tool() {
  const [selectedTool, setSelectedTool] = useState("gpa");

  // ── 1. GPA Calculator ──────────────────────────────────────────────────────
  const [courses, setCourses] = useState([{ name: "", credits: 3, score: "" }]);
  const [gpa, setGpa] = useState(null);

  const calculateGpa = () => {
    let totalPoints = 0, totalCredits = 0;
    let valid = true;
    courses.forEach((c) => {
      if (!c.name || c.score === "") { valid = false; return; }
      const cr = parseFloat(c.credits) || 0;
      totalPoints += cr * getPointFromScore(c.score);
      totalCredits += cr;
    });
    if (!valid) return;
    setGpa(totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00");
  };

  // ── 2. Pomodoro Timer ──────────────────────────────────────────────────────
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [timerMode, setTimerMode] = useState("Work");
  const [pomodoroCount, setPomodoroCount] = useState(0);

  useEffect(() => {
    if (timerMode === "Work") setTimeLeft(workDuration * 60);
    else setTimeLeft(breakDuration * 60);
  }, [workDuration, breakDuration, timerMode]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      if (timerMode === "Work") {
        setPomodoroCount((c) => c + 1);
        setTimerMode("Break");
        setTimeLeft(breakDuration * 60);
      } else {
        setTimerMode("Work");
        setTimeLeft(workDuration * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, timerMode, workDuration, breakDuration]);

  const formatTime = (s) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
  const resetTimer = () => { setIsActive(false); setTimeLeft((timerMode === "Work" ? workDuration : breakDuration) * 60); };

  // ── 3. Citation Generator ─────────────────────────────────────────────────
  const citationStyles = ["APA", "MLA", "Chicago", "Harvard", "IEEE"];
  const [selectedStyle, setSelectedStyle] = useState("APA");
  const [citation, setCitation] = useState({ author: "", year: "", title: "", publisher: "" });
  const [generatedCitation, setGeneratedCitation] = useState("");
  const [citationHistory, setCitationHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  const generateCitation = () => {
    const { author, year, title, publisher } = citation;
    if (!author || !title) return;
    const stylesMap = {
      APA: `${author}. (${year || "n.d."}). *${title}*. ${publisher}.`,
      MLA: `${author}. "${title}." ${publisher}, ${year || "n.d."}.`,
      Chicago: `${author}. ${year || "n.d."}. "${title}." ${publisher}.`,
      Harvard: `${author} (${year || "n.d."}) ${title}. ${publisher}.`,
      IEEE: `${author}, "${title}," ${publisher}, ${year || "n.d."}.`,
    };
    const result = stylesMap[selectedStyle];
    setGeneratedCitation(result);
    setCitationHistory((prev) => [{ style: selectedStyle, text: result }, ...prev].slice(0, 5));
  };

  const copyCitation = () => {
    navigator.clipboard.writeText(generatedCitation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── 4. Word Counter ───────────────────────────────────────────────────────
  const [text, setText] = useState("");
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;
  const sentenceCount = text.split(/[.!?]+/).filter((s) => s.trim()).length;
  const paraCount = text.split(/\n\n+/).filter((p) => p.trim()).length;
  const readingTime = Math.ceil(wordCount / 200);
  const speakingTime = Math.ceil(wordCount / 130);
  const longestWord = text.trim().split(/\s+/).reduce((a, b) => (b.length > a.length ? b : a), "");
  const avgWordLen = wordCount > 0 ? (text.replace(/\s/g, "").length / wordCount).toFixed(1) : 0;
  const readabilityScore = wordCount > 0
    ? Math.max(0, Math.min(100, Math.round(206.835 - 1.015 * (wordCount / (sentenceCount || 1)) - 84.6 * (charCount / (wordCount || 1)))))
    : 0;

  const downloadWordReport = () => {
    const report = { words: wordCount, characters: charCount, sentences: sentenceCount, paragraphs: paraCount, longestWord, avgWordLength: avgWordLen, readingTimeMins: readingTime, speakingTimeMins: speakingTime, readabilityScore };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "word-report.json"; a.click();
    URL.revokeObjectURL(url);
  };

  // ── 5. To-Do List ─────────────────────────────────────────────────────────
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState("medium");
  const [newTodoDue, setNewTodoDue] = useState("");
  const [todoFilter, setTodoFilter] = useState("all");

  const addTodo = () => {
    if (!newTodo.trim()) return;
    setTodos([...todos, { id: Date.now(), text: newTodo.trim(), priority: newTodoPriority, due: newTodoDue, done: false }]);
    setNewTodo(""); setNewTodoDue("");
  };
  const toggleTodo = (id) => setTodos(todos.map((t) => t.id === id ? { ...t, done: !t.done } : t));
  const removeTodo = (id) => setTodos(todos.filter((t) => t.id !== id));
  const filteredTodos = todos.filter((t) => todoFilter === "all" ? true : todoFilter === "active" ? !t.done : t.done);
  const donePct = todos.length > 0 ? Math.round((todos.filter((t) => t.done).length / todos.length) * 100) : 0;
  const priorityColor = { high: "text-red-500", medium: "text-amber-500", low: "text-green-500" };
  const priorityBg = { high: "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800", medium: "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800", low: "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800" };

  // ── 6. Random Quote ───────────────────────────────────────────────────────
  const quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt", category: "motivation" },
    { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela", category: "education" },
    { text: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King", category: "education" },
    { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs", category: "motivation" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", category: "motivation" },
    { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", category: "success" },
    { text: "The best way to predict the future is to invent it.", author: "Alan Kay", category: "success" },
    { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky", category: "motivation" },
    { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke", category: "success" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain", category: "motivation" },
    { text: "Dream big, work hard, stay focused.", author: "Unknown", category: "motivation" },
    { text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown", category: "success" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela", category: "motivation" },
    { text: "Knowledge is power.", author: "Francis Bacon", category: "education" },
    { text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi", category: "education" },
  ];
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);
  const [quoteCategory, setQuoteCategory] = useState("all");
  const [favoriteQuotes, setFavoriteQuotes] = useState([]);

  const generateQuote = () => {
    const pool = quoteCategory === "all" ? quotes : quotes.filter((q) => q.category === quoteCategory);
    setCurrentQuote(pool[Math.floor(Math.random() * pool.length)]);
  };
  const toggleFavorite = (q) => {
    setFavoriteQuotes((prev) => prev.find((f) => f.text === q.text) ? prev.filter((f) => f.text !== q.text) : [...prev, q]);
  };
  const isFavorite = (q) => favoriteQuotes.some((f) => f.text === q.text);

  // ── 7. Assignment Tracker ─────────────────────────────────────────────────
  const [assignments, setAssignments] = useState([]);
  const [newAssignment, setNewAssignment] = useState({ title: "", subject: "", due: "", status: "pending" });

  const addAssignment = () => {
    if (!newAssignment.title || !newAssignment.due) return;
    setAssignments([...assignments, { ...newAssignment, id: Date.now() }]);
    setNewAssignment({ title: "", subject: "", due: "", status: "pending" });
  };
  const getDaysLeft = (due) => {
    const diff = Math.ceil((new Date(due) - new Date()) / (1000 * 60 * 60 * 24));
    return diff;
  };
  const assignmentStatusColor = (a) => {
    if (a.status === "done") return "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800";
    const d = getDaysLeft(a.due);
    if (d < 0) return "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800";
    if (d <= 2) return "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800";
    return "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700";
  };

  // ── 8. Attendance Calculator ──────────────────────────────────────────────
  const [attendanceSubjects, setAttendanceSubjects] = useState([{ subject: "", total: "", attended: "" }]);

  const getAttendancePct = (total, attended) => {
    const t = parseFloat(total), a = parseFloat(attended);
    if (!t || !a) return null;
    return Math.round((a / t) * 100);
  };

  // ── 9. Unit Converter ─────────────────────────────────────────────────────
  const converterCategories = {
    Length: { units: ["Meter", "Kilometer", "Mile", "Foot", "Inch", "Centimeter"], toBase: { Meter: 1, Kilometer: 1000, Mile: 1609.34, Foot: 0.3048, Inch: 0.0254, Centimeter: 0.01 } },
    Weight: { units: ["Kilogram", "Gram", "Pound", "Ounce"], toBase: { Kilogram: 1, Gram: 0.001, Pound: 0.453592, Ounce: 0.0283495 } },
    Temperature: { units: ["Celsius", "Fahrenheit", "Kelvin"], toBase: {} },
    Time: { units: ["Second", "Minute", "Hour", "Day"], toBase: { Second: 1, Minute: 60, Hour: 3600, Day: 86400 } },
  };
  const [converterCat, setConverterCat] = useState("Length");
  const [fromUnit, setFromUnit] = useState("Meter");
  const [toUnit, setToUnit] = useState("Kilometer");
  const [converterValue, setConverterValue] = useState("");

  const convertValue = () => {
    const val = parseFloat(converterValue);
    if (isNaN(val)) return "—";
    if (converterCat === "Temperature") {
      if (fromUnit === "Celsius" && toUnit === "Fahrenheit") return ((val * 9) / 5 + 32).toFixed(4);
      if (fromUnit === "Fahrenheit" && toUnit === "Celsius") return (((val - 32) * 5) / 9).toFixed(4);
      if (fromUnit === "Celsius" && toUnit === "Kelvin") return (val + 273.15).toFixed(4);
      if (fromUnit === "Kelvin" && toUnit === "Celsius") return (val - 273.15).toFixed(4);
      if (fromUnit === "Fahrenheit" && toUnit === "Kelvin") return ((val - 32) * 5 / 9 + 273.15).toFixed(4);
      if (fromUnit === "Kelvin" && toUnit === "Fahrenheit") return (((val - 273.15) * 9) / 5 + 32).toFixed(4);
      return val.toFixed(4);
    }
    const base = val * converterCategories[converterCat].toBase[fromUnit];
    return (base / converterCategories[converterCat].toBase[toUnit]).toFixed(6);
  };

  // ── 10. Flashcard Maker ───────────────────────────────────────────────────
  const [flashcards, setFlashcards] = useState([{ q: "What is React?", a: "A JavaScript library for building user interfaces." }]);
  const [newCard, setNewCard] = useState({ q: "", a: "" });
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const addCard = () => {
    if (!newCard.q || !newCard.a) return;
    setFlashcards([...flashcards, newCard]);
    setNewCard({ q: "", a: "" });
  };
  const shuffleCards = () => setFlashcards([...flashcards].sort(() => Math.random() - 0.5));

  // ── 11. Study Planner ─────────────────────────────────────────────────────
  const [studySubjects, setStudySubjects] = useState([]);
  const [newStudySubject, setNewStudySubject] = useState({ name: "", target: "", logged: "" });

  const addStudySubject = () => {
    if (!newStudySubject.name || !newStudySubject.target) return;
    setStudySubjects([...studySubjects, { ...newStudySubject, id: Date.now(), logged: parseFloat(newStudySubject.logged) || 0 }]);
    setNewStudySubject({ name: "", target: "", logged: "" });
  };
  const logHours = (id, hours) => setStudySubjects(studySubjects.map((s) => s.id === id ? { ...s, logged: Math.min(parseFloat(s.target), (parseFloat(s.logged) || 0) + parseFloat(hours)) } : s));

  // ── 12. Exam Countdown ────────────────────────────────────────────────────
  const [exams, setExams] = useState([]);
  const [newExam, setNewExam] = useState({ name: "", subject: "", date: "" });

  const addExam = () => {
    if (!newExam.name || !newExam.date) return;
    setExams([...exams, { ...newExam, id: Date.now() }]);
    setNewExam({ name: "", subject: "", date: "" });
  };
  const getExamCountdown = (date) => {
    const diff = new Date(date) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    const hours = Math.ceil(diff / (1000 * 60 * 60));
    return { days, hours };
  };

  // ── 13. Goal Tracker ─────────────────────────────────────────────────────
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ title: "", target: "", current: "" });

  const addGoal = () => {
    if (!newGoal.title || !newGoal.target) return;
    setGoals([...goals, { ...newGoal, id: Date.now(), current: parseFloat(newGoal.current) || 0 }]);
    setNewGoal({ title: "", target: "", current: "" });
  };
  const updateGoalProgress = (id, val) => setGoals(goals.map((g) => g.id === id ? { ...g, current: Math.min(parseFloat(g.target), parseFloat(val) || 0) } : g));

  // ── 14. Note Pad ─────────────────────────────────────────────────────────
  const [notes, setNotes] = useState([{ id: 1, title: "My First Note", content: "", createdAt: new Date().toLocaleDateString() }]);
  const [activeNoteId, setActiveNoteId] = useState(1);
  const activeNote = notes.find((n) => n.id === activeNoteId);

  const addNote = () => {
    const newNote = { id: Date.now(), title: `Note ${notes.length + 1}`, content: "", createdAt: new Date().toLocaleDateString() };
    setNotes([...notes, newNote]);
    setActiveNoteId(newNote.id);
  };
  const updateNote = (id, field, val) => setNotes(notes.map((n) => n.id === id ? { ...n, [field]: val } : n));
  const deleteNote = (id) => { setNotes(notes.filter((n) => n.id !== id)); setActiveNoteId(notes[0]?.id); };

  // ── 15. Loan Calculator ───────────────────────────────────────────────────
  const [loanAmount, setLoanAmount] = useState("");
  const [loanRate, setLoanRate] = useState("");
  const [loanYears, setLoanYears] = useState("");
  const [loanResult, setLoanResult] = useState(null);

  const calculateLoan = () => {
    const P = parseFloat(loanAmount), r = parseFloat(loanRate) / 100 / 12, n = parseFloat(loanYears) * 12;
    if (!P || !r || !n) return;
    const monthly = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    setLoanResult({ monthly: monthly.toFixed(2), total: (monthly * n).toFixed(2), interest: (monthly * n - P).toFixed(2) });
  };

  // ── 16. Text Converter ────────────────────────────────────────────────────
  const [textInput, setTextInput] = useState("");
  const [copiedCase, setCopiedCase] = useState("");

  const convertText = (type) => {
    switch (type) {
      case "upper": return textInput.toUpperCase();
      case "lower": return textInput.toLowerCase();
      case "title": return textInput.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
      case "sentence": return textInput.charAt(0).toUpperCase() + textInput.slice(1).toLowerCase();
      case "camel": return textInput.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase());
      case "snake": return textInput.toLowerCase().replace(/\s+/g, "_");
      case "kebab": return textInput.toLowerCase().replace(/\s+/g, "-");
      case "reverse": return textInput.split("").reverse().join("");
      default: return textInput;
    }
  };
  const copyConverted = (type) => {
    navigator.clipboard.writeText(convertText(type));
    setCopiedCase(type);
    setTimeout(() => setCopiedCase(""), 2000);
  };

  // ─── Card wrapper ─────────────────────────────────────────────────────────
  const Card = ({ children, className = "" }) => (
    <div className={`glass-card rounded-2xl overflow-hidden flex flex-col shadow-sm border border-slate-200 dark:border-slate-800 ${className}`}>
      {children}
    </div>
  );
  const CardHeader = ({ icon: Icon, title, color, extra }) => (
    <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
      <h3 className="font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
        <span className={`p-1.5 rounded-lg ${colorMap[color]}`}><Icon size={16} /></span>
        {title}
      </h3>
      {extra}
    </div>
  );

  // ─── Render selected tool ─────────────────────────────────────────────────
  const renderTool = () => {
    switch (selectedTool) {

      // ── 1. GPA Calculator ────────────────────────────────────────────────
      case "gpa": return (
        <Card>
          <CardHeader icon={Calculator} title="GPA Calculator" color="blue"
            extra={gpa && (() => { const s = getGpaStatus(gpa); return <span className={`px-3 py-1 rounded-lg font-bold text-sm ${s.color}`}>GPA {gpa} — {s.label}</span>; })()}
          />
          <div className="p-5 space-y-3">
            <div className="grid grid-cols-12 gap-2 text-xs font-bold text-slate-500 uppercase px-1">
              <span className="col-span-5">Course</span>
              <span className="col-span-2 text-center">Credits</span>
              <span className="col-span-2 text-center">Score</span>
              <span className="col-span-2 text-center">Grade</span>
              <span className="col-span-1" />
            </div>
            {courses.map((c, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center bg-slate-50 dark:bg-slate-800/50 p-2 rounded-xl">
                <input value={c.name} onChange={(e) => { const nc = [...courses]; nc[i].name = e.target.value; setCourses(nc); }} placeholder="Course name" className="col-span-5 px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20" />
                <select value={c.credits} onChange={(e) => { const nc = [...courses]; nc[i].credits = e.target.value; setCourses(nc); }} className="col-span-2 px-2 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none text-center">
                  {[1,2,3,4,5].map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
                <input type="number" value={c.score} onChange={(e) => { const nc = [...courses]; nc[i].score = e.target.value; setCourses(nc); }} placeholder="0-100" className="col-span-2 px-2 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none text-center focus:ring-2 focus:ring-blue-500/20" />
                <span className={`col-span-2 text-center text-sm font-bold ${parseFloat(c.score) >= 60 ? "text-emerald-600" : "text-red-500"}`}>{getLetterGrade(c.score)}</span>
                <button onClick={() => setCourses(courses.filter((_, idx) => idx !== i))} className="col-span-1 flex justify-center p-1 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
              </div>
            ))}
            <div className="flex gap-2 pt-1">
              <button onClick={() => setCourses([...courses, { name: "", credits: 3, score: "" }])} className="flex-1 py-2.5 border border-dashed border-slate-300 dark:border-slate-600 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm text-slate-600 dark:text-slate-300 transition-colors">
                <Plus size={15} /> Add Course
              </button>
              <button onClick={calculateGpa} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-md shadow-blue-500/20">
                Calculate GPA
              </button>
            </div>
          </div>
        </Card>
      );

      // ── 2. Pomodoro Timer ────────────────────────────────────────────────
      case "timer": return (
        <Card>
          <CardHeader icon={Timer} title="Pomodoro Timer" color="emerald"
            extra={
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Sessions: <b className="text-emerald-600">{pomodoroCount}</b></span>
                <div className="flex gap-1 bg-slate-200/50 dark:bg-slate-800 p-1 rounded-lg">
                  {["Work", "Break"].map((m) => (
                    <button key={m} onClick={() => { setTimerMode(m); setIsActive(false); setTimeLeft((m === "Work" ? workDuration : breakDuration) * 60); }}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${timerMode === m ? "bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm" : "text-slate-500"}`}>{m}</button>
                  ))}
                </div>
              </div>
            }
          />
          <div className="p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="flex md:flex-col gap-4 md:w-36">
              {[["Work (min)", workDuration, setWorkDuration], ["Break (min)", breakDuration, setBreakDuration]].map(([label, val, setter]) => (
                <div key={label} className="flex-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{label}</label>
                  <input type="number" min="1" value={val} onChange={(e) => setter(parseInt(e.target.value) || 1)} className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center" />
                </div>
              ))}
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className={`w-48 h-48 rounded-full flex items-center justify-center border-[8px] transition-colors duration-500 ${isActive ? timerMode === "Work" ? "border-emerald-500" : "border-blue-500" : "border-slate-100 dark:border-slate-700"}`}>
                <div className="text-center">
                  <div className="text-5xl font-black tracking-tighter text-slate-800 dark:text-white">{formatTime(timeLeft)}</div>
                  <div className={`text-xs font-bold mt-1 uppercase tracking-wider ${timerMode === "Work" ? "text-emerald-600" : "text-blue-500"}`}>{timerMode}</div>
                </div>
              </div>
            </div>
            <div className="flex md:flex-col gap-3 md:w-36 items-center">
              <button onClick={() => setIsActive(!isActive)} className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-all hover:scale-105 active:scale-95 ${isActive ? "bg-amber-500 shadow-amber-500/30" : "bg-emerald-600 shadow-emerald-600/30"}`}>
                {isActive ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
              </button>
              <button onClick={resetTimer} className="w-14 h-14 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <RefreshCw size={20} />
              </button>
            </div>
          </div>
        </Card>
      );

      // ── 3. Citation Generator ────────────────────────────────────────────
      case "citation": return (
        <Card>
          <CardHeader icon={BookOpen} title="Citation Generator" color="amber" />
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              {[["Author(s)", "author", "e.g. Smith, J. D."], ["Year", "year", "2024"], ["Title", "title", "Principles of Design"], ["Publisher / Journal", "publisher", "Academic Press"]].map(([label, field, ph]) => (
                <div key={field}>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{label}</label>
                  <input placeholder={ph} value={citation[field]} onChange={(e) => setCitation({ ...citation, [field]: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-amber-500/20" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Style</label>
                <div className="flex gap-2 flex-wrap">
                  {citationStyles.map((s) => (
                    <button key={s} onClick={() => setSelectedStyle(s)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedStyle === s ? "bg-amber-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-50"}`}>{s}</button>
                  ))}
                </div>
              </div>
              <button onClick={generateCitation} className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-colors shadow-md shadow-amber-500/20">Generate Citation</button>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-amber-50/50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-5 flex-1">
                <h4 className="text-xs font-bold text-amber-700 dark:text-amber-500 uppercase mb-3">Generated</h4>
                <p className="text-sm font-serif italic text-slate-800 dark:text-slate-300 min-h-[60px]">{generatedCitation || "Your citation will appear here."}</p>
                <button disabled={!generatedCitation} onClick={copyCitation} className="mt-4 w-full flex items-center justify-center gap-2 py-2 bg-white dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-amber-700 dark:text-slate-300 rounded-xl text-sm hover:bg-amber-50 transition-colors disabled:opacity-40">
                  {copied ? <CheckCircle2 size={15} className="text-emerald-500" /> : <Copy size={15} />}
                  {copied ? "Copied!" : "Copy to Clipboard"}
                </button>
              </div>
              {citationHistory.length > 0 && (
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Recent ({citationHistory.length})</h4>
                  {citationHistory.map((h, i) => (
                    <p key={i} className="text-xs text-slate-600 dark:text-slate-400 truncate py-1 border-b border-slate-100 dark:border-slate-700 last:border-0">
                      <span className="font-bold text-amber-600 mr-1">{h.style}</span>{h.text}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      );

      // ── 4. Word Counter ──────────────────────────────────────────────────
      case "words": return (
        <Card>
          <CardHeader icon={PenTool} title="Word Counter & Analyzer" color="purple" />
          <div className="p-5 space-y-4">
            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste or type your text here..." className="w-full h-40 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none transition-all" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[["Words", wordCount, "purple"], ["Characters", charCount, "blue"], ["Sentences", sentenceCount, "emerald"], ["Paragraphs", paraCount, "amber"]].map(([label, val, c]) => (
                <div key={label} className={`rounded-xl p-3 text-center ${colorMap[c]} bg-opacity-10`}>
                  <div className="text-2xl font-black">{val}</div>
                  <div className="text-xs font-bold uppercase mt-1 opacity-70">{label}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              {[["📖 Reading Time", `${readingTime} min`], ["🎤 Speaking Time", `${speakingTime} min`], ["📏 Avg Word Length", `${avgWordLen} chars`], ["🏆 Longest Word", longestWord || "—"], ["🧠 Readability", `${readabilityScore}/100`]].map(([label, val]) => (
                <div key={label} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3">
                  <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
                  <div className="font-bold text-slate-800 dark:text-white mt-0.5">{val}</div>
                </div>
              ))}
            </div>
            <button onClick={downloadWordReport} className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-md shadow-purple-500/20">
              <Download size={15} /> Download Report
            </button>
          </div>
        </Card>
      );

      // ── 5. To-Do List ────────────────────────────────────────────────────
      case "todo": return (
        <Card>
          <CardHeader icon={List} title="To‑Do List" color="indigo"
            extra={
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">{donePct}% done</span>
                <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${donePct}%` }} />
                </div>
              </div>
            }
          />
          <div className="p-5 space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
              <input value={newTodo} onChange={(e) => setNewTodo(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTodo()} placeholder="New task..." className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20" />
              <div className="flex gap-2">
                <select value={newTodoPriority} onChange={(e) => setNewTodoPriority(e.target.value)} className="flex-1 px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none">
                  <option value="high">🔴 High</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="low">🟢 Low</option>
                </select>
                <input type="date" value={newTodoDue} onChange={(e) => setNewTodoDue(e.target.value)} className="flex-1 px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none" />
                <button onClick={addTodo} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors"><Plus size={16} /></button>
              </div>
            </div>
            <div className="flex gap-1">
              {["all", "active", "done"].map((f) => (
                <button key={f} onClick={() => setTodoFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${todoFilter === f ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-indigo-50"}`}>{f}</button>
              ))}
            </div>
            <ul className="space-y-2 max-h-72 overflow-y-auto">
              {filteredTodos.length === 0 && <p className="text-center text-slate-400 text-sm py-4">No tasks here.</p>}
              {filteredTodos.map((t) => (
                <li key={t.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${priorityBg[t.priority]}`}>
                  <button onClick={() => toggleTodo(t.id)} className="shrink-0">
                    {t.done ? <CheckSquare size={18} className="text-indigo-600" /> : <Square size={18} className="text-slate-400" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${t.done ? "line-through text-slate-400" : "text-slate-800 dark:text-slate-200"}`}>{t.text}</p>
                    {t.due && <p className="text-xs text-slate-400 mt-0.5">Due: {t.due}</p>}
                  </div>
                  <Flag size={14} className={`shrink-0 ${priorityColor[t.priority]}`} />
                  <button onClick={() => removeTodo(t.id)} className="shrink-0 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      );

      // ── 6. Random Quote ──────────────────────────────────────────────────
      case "quote": return (
        <Card>
          <CardHeader icon={MessageSquare} title="Random Quote" color="green" />
          <div className="p-8 flex flex-col items-center text-center gap-6">
            <div className="flex gap-2">
              {["all", "motivation", "education", "success"].map((c) => (
                <button key={c} onClick={() => setQuoteCategory(c)} className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${quoteCategory === c ? "bg-green-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-green-50"}`}>{c}</button>
              ))}
            </div>
            <div className="max-w-xl bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-2xl p-8">
              <div className="text-4xl text-green-300 mb-4">"</div>
              <blockquote className="text-lg font-medium text-slate-800 dark:text-slate-200 leading-relaxed italic">
                {currentQuote.text}
              </blockquote>
              <p className="text-sm text-green-600 dark:text-green-400 font-bold mt-4">— {currentQuote.author}</p>
              <span className="inline-block mt-2 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full capitalize">{currentQuote.category}</span>
            </div>
            <div className="flex gap-3">
              <button onClick={generateQuote} className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-md shadow-green-500/20">New Quote</button>
              <button onClick={() => toggleFavorite(currentQuote)} className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all border ${isFavorite(currentQuote) ? "bg-amber-50 border-amber-300 text-amber-600" : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"}`}>
                {isFavorite(currentQuote) ? <Star size={16} className="fill-amber-400 text-amber-400" /> : <StarOff size={16} />}
              </button>
              <button onClick={() => { navigator.clipboard.writeText(`"${currentQuote.text}" — ${currentQuote.author}`); }} className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-sm hover:bg-slate-200 transition-colors"><Copy size={16} /></button>
            </div>
            {favoriteQuotes.length > 0 && (
              <div className="w-full text-left">
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">⭐ Favorites ({favoriteQuotes.length})</h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {favoriteQuotes.map((q, i) => <p key={i} className="text-xs text-slate-600 dark:text-slate-400 italic truncate">"{q.text}"</p>)}
                </div>
              </div>
            )}
          </div>
        </Card>
      );

      // ── 7. Assignment Tracker ────────────────────────────────────────────
      case "assignment": return (
        <Card>
          <CardHeader icon={Calendar} title="Assignment Tracker" color="rose" />
          <div className="p-5 space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input value={newAssignment.title} onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })} placeholder="Assignment title" className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-rose-500/20" />
              <input value={newAssignment.subject} onChange={(e) => setNewAssignment({ ...newAssignment, subject: e.target.value })} placeholder="Subject" className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none" />
              <input type="date" value={newAssignment.due} onChange={(e) => setNewAssignment({ ...newAssignment, due: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none" />
              <button onClick={addAssignment} className="py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-semibold transition-colors">Add Assignment</button>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {assignments.length === 0 && <p className="text-center text-slate-400 text-sm py-6">No assignments yet.</p>}
              {assignments.sort((a, b) => new Date(a.due) - new Date(b.due)).map((a) => {
                const days = getDaysLeft(a.due);
                return (
                  <div key={a.id} className={`flex items-center gap-3 p-3 rounded-xl border ${assignmentStatusColor(a)}`}>
                    <button onClick={() => setAssignments(assignments.map((x) => x.id === a.id ? { ...x, status: x.status === "done" ? "pending" : "done" } : x))}>
                      {a.status === "done" ? <CheckSquare size={18} className="text-green-600" /> : <Square size={18} className="text-slate-400" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${a.status === "done" ? "line-through text-slate-400" : "text-slate-800 dark:text-slate-200"}`}>{a.title}</p>
                      {a.subject && <p className="text-xs text-slate-500">{a.subject}</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-xs font-bold ${days < 0 ? "text-red-500" : days <= 2 ? "text-amber-500" : "text-slate-500"}`}>
                        {a.status === "done" ? "✓ Done" : days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? "Due today!" : `${days}d left`}
                      </p>
                      <p className="text-xs text-slate-400">{a.due}</p>
                    </div>
                    <button onClick={() => setAssignments(assignments.filter((x) => x.id !== a.id))} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      );

      // ── 8. Attendance Calculator ─────────────────────────────────────────
      case "attendance": return (
        <Card>
          <CardHeader icon={BarChart2} title="Attendance Calculator" color="cyan" />
          <div className="p-5 space-y-4">
            {attendanceSubjects.map((s, i) => {
              const pct = getAttendancePct(s.total, s.attended);
              return (
                <div key={i} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
                  <div className="flex gap-2">
                    <input value={s.subject} onChange={(e) => { const ns = [...attendanceSubjects]; ns[i].subject = e.target.value; setAttendanceSubjects(ns); }} placeholder="Subject name" className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-cyan-500/20" />
                    <button onClick={() => setAttendanceSubjects(attendanceSubjects.filter((_, idx) => idx !== i))} className="text-slate-400 hover:text-red-500 transition-colors p-2"><Trash2 size={15} /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Total Classes</label>
                      <input type="number" value={s.total} onChange={(e) => { const ns = [...attendanceSubjects]; ns[i].total = e.target.value; setAttendanceSubjects(ns); }} placeholder="e.g. 40" className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none" />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Attended</label>
                      <input type="number" value={s.attended} onChange={(e) => { const ns = [...attendanceSubjects]; ns[i].attended = e.target.value; setAttendanceSubjects(ns); }} placeholder="e.g. 32" className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none" />
                    </div>
                  </div>
                  {pct !== null && (
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-bold">{pct}% Attendance</span>
                        {pct < 75 && <span className="text-red-500 font-bold flex items-center gap-1"><AlertTriangle size={12} /> Below 75% — At Risk</span>}
                        {pct >= 75 && <span className="text-emerald-600 font-bold">✓ Good Standing</span>}
                      </div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${pct >= 75 ? "bg-emerald-500" : "bg-red-500"}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <button onClick={() => setAttendanceSubjects([...attendanceSubjects, { subject: "", total: "", attended: "" }])} className="w-full py-2.5 border border-dashed border-slate-300 dark:border-slate-600 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm text-slate-600 dark:text-slate-300 transition-colors">
              <Plus size={15} /> Add Subject
            </button>
          </div>
        </Card>
      );

      // ── 9. Unit Converter ────────────────────────────────────────────────
      case "converter": return (
        <Card>
          <CardHeader icon={ArrowLeftRight} title="Unit Converter" color="orange" />
          <div className="p-6 space-y-5">
            <div className="flex gap-2 flex-wrap">
              {Object.keys(converterCategories).map((c) => (
                <button key={c} onClick={() => { setConverterCat(c); setFromUnit(converterCategories[c].units[0]); setToUnit(converterCategories[c].units[1]); setConverterValue(""); }}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${converterCat === c ? "bg-orange-600 text-white shadow-md shadow-orange-500/20" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-orange-50"}`}>{c}</button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">From</label>
                <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none">
                  {converterCategories[converterCat].units.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div className="flex justify-center items-center pb-1">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-full text-orange-600"><ArrowLeftRight size={18} /></div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">To</label>
                <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none">
                  {converterCategories[converterCat].units.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Value</label>
              <input type="number" value={converterValue} onChange={(e) => setConverterValue(e.target.value)} placeholder="Enter value..." className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-lg outline-none focus:ring-2 focus:ring-orange-500/20" />
            </div>
            {converterValue && (
              <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-2xl p-5 text-center">
                <p className="text-sm text-slate-500 mb-1">{converterValue} {fromUnit} =</p>
                <p className="text-3xl font-black text-orange-600">{convertValue()}</p>
                <p className="text-sm text-slate-500 mt-1">{toUnit}</p>
              </div>
            )}
          </div>
        </Card>
      );

      // ── 10. Flashcard Maker ──────────────────────────────────────────────
      case "flashcard": return (
        <Card>
          <CardHeader icon={Layers} title="Flashcard Maker" color="violet"
            extra={<span className="text-xs text-slate-500">{flashcards.length} cards</span>}
          />
          <div className="p-5 space-y-5">
            {flashcards.length > 0 && (
              <div className="flex flex-col items-center gap-4">
                <div className="w-full max-w-lg cursor-pointer" onClick={() => setFlipped(!flipped)}>
                  <div className={`relative h-44 transition-all duration-500 ${flipped ? "[transform:rotateY(180deg)]" : ""}`} style={{ transformStyle: "preserve-3d" }}>
                    <div className="absolute inset-0 bg-violet-50 dark:bg-violet-900/20 border-2 border-violet-200 dark:border-violet-800 rounded-2xl flex items-center justify-center p-6 text-center" style={{ backfaceVisibility: "hidden" }}>
                      <div>
                        <p className="text-xs font-bold text-violet-500 uppercase mb-2">Question</p>
                        <p className="text-lg font-semibold text-slate-800 dark:text-white">{flashcards[cardIndex]?.q}</p>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-200 dark:border-indigo-800 rounded-2xl flex items-center justify-center p-6 text-center [transform:rotateY(180deg)]" style={{ backfaceVisibility: "hidden" }}>
                      <div>
                        <p className="text-xs font-bold text-indigo-500 uppercase mb-2">Answer</p>
                        <p className="text-lg font-semibold text-slate-800 dark:text-white">{flashcards[cardIndex]?.a}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-400">Click card to flip</p>
                <div className="flex items-center gap-4">
                  <button onClick={() => { setCardIndex((i) => (i - 1 + flashcards.length) % flashcards.length); setFlipped(false); }} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-violet-100 transition-colors"><ChevronLeft size={18} /></button>
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{cardIndex + 1} / {flashcards.length}</span>
                  <button onClick={() => { setCardIndex((i) => (i + 1) % flashcards.length); setFlipped(false); }} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-violet-100 transition-colors"><ChevronRight size={18} /></button>
                  <button onClick={() => { shuffleCards(); setCardIndex(0); setFlipped(false); }} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-violet-100 transition-colors"><Shuffle size={18} /></button>
                </div>
              </div>
            )}
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase">Add New Card</h4>
              <input value={newCard.q} onChange={(e) => setNewCard({ ...newCard, q: e.target.value })} placeholder="Question" className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-violet-500/20" />
              <input value={newCard.a} onChange={(e) => setNewCard({ ...newCard, a: e.target.value })} placeholder="Answer" className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none" />
              <button onClick={addCard} className="w-full py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition-colors">Add Card</button>
            </div>
          </div>
        </Card>
      );

      // ── 11. Study Planner ────────────────────────────────────────────────
      case "planner": return (
        <Card>
          <CardHeader icon={Brain} title="Study Planner" color="pink"
            extra={<span className="text-xs text-slate-500">Total: {studySubjects.reduce((a, s) => a + parseFloat(s.logged || 0), 0).toFixed(1)}h logged</span>}
          />
          <div className="p-5 space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input value={newStudySubject.name} onChange={(e) => setNewStudySubject({ ...newStudySubject, name: e.target.value })} placeholder="Subject" className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-pink-500/20" />
              <input type="number" value={newStudySubject.target} onChange={(e) => setNewStudySubject({ ...newStudySubject, target: e.target.value })} placeholder="Target hours" className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none" />
              <button onClick={addStudySubject} className="py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-sm font-semibold transition-colors">Add Subject</button>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {studySubjects.length === 0 && <p className="text-center text-slate-400 text-sm py-6">No subjects added yet.</p>}
              {studySubjects.map((s) => {
                const pct = Math.min(100, Math.round((s.logged / s.target) * 100));
                return (
                  <div key={s.id} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-800 dark:text-white">{s.name}</span>
                      <span className="text-xs text-slate-500">{s.logged}h / {s.target}h</span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${pct >= 100 ? "bg-emerald-500" : "bg-pink-500"}`} style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex gap-2 items-center">
                      <input type="number" placeholder="Log hours" className="flex-1 px-2 py-1 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none" id={`log-${s.id}`} />
                      <button onClick={() => { const el = document.getElementById(`log-${s.id}`); logHours(s.id, el.value); el.value = ""; }} className="px-3 py-1 bg-pink-600 text-white rounded-lg text-xs font-semibold hover:bg-pink-700 transition-colors">Log</button>
                      <button onClick={() => setStudySubjects(studySubjects.filter((x) => x.id !== s.id))} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      );

      // ── 12. Exam Countdown ───────────────────────────────────────────────
      case "exam": return (
        <Card>
          <CardHeader icon={Clock} title="Exam Countdown" color="red" />
          <div className="p-5 space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input value={newExam.name} onChange={(e) => setNewExam({ ...newExam, name: e.target.value })} placeholder="Exam name" className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-red-500/20" />
              <input value={newExam.subject} onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })} placeholder="Subject" className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none" />
              <input type="date" value={newExam.date} onChange={(e) => setNewExam({ ...newExam, date: e.target.value })} className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none" />
            </div>
            <button onClick={addExam} className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors">Add Exam</button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
              {exams.length === 0 && <p className="text-center text-slate-400 text-sm py-6 col-span-2">No exams added yet.</p>}
              {exams.sort((a, b) => new Date(a.date) - new Date(b.date)).map((e) => {
                const { days } = getExamCountdown(e.date);
                return (
                  <div key={e.id} className={`rounded-xl p-4 border relative ${days < 0 ? "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-60" : days <= 3 ? "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800" : days <= 7 ? "bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800" : "bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800"}`}>
                    <button onClick={() => setExams(exams.filter((x) => x.id !== e.id))} className="absolute top-2 right-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
                    <p className="font-bold text-slate-800 dark:text-white text-sm">{e.name}</p>
                    {e.subject && <p className="text-xs text-slate-500 mb-2">{e.subject}</p>}
                    <p className={`text-2xl font-black ${days < 0 ? "text-slate-400" : days <= 3 ? "text-red-600" : days <= 7 ? "text-amber-600" : "text-blue-600"}`}>
                      {days < 0 ? "Done" : days === 0 ? "Today!" : `${days}d`}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{e.date}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      );

      // ── 13. Goal Tracker ─────────────────────────────────────────────────
      case "goal": return (
        <Card>
          <CardHeader icon={Target} title="Goal Tracker" color="teal" />
          <div className="p-5 space-y-4">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
              <input value={newGoal.title} onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })} placeholder="Goal title (e.g. Achieve 3.8 GPA)" className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-teal-500/20" />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" value={newGoal.target} onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })} placeholder="Target value" className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none" />
                <input type="number" value={newGoal.current} onChange={(e) => setNewGoal({ ...newGoal, current: e.target.value })} placeholder="Current value" className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none" />
              </div>
              <button onClick={addGoal} className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition-colors">Add Goal</button>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {goals.length === 0 && <p className="text-center text-slate-400 text-sm py-6">No goals set yet.</p>}
              {goals.map((g) => {
                const pct = Math.min(100, Math.round((g.current / g.target) * 100));
                return (
                  <div key={g.id} className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-800 dark:text-white text-sm">{g.title}</span>
                      <span className="text-xs font-bold text-teal-600">{pct}%</span>
                    </div>
                    <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${pct >= 100 ? "bg-emerald-500" : "bg-teal-500"}`} style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex gap-2 items-center">
                      <input type="number" defaultValue={g.current} onChange={(e) => updateGoalProgress(g.id, e.target.value)} className="flex-1 px-2 py-1 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none" />
                      <span className="text-xs text-slate-400">/ {g.target}</span>
                      <button onClick={() => setGoals(goals.filter((x) => x.id !== g.id))} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      );

      // ── 14. Note Pad ─────────────────────────────────────────────────────
      case "notepad": return (
        <Card>
          <CardHeader icon={FileText} title="Note Pad" color="slate"
            extra={<button onClick={addNote} className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity"><Plus size={13} /> New Note</button>}
          />
          <div className="flex h-[420px]">
            <div className="w-44 shrink-0 border-r border-slate-200 dark:border-slate-700 overflow-y-auto p-2 space-y-1">
              {notes.map((n) => (
                <div key={n.id} onClick={() => setActiveNoteId(n.id)} className={`p-3 rounded-xl cursor-pointer transition-all group relative ${activeNoteId === n.id ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900" : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"}`}>
                  <p className="text-xs font-semibold truncate">{n.title}</p>
                  <p className="text-[10px] opacity-50 mt-0.5">{n.createdAt}</p>
                  {notes.length > 1 && (
                    <button onClick={(e) => { e.stopPropagation(); deleteNote(n.id); }} className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all"><Trash2 size={11} /></button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex-1 flex flex-col p-4 gap-3">
              <input value={activeNote?.title || ""} onChange={(e) => updateNote(activeNoteId, "title", e.target.value)} className="text-lg font-bold text-slate-800 dark:text-white bg-transparent outline-none border-b border-slate-200 dark:border-slate-700 pb-2" />
              <textarea value={activeNote?.content || ""} onChange={(e) => updateNote(activeNoteId, "content", e.target.value)} placeholder="Start writing..." className="flex-1 text-sm text-slate-700 dark:text-slate-300 bg-transparent outline-none resize-none leading-relaxed" />
            </div>
          </div>
        </Card>
      );

      // ── 15. Loan Calculator ───────────────────────────────────────────────
      case "loan": return (
        <Card>
          <CardHeader icon={Hash} title="Loan / Scholarship Calculator" color="yellow" />
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {[["Loan Amount ($)", loanAmount, setLoanAmount, "e.g. 10000"], ["Annual Interest Rate (%)", loanRate, setLoanRate, "e.g. 5.5"], ["Loan Duration (years)", loanYears, setLoanYears, "e.g. 5"]].map(([label, val, setter, ph]) => (
                <div key={label}>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">{label}</label>
                  <input type="number" value={val} onChange={(e) => setter(e.target.value)} placeholder={ph} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-yellow-500/20" />
                </div>
              ))}
              <button onClick={calculateLoan} className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-xl transition-colors shadow-md shadow-yellow-500/20">Calculate</button>
            </div>
            <div className="flex flex-col justify-center gap-4">
              {loanResult ? (
                <>
                  {[["Monthly Payment", `$${loanResult.monthly}`, "yellow"], ["Total Payment", `$${loanResult.total}`, "orange"], ["Total Interest", `$${loanResult.interest}`, "red"]].map(([label, val, c]) => (
                    <div key={label} className={`rounded-2xl p-5 text-center ${colorMap[c]} bg-opacity-10`}>
                      <p className="text-xs font-bold uppercase opacity-70 mb-1">{label}</p>
                      <p className="text-3xl font-black">{val}</p>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center text-slate-400">
                  <Hash size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Enter loan details to calculate</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      );

      // ── 16. Text Converter ────────────────────────────────────────────────
      case "text": return (
        <Card>
          <CardHeader icon={BookMarkedIcon} title="Text Case Converter" color="fuchsia" />
          <div className="p-5 space-y-4">
            <textarea value={textInput} onChange={(e) => setTextInput(e.target.value)} placeholder="Type or paste your text here..." className="w-full h-28 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 resize-none" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[["UPPERCASE", "upper"], ["lowercase", "lower"], ["Title Case", "title"], ["Sentence case", "sentence"], ["camelCase", "camel"], ["snake_case", "snake"], ["kebab-case", "kebab"], ["esreveR", "reverse"]].map(([label, type]) => (
                <button key={type} onClick={() => copyConverted(type)} disabled={!textInput}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${copiedCase === type ? "bg-emerald-50 border-emerald-300 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-700" : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-fuchsia-50 hover:border-fuchsia-300 hover:text-fuchsia-700"} disabled:opacity-40`}>
                  {copiedCase === type ? "✓ Copied!" : label}
                </button>
              ))}
            </div>
            {textInput && (
              <div className="bg-fuchsia-50 dark:bg-fuchsia-900/10 border border-fuchsia-200 dark:border-fuchsia-800 rounded-xl p-4">
                <p className="text-xs font-bold text-fuchsia-600 uppercase mb-2">Preview (hover a button to copy)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-slate-600 dark:text-slate-400">
                  {[["UPPER", "upper"], ["lower", "lower"], ["Title", "title"], ["Sentence", "sentence"]].map(([label, type]) => (
                    <div key={type}><span className="font-bold text-fuchsia-500">{label}:</span> {convertText(type).slice(0, 40)}{convertText(type).length > 40 ? "..." : ""}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      );

      default: return null;
    }
  };

  return (
    <div className="text-slate-900 dark:text-slate-200 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200 dark:shadow-none">
            <BookMarked size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Student Toolkit</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-sm">16 tools to support your academic journey</p>
          </div>
        </div>
        <span className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-sm font-bold">
          <BookMarked size={16} /> {toolOptions.find((t) => t.key === selectedTool)?.label}
        </span>
      </div>

      {/* Tool Grid Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {toolOptions.map(({ key, label, icon: Icon, color }) => (
          <button key={key} onClick={() => setSelectedTool(key)}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs font-semibold transition-all border ${selectedTool === key ? `${colorMap[color]} border-current shadow-sm` : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"}`}>
            <Icon size={18} />
            <span className="text-center leading-tight">{label}</span>
          </button>
        ))}
      </div>

      {/* Active Tool */}
      <div>{renderTool()}</div>
    </div>
  );
}