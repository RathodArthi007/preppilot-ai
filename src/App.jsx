
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import DSATracker from "./pages/DSATracker";
import StudyPlanner from "./pages/StudyPlanner";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import MockInterview from "./MockInterview";

import {
  checkBackend,
  getProblems,
  addProblem as saveProblem,
  updateProblem,
  getTasks,
  saveTask,
  updateTask,
  getMistakes,
  saveMistake,
  updateMistake,
  getInterviews
} from "./api";

function loadData(key, defaultValue) {
  try {
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : defaultValue;
  } catch {
    return defaultValue;
  }
}

const starterProblems = [
  { name: "Two Sum", topic: "Array", difficulty: "Easy", solved: true },
  { name: "Best Time to Buy and Sell Stock", topic: "Array", difficulty: "Easy", solved: false },
  { name: "Maximum Subarray", topic: "Array", difficulty: "Medium", solved: false },
  { name: "Reverse Linked List", topic: "Linked List", difficulty: "Easy", solved: false }
];

const starterTasks = [
  { name: "Practice Two Sum", subject: "DSA", date: "", priority: "High", completed: false },
  { name: "Revise Processes", subject: "OS", date: "", priority: "Medium", completed: false },
  { name: "Study DBMS Joins", subject: "DBMS", date: "", priority: "Medium", completed: false }
];

const starterMistakes = [
  {
    problem: "Two Sum",
    type: "Logic Error",
    wrong: "Did not understand how to find the complement.",
    correct: "Calculate target - current element.",
    revised: false
  }
];

function getDateKey() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function App() {
  const [page, setPage] = useState("Dashboard");
  const [theme, setTheme] = useState(() => loadData("theme", "dark"));
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [dataLoaded, setDataLoaded] = useState(false);

  const [problems, setProblems] = useState(() => loadData("problems", starterProblems));
  const [tasks, setTasks] = useState(() => loadData("tasks", starterTasks));
  const [mistakes, setMistakes] = useState(() => loadData("mistakes", starterMistakes));
  const [interviews, setInterviews] = useState([]);
  const [activity, setActivity] = useState(() => loadData("activity", []));

  const [problemName, setProblemName] = useState("");
  const [problemTopic, setProblemTopic] = useState("Array");
  const [problemDifficulty, setProblemDifficulty] = useState("Easy");
  const [problemFilter, setProblemFilter] = useState("All");

  const [taskName, setTaskName] = useState("");
  const [taskSubject, setTaskSubject] = useState("DSA");
  const [taskDate, setTaskDate] = useState("");
  const [taskPriority, setTaskPriority] = useState("Medium");
  const [taskFilter, setTaskFilter] = useState("All");

  const [mistakeProblem, setMistakeProblem] = useState("");
  const [mistakeType, setMistakeType] = useState("Logic Error");
  const [mistakeWrong, setMistakeWrong] = useState("");
  const [mistakeCorrect, setMistakeCorrect] = useState("");
  const [mistakeFilter, setMistakeFilter] = useState("All");

  useEffect(() => {
    let active = true;

    async function loadDatabase() {
      try {
        const status = await checkBackend();

        if (!status.success) {
          throw new Error("Backend unavailable");
        }

        const [
          dbProblems,
          dbTasks,
          dbMistakes,
          dbInterviews
        ] = await Promise.all([
          getProblems(),
          getTasks(),
          getMistakes(),
          getInterviews()
        ]);

        if (!active) return;

        setInterviews(dbInterviews.interviews || []);

        if (dbProblems.length > 0) {
          setProblems(dbProblems.map(p => ({
            ...p,
            name: p.title
          })));
        } else {
          const saved = await Promise.all(
            starterProblems.map(p => saveProblem(p))
          );

          if (!active) return;

          setProblems(saved.map(p => ({
            ...p,
            name: p.title
          })));
        }

        if (dbTasks.length > 0) {
          setTasks(dbTasks);
        } else {
          const saved = await Promise.all(
            starterTasks.map(t => saveTask(t))
          );

          if (!active) return;
          setTasks(saved);
        }

        if (dbMistakes.length > 0) {
          setMistakes(dbMistakes);
        } else {
          const saved = await Promise.all(
            starterMistakes.map(m => saveMistake(m))
          );

          if (!active) return;
          setMistakes(saved);
        }

        setBackendStatus("MongoDB Connected");
      } catch (error) {
        console.error("Database loading error:", error);

        if (active) {
          setBackendStatus("Database connection failed");
        }
      } finally {
        if (active) setDataLoaded(true);
      }
    }

    loadDatabase();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(theme));
    document.body.classList.toggle("light-mode", theme === "light");

    return () => {
      document.body.classList.remove("light-mode");
    };
  }, [theme]);

  useEffect(() => {
    if (dataLoaded) {
      localStorage.setItem("problems", JSON.stringify(problems));
    }
  }, [problems, dataLoaded]);

  useEffect(() => {
    if (dataLoaded) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks, dataLoaded]);

  useEffect(() => {
    if (dataLoaded) {
      localStorage.setItem("mistakes", JSON.stringify(mistakes));
    }
  }, [mistakes, dataLoaded]);

  useEffect(() => {
    localStorage.setItem("activity", JSON.stringify(activity));
  }, [activity]);

  function recordActivity(message, type) {
    const newActivity = {
      id: Date.now(),
      message,
      type,
      date: getDateKey()
    };

    setActivity(prev => [newActivity, ...prev].slice(0, 100));
  }

  const solvedCount = problems.filter(p => p.solved).length;
  const completedTasks = tasks.filter(t => t.completed).length;

  async function addProblem(e) {
    e.preventDefault();

    if (!problemName.trim()) return;

    try {
      const saved = await saveProblem({
        name: problemName.trim(),
        topic: problemTopic,
        difficulty: problemDifficulty,
        solved: false
      });

      setProblems(prev => [...prev, {
        ...saved,
        name: saved.title
      }]);

      recordActivity(`Added DSA problem: ${problemName.trim()}`, "dsa");
      setProblemName("");
      setBackendStatus("MongoDB Connected");
    } catch (error) {
      console.error(error);
      alert("Could not save DSA problem");
    }
  }

  async function toggleProblem(index) {
    const problem = problems[index];
    if (!problem) return;

    const newStatus = !problem.solved;

    try {
      if (!problem._id) {
        throw new Error("Problem ID missing");
      }

      await updateProblem(problem._id, {
        solved: newStatus
      });

      setProblems(prev =>
        prev.map((p, i) =>
          i === index ? { ...p, solved: newStatus } : p
        )
      );

      recordActivity(
        `${newStatus ? "Solved" : "Reopened"} DSA problem: ${problem.name}`,
        "dsa"
      );
    } catch (error) {
      console.error(error);
      alert("Could not update DSA problem");
    }
  }

  const filteredProblems = problems.filter(p => {
    if (problemFilter === "All") return true;
    if (problemFilter === "Solved") return p.solved;
    if (problemFilter === "Pending") return !p.solved;
    return p.difficulty === problemFilter;
  });

  async function addTask(e) {
    e.preventDefault();

    if (!taskName.trim()) return;

    try {
      const saved = await saveTask({
        name: taskName.trim(),
        subject: taskSubject,
        date: taskDate,
        priority: taskPriority,
        completed: false
      });

      setTasks(prev => [...prev, saved]);

      recordActivity(`Added study task: ${saved.name}`, "task");
      setTaskName("");
    } catch (error) {
      console.error(error);
      alert("Could not save study task");
    }
  }

  async function toggleTask(index) {
    const task = tasks[index];
    if (!task?._id) return;

    const newStatus = !task.completed;

    try {
      const updated = await updateTask(task._id, {
        completed: newStatus
      });

      setTasks(prev =>
        prev.map((t, i) => i === index ? updated : t)
      );

      recordActivity(
        `${newStatus ? "Completed" : "Reopened"} study task: ${task.name}`,
        "task"
      );
    } catch (error) {
      console.error(error);
      alert("Could not update study task");
    }
  }

  const filteredTasks = tasks.filter(t => {
    if (taskFilter === "All") return true;
    if (taskFilter === "Completed") return t.completed;
    if (taskFilter === "Pending") return !t.completed;
    return t.subject === taskFilter;
  });

  async function addMistake(e) {
    e.preventDefault();

    if (
      !mistakeProblem.trim() ||
      !mistakeWrong.trim() ||
      !mistakeCorrect.trim()
    ) return;

    try {
      const saved = await saveMistake({
        problem: mistakeProblem.trim(),
        type: mistakeType,
        wrong: mistakeWrong.trim(),
        correct: mistakeCorrect.trim(),
        revised: false
      });

      setMistakes(prev => [...prev, saved]);

      recordActivity(`Recorded a mistake: ${saved.problem}`, "mistake");

      setMistakeProblem("");
      setMistakeWrong("");
      setMistakeCorrect("");
    } catch (error) {
      console.error(error);
      alert("Could not save mistake");
    }
  }

  async function toggleMistake(index) {
    const mistake = mistakes[index];
    if (!mistake?._id) return;

    const newStatus = !mistake.revised;

    try {
      const updated = await updateMistake(mistake._id, {
        revised: newStatus
      });

      setMistakes(prev =>
        prev.map((m, i) => i === index ? updated : m)
      );

      recordActivity(
        `${newStatus ? "Revised" : "Reopened"} mistake: ${mistake.problem}`,
        "mistake"
      );
    } catch (error) {
      console.error(error);
      alert("Could not update mistake");
    }
  }

  const filteredMistakes = mistakes.filter(m => {
    if (mistakeFilter === "All") return true;
    if (mistakeFilter === "Revised") return m.revised;
    if (mistakeFilter === "Pending") return !m.revised;
    return true;
  });

  const revisedMistakes = mistakes.filter(m => m.revised).length;
  const pendingMistakes = mistakes.length - revisedMistakes;

  const mistakeProgress = mistakes.length
    ? Math.round((revisedMistakes / mistakes.length) * 100)
    : 0;

  const mistakeTypes = [
    "Logic Error",
    "Syntax Error",
    "Wrong Approach",
    "Edge Case",
    "Time Complexity"
  ];

  const mistakeTypeStats = mistakeTypes.map(type => ({
    name: type,
    total: mistakes.filter(m => m.type === type).length,
    pending: mistakes.filter(m => m.type === type && !m.revised).length
  }));

  return (
    <div className="app-container">
      <Sidebar page={page} setPage={setPage} />

      <main className="main-content">

        <div className="theme-control">
          <button
            type="button"
            className="theme-toggle"
            onClick={() =>
              setTheme(prev => prev === "dark" ? "light" : "dark")
            }
          >
            {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        <div className="backend-status">
          <span className="status-dot"></span>
          Backend: {backendStatus}
        </div>

        {page === "Dashboard" && (
          <Dashboard
            problems={problems}
            solvedCount={solvedCount}
            completedTasks={completedTasks}
            tasks={tasks}
            mistakes={mistakes}
            activity={activity}
            interviews={interviews}
          />
        )}

        {page === "DSA Tracker" && (
          <DSATracker
            problems={problems}
            solvedCount={solvedCount}
            problemName={problemName}
            setProblemName={setProblemName}
            problemTopic={problemTopic}
            setProblemTopic={setProblemTopic}
            problemDifficulty={problemDifficulty}
            setProblemDifficulty={setProblemDifficulty}
            addProblem={addProblem}
            problemFilter={problemFilter}
            setProblemFilter={setProblemFilter}
            filteredProblems={filteredProblems}
            toggleProblem={toggleProblem}
          />
        )}

        {page === "Study Planner" && (
          <StudyPlanner
            tasks={tasks}
            completedTasks={completedTasks}
            taskName={taskName}
            setTaskName={setTaskName}
            taskSubject={taskSubject}
            setTaskSubject={setTaskSubject}
            taskDate={taskDate}
            setTaskDate={setTaskDate}
            taskPriority={taskPriority}
            setTaskPriority={setTaskPriority}
            addTask={addTask}
            taskFilter={taskFilter}
            setTaskFilter={setTaskFilter}
            filteredTasks={filteredTasks}
            toggleTask={toggleTask}
          />
        )}

        {page === "Mistake Journal" && (
          <div>
            <div className="page-heading">
              <p className="eyebrow">LEARN FROM YOUR ERRORS</p>
              <h1>Mistake Journal</h1>
              <p>Record mistakes and revise them to avoid repeating them.</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <p>Total Mistakes</p>
                <h2>{mistakes.length}</h2>
              </div>

              <div className="stat-card">
                <p>Revised</p>
                <h2>{revisedMistakes}</h2>
              </div>

              <div className="stat-card">
                <p>Pending Revision</p>
                <h2>{pendingMistakes}</h2>
              </div>

              <div className="stat-card">
                <p>Revision Progress</p>
                <h2>{mistakeProgress}%</h2>
              </div>
            </div>

            <div className="content-card" style={{ marginTop: "20px" }}>
              <h2>Revision Progress</h2>

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "15px 0 8px"
              }}>
                <span>Revised mistakes</span>
                <strong>{revisedMistakes}/{mistakes.length}</strong>
              </div>

              <div style={{
                width: "100%",
                height: "12px",
                background: "#333",
                borderRadius: "20px",
                overflow: "hidden"
              }}>
                <div style={{
                  width: `${mistakeProgress}%`,
                  height: "100%",
                  background: "#22c55e",
                  borderRadius: "20px",
                  transition: "width 0.4s ease"
                }} />
              </div>

              <p style={{ color: "#999", fontSize: "13px" }}>
                {mistakeProgress === 100 && mistakes.length > 0
                  ? "Excellent! You have revised all recorded mistakes."
                  : `${pendingMistakes} mistake(s) still need revision.`}
              </p>
            </div>

            <div className="content-card" style={{ marginTop: "20px" }}>
              <h2>Mistake Type Analytics</h2>

              {mistakeTypeStats.map(item => (
                <div key={item.name} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "10px",
                  padding: "13px 0",
                  borderBottom: "1px solid #333"
                }}>
                  <div>
                    <strong>{item.name}</strong>
                    <p style={{ margin: "5px 0 0", color: "#999", fontSize: "13px" }}>
                      {item.pending} pending revision
                    </p>
                  </div>

                  <strong>{item.total}</strong>
                </div>
              ))}
            </div>

            <form className="content-card" onSubmit={addMistake}>
              <h2>Record a Mistake</h2>

              <input
                value={mistakeProblem}
                onChange={e => setMistakeProblem(e.target.value)}
                placeholder="Problem name"
                required
              />

              <select
                value={mistakeType}
                onChange={e => setMistakeType(e.target.value)}
              >
                <option>Logic Error</option>
                <option>Syntax Error</option>
                <option>Wrong Approach</option>
                <option>Edge Case</option>
                <option>Time Complexity</option>
              </select>

              <textarea
                value={mistakeWrong}
                onChange={e => setMistakeWrong(e.target.value)}
                placeholder="What went wrong?"
                rows="3"
                required
              />

              <textarea
                value={mistakeCorrect}
                onChange={e => setMistakeCorrect(e.target.value)}
                placeholder="What is the correct approach?"
                rows="3"
                required
              />

              <button className="primary-btn" type="submit">
                Save Mistake
              </button>
            </form>

            <div className="content-card">
              <h2>Your Mistakes</h2>

              <div className="filter-buttons">
                {["All", "Pending", "Revised"].map(filter => (
                  <button
                    type="button"
                    key={filter}
                    className={
                      mistakeFilter === filter
                        ? "filter-btn selected"
                        : "filter-btn"
                    }
                    onClick={() => setMistakeFilter(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {filteredMistakes.length === 0 ? (
                <p style={{ color: "#999" }}>
                  No mistakes found. Record a mistake to start learning from it.
                </p>
              ) : (
                filteredMistakes.map(mistake => {
                  const index = mistakes.indexOf(mistake);

                  return (
                    <div
                      className="list-item mistake-item"
                      key={mistake._id || index}
                    >
                      <div>
                        <h3>{mistake.problem}</h3>
                        <p>{mistake.type}</p>
                        <p>
                          <strong>What went wrong:</strong> {mistake.wrong}
                        </p>
                        <p>
                          <strong>Correct approach:</strong> {mistake.correct}
                        </p>
                      </div>

                      <button
                        type="button"
                        className="secondary-btn"
                        onClick={() => toggleMistake(index)}
                      >
                        {mistake.revised ? "Revised ✓" : "Mark Revised"}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {page === "AI Interview" && (
          <MockInterview
            onInterviewSaved={async () => {
              try {
                const result = await getInterviews();
                setInterviews(result.interviews || []);
              } catch (error) {
                console.error("Could not refresh interviews:", error);
              }
            }}
          />
        )}

        {page === "Resume Analyzer" && <ResumeAnalyzer />}

      </main>
    </div>
  );
}

export default App;
