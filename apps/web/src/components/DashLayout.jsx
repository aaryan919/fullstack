import { Outlet } from "react-router-dom";
import SiteNav from "./SiteNav";

export default function DashLayout() {
  return (
    <div className="dash-layout">
      <SiteNav />
      <main className="dash-content">
        <Outlet />
      </main>
    </div>
  );
}
