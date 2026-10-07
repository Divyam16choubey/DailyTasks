const Navbar = () => (
  <header className="topbar">
    <a className="brand" href="/" aria-label="DailyTasks home">
      <span className="brand-mark">
        <img src="/logo.png" alt="DailyTasks logo" />
      </span>
      <span>Daily<span>Tasks</span></span>
    </a>
    <nav aria-label="Main navigation">
      <a className="active" href="#tasks">My tasks</a>
      <a href="#focus">Focus</a>
    </nav>
    <div className="avatar" aria-label="Your profile">D</div>
  </header>
)

export default Navbar
