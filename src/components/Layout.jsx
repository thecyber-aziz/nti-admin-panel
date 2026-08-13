import {
  Outlet
} from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

import { useState } from "react";

export default function Layout() {

  const [
    sidebarOpen,
    setSidebarOpen
  ] = useState(false);

  return (

    <div className="app-shell">

      <Sidebar
        open={sidebarOpen}
        onClose={() =>
          setSidebarOpen(false)
        }
      />

      <div className="main-area">

        <Navbar
          onMenu={() =>
            setSidebarOpen(true)
          }
        />

        <main className="page-content">

          <Outlet />

        </main>

      </div>

    </div>
  );
}