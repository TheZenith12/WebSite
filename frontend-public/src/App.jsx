import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Hero from "./components/Hero";
import Resorts from "./components/Resorts";

function Home({ searchTerm, setSearchTerm, setStats }) {
  return (
    <>
      <Hero searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {/* энд stats card-ууд чинь байна */}
    </>
  );
}

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({ visitors: 0, count: 0 });

  return (
    <BrowserRouter>
      <Header stats={stats} />

      <Routes>
        {/* 1-р зураг (Hero page) */}
        <Route
          path="/"
          element={
            <Home
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              setStats={setStats}
            />
          }
        />

        {/* 2-р зураг (Онцлох амралтын газрууд) */}
        <Route
          path="/resorts"
          element={
            <Resorts
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onStatsUpdate={setStats}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;