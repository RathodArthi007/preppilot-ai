function Sidebar({ page, setPage }) {
  const menuItems = [
    "Dashboard",
    "DSA Tracker",
    "Study Planner",
    "Mistake Journal",
    "AI Interview",
    "Resume Analyzer"
  ];

  return (
    <aside className="sidebar">
      <h2 className="logo">
        PrepPilot<span> AI</span>
      </h2>

      <p className="menu-title">MENU</p>

      <nav>
        {menuItems.map((item) => (
          <button
            key={item}
            className={page === item ? "nav-item active" : "nav-item"}
            onClick={() => setPage(item)}
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <p>Placement Preparation</p>
        <small>Build your future step by step.</small>
      </div>
    </aside>
  );
}

export default Sidebar;
