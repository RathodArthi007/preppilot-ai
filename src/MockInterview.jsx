
import { useEffect, useState } from "react";
import { getInterviews, saveInterview } from "./api";

const questionBank = {
  DSA: {
    Easy: [
      { question: "What is an array in programming?", keywords: ["elements", "same type", "index", "contiguous"], answer: "An array is a collection of elements of the same data type stored in continuous memory locations. Elements are accessed using indexes.", explanation: "An array stores multiple values and allows access using an index." },
      { question: "What is the difference between an array and a linked list?", keywords: ["contiguous", "nodes", "pointers", "memory"], answer: "An array stores elements in contiguous memory locations, while a linked list stores nodes connected using pointers. Arrays support direct indexing.", explanation: "The main difference is how elements are stored and connected." }
    ],
    Medium: [
      { question: "Explain binary search and its time complexity.", keywords: ["sorted", "middle", "half", "log n"], answer: "Binary search works on a sorted array. It checks the middle element and repeatedly eliminates half of the remaining search space. Time complexity is O(log n).", explanation: "Binary search reduces the search area by half in every step." },
      { question: "What is a stack? Explain its main operations.", keywords: ["lifo", "push", "pop", "top"], answer: "A stack is a linear data structure that follows LIFO (Last In First Out). Its main operations are push, pop and peek or top.", explanation: "The last element inserted is the first one removed." }
    ],
    Hard: [
      { question: "Explain dynamic programming and overlapping subproblems.", keywords: ["subproblems", "overlapping", "memoization", "tabulation"], answer: "Dynamic programming solves a problem by dividing it into smaller overlapping subproblems and storing their results. Common methods are memoization and tabulation.", explanation: "DP avoids solving the same subproblem repeatedly." },
      { question: "What is the difference between BFS and DFS?", keywords: ["queue", "stack", "level", "depth"], answer: "BFS explores a graph level by level using a queue. DFS explores deeply before backtracking, usually using recursion or a stack.", explanation: "BFS uses a queue, while DFS uses a stack or recursion." }
    ]
  },
  JavaScript: {
    Easy: [
      { question: "What is JavaScript?", keywords: ["programming", "language", "web", "interactive"], answer: "JavaScript is a programming language used to make web pages interactive and build web applications.", explanation: "JavaScript adds functionality and interaction to websites." },
      { question: "What is the difference between let and const?", keywords: ["reassign", "block", "constant", "variable"], answer: "Both let and const are block-scoped. A let variable can be reassigned, while a const variable cannot be reassigned.", explanation: "Use let for changing values and const for values that should not be reassigned." }
    ],
    Medium: [
      { question: "What is a closure in JavaScript?", keywords: ["function", "outer", "scope", "access"], answer: "A closure is created when an inner function remembers and can access variables from its outer function scope, even after the outer function has finished.", explanation: "Closures allow functions to remember their surrounding scope." },
      { question: "What is the difference between == and ===?", keywords: ["equality", "type", "conversion", "strict"], answer: "Double equals compares values after possible type conversion. Triple equals performs strict comparison of both value and data type.", explanation: "Strict equality avoids unexpected type conversions." }
    ],
    Hard: [
      { question: "Explain the JavaScript event loop.", keywords: ["call stack", "queue", "asynchronous", "callback"], answer: "The event loop coordinates the call stack and task queues. It allows asynchronous callbacks to run when the call stack becomes available.", explanation: "The event loop helps JavaScript handle asynchronous operations." },
      { question: "What are Promises in JavaScript?", keywords: ["asynchronous", "pending", "fulfilled", "rejected"], answer: "A Promise represents the eventual result of an asynchronous operation. It can be pending, fulfilled or rejected.", explanation: "Promises help manage asynchronous code." }
    ]
  },
  React: {
    Easy: [
      { question: "What is React?", keywords: ["library", "user interface", "components", "javascript"], answer: "React is a JavaScript library used to build user interfaces using reusable components.", explanation: "React helps developers create reusable UI components." },
      { question: "What are props in React?", keywords: ["properties", "parent", "child", "data"], answer: "Props are read-only properties used to pass data from a parent component to a child component.", explanation: "Props help components communicate with each other." }
    ],
    Medium: [
      { question: "What is the useState hook?", keywords: ["state", "component", "update", "rerender"], answer: "useState is a React hook that allows functional components to store and update state. Updating state causes React to render the component again.", explanation: "useState manages changing data inside a component." },
      { question: "What is the useEffect hook?", keywords: ["side effects", "dependency", "render", "cleanup"], answer: "useEffect is a React hook used to perform side effects such as fetching data, subscriptions and updating external systems. It can also return a cleanup function.", explanation: "useEffect runs side-effect logic based on its dependencies." }
    ],
    Hard: [
      { question: "What is the Virtual DOM?", keywords: ["representation", "real dom", "diffing", "update"], answer: "The Virtual DOM is an in-memory representation of the UI. React compares versions of this representation and updates the necessary parts of the real DOM.", explanation: "React uses reconciliation to determine which UI updates are needed." },
      { question: "What is React Context?", keywords: ["share", "components", "provider", "consumer"], answer: "Context allows data to be shared across components without passing props manually through every level of the component tree.", explanation: "Context helps avoid prop drilling." }
    ]
  },
  DBMS: {
    Easy: [
      { question: "What is DBMS?", keywords: ["database", "manage", "store", "retrieve"], answer: "DBMS stands for Database Management System. It is software used to store, manage and retrieve data.", explanation: "A DBMS helps organize and manage information." },
      { question: "What is a primary key?", keywords: ["unique", "identify", "record", "null"], answer: "A primary key uniquely identifies each record in a table. It cannot contain duplicate or NULL values.", explanation: "A primary key identifies a particular row." }
    ],
    Medium: [
      { question: "What is database normalization?", keywords: ["redundancy", "tables", "dependency", "data"], answer: "Normalization organizes database tables to reduce data redundancy and improve data consistency.", explanation: "Normalization helps avoid unnecessary duplicate data." },
      { question: "What is the difference between SQL and NoSQL?", keywords: ["relational", "tables", "document", "schema"], answer: "SQL databases commonly use relational tables and structured schemas. NoSQL databases support models such as documents, key-value pairs and flexible schemas.", explanation: "SQL and NoSQL use different data models." }
    ],
    Hard: [
      { question: "Explain ACID properties in DBMS.", keywords: ["atomicity", "consistency", "isolation", "durability"], answer: "ACID stands for Atomicity, Consistency, Isolation and Durability. These properties help ensure reliable database transactions.", explanation: "ACID properties protect transaction reliability." },
      { question: "What is indexing in a database?", keywords: ["search", "speed", "data structure", "lookup"], answer: "Indexing is a technique that uses an additional data structure to speed up searching and retrieving records from a database.", explanation: "Indexes improve lookup speed but require additional storage." }
    ]
  },
  "Operating Systems": {
    Easy: [
      { question: "What is an operating system?", keywords: ["software", "hardware", "resources", "user"], answer: "An operating system is system software that manages computer hardware and software resources and provides an interface for users.", explanation: "An OS manages the computer and allows applications to run." },
      { question: "What is a process?", keywords: ["program", "execution", "running", "memory"], answer: "A process is a program that is currently being executed. It has its own execution state and allocated resources.", explanation: "A running program is called a process." }
    ],
    Medium: [
      { question: "What is the difference between a process and a thread?", keywords: ["independent", "memory", "shared", "execution"], answer: "A process is an independent program in execution with its own memory space. Threads are smaller execution units within a process and share its resources.", explanation: "Threads within the same process share memory and resources." },
      { question: "What is deadlock?", keywords: ["processes", "waiting", "resources", "circular"], answer: "Deadlock is a situation where processes wait indefinitely for resources held by one another.", explanation: "Processes cannot proceed because each is waiting for another." }
    ],
    Hard: [
      { question: "Explain virtual memory.", keywords: ["memory", "disk", "physical", "address"], answer: "Virtual memory is a memory management technique that provides processes with a virtual address space. The operating system maps virtual addresses to physical memory and can use disk storage when needed.", explanation: "Virtual memory allows programs to use an address space beyond available physical RAM." },
      { question: "What is the difference between paging and segmentation?", keywords: ["fixed", "variable", "pages", "segments"], answer: "Paging divides memory into fixed-size pages and frames. Segmentation divides memory into variable-sized logical segments.", explanation: "Paging uses fixed-size blocks, while segmentation uses logical variable-sized units." }
    ]
  }
};

const topics = Object.keys(questionBank);
const difficulties = ["Easy", "Medium", "Hard"];

function evaluateAnswer(answer, question) {
  const normalized = answer.toLowerCase();

  const matched = question.keywords.filter((keyword) =>
    normalized.includes(keyword.toLowerCase())
  );

  const score = Math.round(
    (matched.length / question.keywords.length) * 100
  );

  let feedback = "Keep practicing. Review the sample answer and try again.";

  if (score >= 80) {
    feedback = "Excellent answer! You covered most important concepts.";
  } else if (score >= 50) {
    feedback = "Good attempt! Add more important details.";
  } else if (score >= 25) {
    feedback = "You have started correctly. Explain more key concepts.";
  }

  return { score, matched, feedback };
}

function MockInterview({ onInterviewSaved }) {
  const [topic, setTopic] = useState("DSA");
  const [difficulty, setDifficulty] = useState("Easy");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [history, setHistory] = useState([]);
  const [pastInterviews, setPastInterviews] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const questions = questionBank[topic][difficulty];
  const currentQuestion = questions[questionIndex];

  const averageScore = history.length
    ? Math.round(
        history.reduce((total, item) => total + item.score, 0) / history.length
      )
    : 0;

  const totalInterviews = pastInterviews.length;

  const averageInterviewScore = totalInterviews
    ? Math.round(
        pastInterviews.reduce((sum, item) => sum + item.averageScore, 0) /
          totalInterviews
      )
    : 0;

  const bestInterviewScore = totalInterviews
    ? Math.max(...pastInterviews.map((item) => item.averageScore))
    : 0;

  const topicPerformance = topics.map((item) => {
    const attempts = pastInterviews.filter(
      (interview) => interview.topic === item
    );

    const average = attempts.length
      ? Math.round(
          attempts.reduce((sum, interview) => sum + interview.averageScore, 0) /
            attempts.length
        )
      : 0;

    return { topic: item, average, attempts: attempts.length };
  });

  async function loadInterviews() {
    try {
      const data = await getInterviews();
      const savedInterviews = data.interviews || [];

      setPastInterviews(savedInterviews);
      return savedInterviews;
    } catch (error) {
      console.error("Could not load interviews:", error);
      setMessage("Could not load saved interview history.");
      return null;
    }
  }

  useEffect(() => {
    loadInterviews();
  }, []);

  function startInterview() {
    setQuestionIndex(0);
    setAnswer("");
    setSubmitted(false);
    setResult(null);
    setAnsweredCount(0);
    setHistory([]);
    setMessage("");
    setStarted(true);
  }

  function submitAnswer() {
    if (!answer.trim() || submitted) return;

    const evaluation = evaluateAnswer(answer, currentQuestion);

    setResult(evaluation);
    setSubmitted(true);
    setAnsweredCount((count) => count + 1);

    setHistory((previous) => [
      ...previous,
      {
        question: currentQuestion.question,
        score: evaluation.score
      }
    ]);
  }

  function nextQuestion() {
    setQuestionIndex((index) => (index + 1) % questions.length);
    setAnswer("");
    setSubmitted(false);
    setResult(null);
  }

  async function endInterview() {
    if (saving) return;

    if (history.length > 0) {
      setSaving(true);
      setMessage("");

      try {
        const interviewData = {
          topic,
          difficulty,
          totalQuestions: questions.length,
          answeredQuestions: history.length,
          averageScore,
          questionHistory: history
        };

        await saveInterview(interviewData);

        const updatedInterviews = await loadInterviews();

        if (updatedInterviews !== null && onInterviewSaved) {
          await onInterviewSaved();
        }

        setMessage("Interview saved successfully!");
      } catch (error) {
        console.error("Interview save error:", error);
        setMessage("Could not save interview. Please try again.");
        setSaving(false);
        return;
      }

      setSaving(false);
    } else {
      setMessage("No answers were submitted in this interview.");
    }

    setStarted(false);
    setAnswer("");
    setSubmitted(false);
    setResult(null);
  }

  return (
    <div className="interview-page">
      <div className="page-heading">
        <p className="eyebrow">CAREER PREPARATION</p>
        <h1>AI Mock Interview</h1>
        <p>Practice technical interview questions and improve your answers.</p>
      </div>

      {!started ? (
        <>
          <div className="content-card interview-setup">
            <h2>Start Your Interview</h2>

            <div className="form-group">
              <label>Choose Topic</label>
              <select value={topic} onChange={(e) => setTopic(e.target.value)}>
                {topics.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Choose Difficulty</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                {difficulties.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>

            <button className="primary-btn" onClick={startInterview}>
              Start Interview
            </button>

            <div className="interview-stats">
              <div><h3>{topics.length}</h3><p>Topics</p></div>
              <div><h3>{difficulties.length}</h3><p>Difficulty Levels</p></div>
              <div><h3>30</h3><p>Questions</p></div>
            </div>
          </div>

          {message && <p>{message}</p>}

          <div className="content-card">
            <h2>Interview Performance Dashboard</h2>

            <div className="interview-stats">
              <div><h3>{totalInterviews}</h3><p>Total Interviews</p></div>
              <div><h3>{averageInterviewScore}%</h3><p>Average Score</p></div>
              <div><h3>{bestInterviewScore}%</h3><p>Best Score</p></div>
            </div>

            <h3>Topic-wise Performance</h3>

            {topicPerformance.map((item) => (
              <div key={item.topic} style={{ marginBottom: "18px" }}>
                <p>
                  <strong>{item.topic}</strong> — {item.average}%
                  {" "}({item.attempts} attempts)
                </p>
                <div style={{
                  background: "#ddd",
                  height: "10px",
                  borderRadius: "10px",
                  overflow: "hidden"
                }}>
                  <div style={{
                    width: `${item.average}%`,
                    height: "100%",
                    background: "#6366f1",
                    borderRadius: "10px"
                  }} />
                </div>
              </div>
            ))}
          </div>

          <div className="content-card">
            <h2>Previous Interview Attempts</h2>

            {pastInterviews.length === 0 ? (
              <p>No saved interviews yet. Complete an interview to see it here.</p>
            ) : (
              pastInterviews.map((item) => (
                <div key={item._id} style={{
                  padding: "15px 0",
                  borderBottom: "1px solid #444"
                }}>
                  <h3>{item.topic} - {item.difficulty}</h3>
                  <p>Questions answered: {item.answeredQuestions}</p>
                  <p>Average score: {item.averageScore}%</p>
                  <p>Date: {new Date(item.date).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <>
          <div className="interview-stats">
            <div className="content-card">
              <h3>{answeredCount}</h3>
              <p>Questions Answered</p>
            </div>
            <div className="content-card">
              <h3>{averageScore}%</h3>
              <p>Average Score</p>
            </div>
            <div className="content-card">
              <h3>{topic}</h3>
              <p>Selected Topic</p>
            </div>
          </div>

          <div className="content-card question-card">
            <div className="interview-question-header">
              <span className="difficulty-tag">{difficulty}</span>
              <span>Question {questionIndex + 1} of {questions.length}</span>
            </div>

            <h2>{currentQuestion.question}</h2>

            <div className="form-group">
              <label>Your Answer</label>
              <textarea
                rows="6"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Write your interview answer here..."
                disabled={submitted}
              />
            </div>

            {!submitted ? (
              <button
                className="primary-btn"
                onClick={submitAnswer}
                disabled={!answer.trim()}
              >
                Submit Answer
              </button>
            ) : (
              <div className="feedback-message">
                <h3>Interview Feedback</h3>
                <h2>{result.score}/100</h2>
                <p>{result.feedback}</p>
                <p>
                  <strong>Important concepts identified:</strong>{" "}
                  {result.matched.length} of {currentQuestion.keywords.length}
                </p>
                <h3>Sample Answer</h3>
                <p>{currentQuestion.answer}</p>
                <h3>Explanation</h3>
                <p>{currentQuestion.explanation}</p>
                <button className="primary-btn" onClick={nextQuestion}>
                  Next Question
                </button>
              </div>
            )}

            <button
              className="secondary-btn"
              onClick={endInterview}
              disabled={saving}
              style={{ marginTop: "15px" }}
            >
              {saving ? "Saving..." : "End Interview"}
            </button>
          </div>

          {history.length > 0 && (
            <div className="content-card">
              <h2>Current Interview History</h2>
              {history.map((item, index) => (
                <div key={`${item.question}-${index}`} style={{
                  padding: "12px 0",
                  borderBottom: "1px solid #444"
                }}>
                  <strong>{item.question}</strong>
                  <p>Score: {item.score}/100</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MockInterview;
