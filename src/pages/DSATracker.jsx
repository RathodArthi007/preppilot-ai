
function DSATracker({
  problems = [],
  solvedCount = 0,
  problemName,
  setProblemName,
  problemTopic,
  setProblemTopic,
  problemDifficulty,
  setProblemDifficulty,
  addProblem,
  problemFilter,
  setProblemFilter,
  filteredProblems = [],
  toggleProblem
}) {
  const difficulties = ["Easy", "Medium", "Hard"];

  const difficultyStats = difficulties.map(difficulty => {
    const matching = problems.filter(p => p.difficulty === difficulty);
    const solved = matching.filter(p => p.solved).length;
    const total = matching.length;

    return {
      name: difficulty,
      total,
      solved,
      remaining: total - solved,
      percentage: total ? Math.round((solved / total) * 100) : 0,
      color:
        difficulty === "Easy"
          ? "#22c55e"
          : difficulty === "Medium"
          ? "#f59e0b"
          : "#ef4444"
    };
  });

  const totalProblems = problems.length;
  const remainingProblems = totalProblems - solvedCount;
  const overallPercentage = totalProblems
    ? Math.round((solvedCount / totalProblems) * 100)
    : 0;

  return (
    <div>
      <div className="page-heading">
        <p className="eyebrow">DATA STRUCTURES AND ALGORITHMS</p>
        <h1>DSA Tracker</h1>
        <p>Track your coding practice and problem-solving progress.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <p>Total Problems</p>
          <h2>{totalProblems}</h2>
        </div>

        <div className="stat-card">
          <p>Solved</p>
          <h2>{solvedCount}</h2>
        </div>

        <div className="stat-card">
          <p>Remaining</p>
          <h2>{remainingProblems}</h2>
        </div>

        <div className="stat-card">
          <p>Completion</p>
          <h2>{overallPercentage}%</h2>
        </div>
      </div>

      <div className="content-card" style={{ marginTop: "20px" }}>
        <h2>Overall Solving Progress</h2>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "15px 0 8px"
        }}>
          <span>Problems completed</span>
          <strong>{solvedCount}/{totalProblems}</strong>
        </div>

        <div style={{
          height: "12px",
          background: "#333",
          borderRadius: "20px",
          overflow: "hidden"
        }}>
          <div style={{
            width: `${overallPercentage}%`,
            height: "100%",
            background: "#22c55e",
            borderRadius: "20px",
            transition: "width 0.4s ease"
          }} />
        </div>
      </div>

      <div className="content-card" style={{ marginTop: "20px" }}>
        <h2>Difficulty-wise Analytics</h2>
        <p style={{ color: "#999" }}>
          Track your progress at each difficulty level.
        </p>

        {difficultyStats.map(item => (
          <div key={item.name} style={{ marginTop: "22px" }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "8px",
              marginBottom: "8px"
            }}>
              <strong>{item.name}</strong>
              <span>{item.solved}/{item.total} solved ({item.percentage}%)</span>
            </div>

            <div style={{
              height: "10px",
              background: "#333",
              borderRadius: "20px",
              overflow: "hidden"
            }}>
              <div style={{
                width: `${item.percentage}%`,
                height: "100%",
                background: item.color,
                borderRadius: "20px",
                transition: "width 0.4s ease"
              }} />
            </div>

            <p style={{ color: "#999", fontSize: "13px", marginTop: "6px" }}>
              {item.remaining} remaining
            </p>
          </div>
        ))}
      </div>

      <form className="content-card" onSubmit={addProblem}>
        <h2>Add New Problem</h2>

        <input
          value={problemName}
          onChange={e => setProblemName(e.target.value)}
          placeholder="Enter problem name"
          required
        />

        <select
          value={problemTopic}
          onChange={e => setProblemTopic(e.target.value)}
        >
          <option>Arrays</option>
          <option>Strings</option>
          <option>Linked List</option>
          <option>Stack</option>
          <option>Queue</option>
          <option>Trees</option>
          <option>Graphs</option>
          <option>Dynamic Programming</option>
        </select>

        <select
          value={problemDifficulty}
          onChange={e => setProblemDifficulty(e.target.value)}
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        <button type="submit" className="primary-btn">
          Add Problem
        </button>
      </form>

      <div className="content-card">
        <h2>Your Problems</h2>

        <div className="filter-buttons">
          {["All", "Easy", "Medium", "Hard"].map(filter => (
            <button
              type="button"
              key={filter}
              className={
                problemFilter === filter
                  ? "filter-btn selected"
                  : "filter-btn"
              }
              onClick={() => setProblemFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {filteredProblems.length === 0 ? (
          <p style={{ color: "#999" }}>No problems found. Add your first problem!</p>
        ) : (
          filteredProblems.map((problem, index) => (
            <div className="list-item" key={problem._id || `${problem.name}-${index}`}>
              <div>
                <h3>{problem.name}</h3>
                <p>{problem.topic} · {problem.difficulty}</p>
              </div>

              <button
                type="button"
                className="secondary-btn"
                onClick={() => toggleProblem(problems.indexOf(problem))}
              >
                {problem.solved ? "Solved ✓" : "Mark Solved"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DSATracker;
