import React, { useState } from "react";
import { BrowserRouter, Link, useLocation } from "react-router-dom";
import { Button } from "./components/ui/interactive/button";
import { AppRoutes } from "./router/AppRoutes";

function Navigation() {
  const location = useLocation();
  const [debugEmptyState, setDebugEmptyState] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-[#1e3a8a] text-white px-6 py-4 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex space-x-6">
            <Link
              to="/insights"
              className={`px-6 py-3 border-b-2 transition-colors ${
                isActive('/insights')
                  ? 'bg-blue-600/30 text-white border-white'
                  : 'text-blue-100 border-transparent hover:text-white hover:bg-blue-600/20'
              }`}
            >
              Insights
            </Link>
            <Link
              to="/triggerjobs"
              className={`px-6 py-3 border-b-2 transition-colors ${
                isActive('/triggerjobs')
                  ? 'bg-blue-600/30 text-white border-white'
                  : 'text-blue-100 border-transparent hover:text-white hover:bg-blue-600/20'
              }`}
            >
              Automation
            </Link>
          </div>

          {/* Debug Toggle */}
          <div className="ml-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDebugEmptyState(!debugEmptyState)}
              className="bg-blue-700 border-blue-500 text-white hover:bg-blue-600 hover:border-blue-400"
            >
              Debug: {debugEmptyState ? "With Data" : "With Empty State"}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <AppRoutes />
        </main>
      </div>
    </BrowserRouter>
  );
}