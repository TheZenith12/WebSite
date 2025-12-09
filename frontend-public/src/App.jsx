import React, { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Resorts from "./components/Resorts";

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ visitors: 0, count: 0 });

  return (
    <div className="min-h-screen">
      <Header 
        totalVisitors={stats.visitors} 
        totalResorts={stats.count} 
      />
      <Hero 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
      />
      <Resorts 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
        onStatsUpdate={setStats}
      />
    </div>
  );
}

export default App;