
function StudyPlanner({
  tasks = [],
  completedTasks = 0,
  taskName,
  setTaskName,
  taskSubject,
  setTaskSubject,
  taskDate,
  setTaskDate,
  taskPriority,
  setTaskPriority,
  addTask,
  taskFilter,
  setTaskFilter,
  filteredTasks = [],
  toggleTask
}) {
  const totalTasks = tasks.length;
  const pendingTasks = totalTasks - completedTasks;

  const progress = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  const highPriority = tasks.filter(
    task => task.priority === "High" && !task.completed
  ).length;

  const mediumPriority = tasks.filter(
    task => task.priority === "Medium" && !task.completed
  ).length;

  const lowPriority = tasks.filter(
    task => task.priority === "Low" && !task.completed
  ).length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const overdueTasks = tasks.filter(task => {
    if (!task.date || task.completed) return false;
    const date = new Date(`${task.date}T00:00:00`);
    return !isNaN(date.getTime()) && date < today;
  }).length;

  return (
    <div>
      <div className="page-heading">
        <p className="eyebrow">PLAN YOUR LEARNING</p>
        <h1>Study Planner</h1>
        <p>Organize your daily study activities.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <p>Total Tasks</p>
          <h2>{totalTasks}</h2>
        </div>

        <div className="stat-card">
          <p>Completed</p>
          <h2>{completedTasks}</h2>
        </div>

        <div className="stat-card">
          <p>Pending</p>
          <h2>{pendingTasks}</h2>
        </div>

        <div className="stat-card">
          <p>Overdue Tasks</p>
          <h2>{overdueTasks}</h2>
        </div>
      </div>

      <div className="content-card" style={{ marginTop: "20px" }}>
        <h2>Study Completion Progress</h2>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "15px 0 8px"
        }}>
          <span>Completed tasks</span>
          <strong>{progress}%</strong>
        </div>

        <div style={{
          width: "100%",
          height: "12px",
          background: "#333",
          borderRadius: "20px",
          overflow: "hidden"
        }}>
          <div style={{
            width: `${progress}%`,
            height: "100%",
            background: "#22c55e",
            borderRadius: "20px",
            transition: "width 0.4s ease"
          }} />
        </div>

        <p style={{ color: "#999", fontSize: "13px" }}>
          {completedTasks} of {totalTasks} tasks completed.
        </p>
      </div>

      <div className="content-card" style={{ marginTop: "20px" }}>
        <h2>Pending Task Priorities</h2>

        <div className="stats-grid">
          <div className="stat-card">
            <p>High Priority</p>
            <h2 style={{ color: "#ef4444" }}>{highPriority}</h2>
          </div>

          <div className="stat-card">
            <p>Medium Priority</p>
            <h2 style={{ color: "#f59e0b" }}>{mediumPriority}</h2>
          </div>

          <div className="stat-card">
            <p>Low Priority</p>
            <h2 style={{ color: "#22c55e" }}>{lowPriority}</h2>
          </div>
        </div>
      </div>

      <form className="content-card" onSubmit={addTask}>
        <h2>Add Study Task</h2>

        <input
          value={taskName}
          onChange={e => setTaskName(e.target.value)}
          placeholder="Enter task name"
          required
        />

        <select
          value={taskSubject}
          onChange={e => setTaskSubject(e.target.value)}
        >
          <option>DSA</option>
          <option>Operating Systems</option>
          <option>DBMS</option>
          <option>Computer Networks</option>
          <option>JavaScript</option>
          <option>React</option>
        </select>

        <input
          type="date"
          value={taskDate}
          onChange={e => setTaskDate(e.target.value)}
        />

        <select
          value={taskPriority}
          onChange={e => setTaskPriority(e.target.value)}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <button type="submit" className="primary-btn">
          Add Task
        </button>
      </form>

      <div className="content-card">
        <h2>Your Study Tasks</h2>

        <div className="filter-buttons">
          {["All", "Pending", "Completed"].map(filter => (
            <button
              type="button"
              key={filter}
              className={
                taskFilter === filter
                  ? "filter-btn selected"
                  : "filter-btn"
              }
              onClick={() => setTaskFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {filteredTasks.length === 0 ? (
          <p style={{ color: "#999" }}>
            No tasks found. Add your first study task!
          </p>
        ) : (
          filteredTasks.map((task, index) => {
            const isOverdue =
              task.date &&
              !task.completed &&
              new Date(`${task.date}T00:00:00`) < today;

            return (
              <div className="list-item" key={task._id || `${task.name}-${index}`}>
                <div>
                  <h3>{task.name}</h3>

                  <p>
                    {task.subject} · {task.priority} Priority
                    {task.date && ` · ${task.date}`}
                  </p>

                  {isOverdue && (
                    <small style={{ color: "#ef4444" }}>
                      Overdue task
                    </small>
                  )}
                </div>

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => toggleTask(tasks.indexOf(task))}
                >
                  {task.completed ? "Completed ✓" : "Mark Complete"}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default StudyPlanner;
