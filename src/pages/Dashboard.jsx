
function Dashboard({
  problems = [],
  solvedCount = 0,
  completedTasks = 0,
  tasks = [],
  mistakes = [],
  activity = [],
  interviews = []
}) {
  const totalProblems = problems.length;
  const pendingProblems = totalProblems - solvedCount;
  const totalTasks = tasks.length;
  const pendingTasks = totalTasks - completedTasks;

  const revisedMistakes = mistakes.filter(m => m.revised).length;
  const pendingMistakes = mistakes.length - revisedMistakes;

  const dsaProgress = totalProblems ? Math.round((solvedCount / totalProblems) * 100) : 0;
  const studyProgress = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const mistakeProgress = mistakes.length ? Math.round((revisedMistakes / mistakes.length) * 100) : 0;

  const interviewAverage = interviews.length
    ? Math.round(interviews.reduce((sum, item) => sum + (Number(item.averageScore) || 0), 0) / interviews.length)
    : 0;

  const bestInterview = interviews.length
    ? Math.max(...interviews.map(item => Number(item.averageScore) || 0))
    : 0;

  const overallProgress = Math.round((dsaProgress + studyProgress + mistakeProgress) / 3);

  const easySolved = problems.filter(p => p.solved && p.difficulty === "Easy").length;
  const mediumSolved = problems.filter(p => p.solved && p.difficulty === "Medium").length;
  const hardSolved = problems.filter(p => p.solved && p.difficulty === "Hard").length;

  const difficultyStats = [
    { name: "Easy", solved: easySolved, color: "#22c55e" },
    { name: "Medium", solved: mediumSolved, color: "#f59e0b" },
    { name: "Hard", solved: hardSolved, color: "#ef4444" }
  ];

  const weekDays = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);

    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    const count = activity.filter(item => item.date === dateKey).length;

    weekDays.push({
      dateKey,
      label: date.toLocaleDateString("en-US", { weekday: "short" }),
      count
    });
  }

  const maxActivity = Math.max(1, ...weekDays.map(day => day.count));

  let recommendation = "Start by adding your first DSA problem.";

  if (pendingTasks > 0) {
    recommendation = `You have ${pendingTasks} pending study task(s). Complete one today.`;
  } else if (pendingProblems > 0) {
    recommendation = `You have ${pendingProblems} unsolved DSA problem(s). Practice one next.`;
  } else if (pendingMistakes > 0) {
    recommendation = `You have ${pendingMistakes} mistake(s) to revise.`;
  } else if (interviews.length === 0) {
    recommendation = "Try your first mock interview to measure your preparation.";
  } else {
    recommendation = "Great progress! Keep practicing and improving your interview scores.";
  }

  const progressItems = [
    { name: "DSA Progress", completed: solvedCount, total: totalProblems, percentage: dsaProgress },
    { name: "Study Planner Progress", completed: completedTasks, total: totalTasks, percentage: studyProgress },
    { name: "Mistake Revision Progress", completed: revisedMistakes, total: mistakes.length, percentage: mistakeProgress }
  ];

  function activityIcon(type) {
    if (type === "dsa") return "💻";
    if (type === "task") return "📚";
    return "📝";
  }

  function formatDate(date) {
    if (!date) return "Date unavailable";
    const parsed = new Date(date);
    return isNaN(parsed.getTime()) ? "Date unavailable" : parsed.toLocaleDateString();
  }

  return (
    <div>
      <div className="page-heading">
        <p className="eyebrow">YOUR LEARNING SPACE</p>
        <h1>Welcome to PrepPilot AI</h1>
        <p>Your journey towards becoming a software developer starts here.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <p>Problems Solved</p>
          <h2>{solvedCount}</h2>
          <small>Out of {totalProblems} problems</small>
        </div>

        <div className="stat-card">
          <p>Study Tasks Completed</p>
          <h2>{completedTasks}</h2>
          <small>{pendingTasks} pending tasks</small>
        </div>

        <div className="stat-card">
          <p>Total Study Tasks</p>
          <h2>{totalTasks}</h2>
          <small>In your study planner</small>
        </div>

        <div className="stat-card">
          <p>Mistakes Recorded</p>
          <h2>{mistakes.length}</h2>
          <small>{revisedMistakes} revised</small>
        </div>
      </div>

      <div className="content-card" style={{ marginTop: "20px" }}>
        <h2>Interview Performance</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <p>Total Interviews</p>
            <h2>{interviews.length}</h2>
          </div>
          <div className="stat-card">
            <p>Average Score</p>
            <h2>{interviewAverage}%</h2>
          </div>
          <div className="stat-card">
            <p>Best Score</p>
            <h2>{bestInterview}%</h2>
          </div>
        </div>
        {interviews.length === 0 && <p>No interview attempts yet. Complete a mock interview to see your performance.</p>}
      </div>

      <div className="content-card" style={{ marginTop: "20px" }}>
        <h2>Recent Interview History</h2>

        {interviews.length === 0 ? (
          <p style={{ color: "#999" }}>Your completed interviews will appear here.</p>
        ) : (
          [...interviews]
            .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
            .slice(0, 5)
            .map((item, index) => {
              const score = Number(item.averageScore) || 0;

              return (
                <div
                  key={item._id || index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                    padding: "15px 0",
                    borderBottom: "1px solid #333"
                  }}
                >
                  <div>
                    <strong>{item.topic || "Mock Interview"}</strong>
                    <p style={{ margin: "5px 0", color: "#999" }}>
                      {item.difficulty || "Difficulty unavailable"} · {formatDate(item.date)}
                    </p>
                    <small style={{ color: "#999" }}>
                      {item.answeredQuestions || 0} questions answered
                    </small>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <h2 style={{
                      margin: 0,
                      color: score >= 70 ? "#22c55e" : score >= 40 ? "#f59e0b" : "#ef4444"
                    }}>
                      {score}%
                    </h2>
                    <small style={{ color: "#999" }}>
                      {score >= 70 ? "Good performance" : score >= 40 ? "Keep improving" : "More practice needed"}
                    </small>
                  </div>
                </div>
              );
            })
        )}
      </div>

      <div className="content-card" style={{ marginTop: "20px" }}>
        <h2>Overall Preparation Progress</h2>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "20px 0 10px" }}>
          <span>Your progress</span>
          <strong style={{ color: "#22c55e", fontSize: "24px" }}>{overallProgress}%</strong>
        </div>
        <div style={{ width: "100%", height: "12px", background: "#333", borderRadius: "20px", overflow: "hidden" }}>
          <div style={{ width: `${overallProgress}%`, height: "100%", background: "#22c55e", borderRadius: "20px", transition: "width 0.4s ease" }} />
        </div>
        <p style={{ color: "#999", fontSize: "13px" }}>
          Average progress across DSA, study tasks, and mistake revision.
        </p>
      </div>

      <div className="content-card" style={{ marginTop: "20px" }}>
        <h2>DSA Difficulty Analytics</h2>
        <p style={{ color: "#999" }}>Track your solved problems by difficulty.</p>

        {difficultyStats.map(item => (
          <div key={item.name} style={{ marginTop: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <strong>{item.name}</strong>
              <span>{item.solved} solved</span>
            </div>
            <div style={{ width: "100%", height: "10px", background: "#333", borderRadius: "20px", overflow: "hidden" }}>
              <div style={{ width: `${totalProblems ? (item.solved / totalProblems) * 100 : 0}%`, height: "100%", background: item.color, borderRadius: "20px" }} />
            </div>
          </div>
        ))}
      </div>

      <div className="content-card" style={{ marginTop: "20px" }}>
        <h2>Module Progress</h2>
        {progressItems.map(item => (
          <div key={item.name} style={{ marginTop: "25px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", marginBottom: "8px" }}>
              <strong>{item.name}</strong>
              <span>{item.completed}/{item.total} ({item.percentage}%)</span>
            </div>
            <div style={{ width: "100%", height: "9px", background: "#333", borderRadius: "20px", overflow: "hidden" }}>
              <div style={{ width: `${item.percentage}%`, height: "100%", background: "#22c55e", borderRadius: "20px" }} />
            </div>
          </div>
        ))}
      </div>

      <div className="content-card" style={{ marginTop: "20px" }}>
        <h2>Weekly Activity</h2>
        <p style={{ color: "#999" }}>Your recorded learning activities over the last 7 days.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: "12px", alignItems: "end", marginTop: "25px" }}>
          {weekDays.map(day => (
            <div key={day.dateKey} style={{ textAlign: "center", minWidth: 0 }}>
              <strong style={{ fontSize: "12px" }}>{day.count}</strong>
              <div style={{ height: "120px", display: "flex", alignItems: "end", justifyContent: "center", margin: "8px 0" }}>
                <div title={`${day.count} activities`} style={{ width: "70%", maxWidth: "35px", height: `${Math.max(5, (day.count / maxActivity) * 100)}%`, background: day.count ? "#22c55e" : "#333", borderRadius: "6px 6px 0 0" }} />
              </div>
              <span style={{ fontSize: "12px", color: "#999" }}>{day.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="content-card" style={{ marginTop: "20px" }}>
        <h2>Recent Activity</h2>
        {activity.length === 0 ? (
          <p style={{ color: "#999" }}>No recent activity yet.</p>
        ) : (
          activity.slice(0, 6).map((item, index) => (
            <div key={`${item.id}-${index}`} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "13px 0", borderBottom: "1px solid #333" }}>
              <span style={{ fontSize: "22px" }}>{activityIcon(item.type)}</span>
              <div>
                <p style={{ margin: 0 }}>{item.message}</p>
                <small style={{ color: "#999" }}>{item.date}</small>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="content-card" style={{ marginTop: "20px" }}>
        <h2>Task Summary</h2>
        <p><strong>DSA:</strong> {solvedCount} solved, {pendingProblems} pending</p>
        <p><strong>Study Planner:</strong> {completedTasks} completed, {pendingTasks} pending</p>
        <p><strong>Mistake Journal:</strong> {revisedMistakes} revised, {pendingMistakes} pending</p>
      </div>

      <div className="content-card" style={{ marginTop: "20px" }}>
        <h2>Recommended Next Step</h2>
        <p>{recommendation}</p>
      </div>
    </div>
  );
}

export default Dashboard;
