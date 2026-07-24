import { NavLink } from "react-router-dom";

export default function SiteNav() {
  return (
    <nav className="site-nav">
      <div className="nav-brand">
        <span>Project VPN</span>
      </div>
      <ul className="nav-links">
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/dashboard">Dashboard</NavLink></li>
        <li><NavLink to="/servers">Servers</NavLink></li>
        <li><NavLink to="/account">Account</NavLink></li>
      </ul>
    </nav>
  );
}
