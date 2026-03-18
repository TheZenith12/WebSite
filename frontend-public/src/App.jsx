import React, { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Resorts from "./components/Resorts";

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ visitors: 0, count: 0 });

  return (
      <Resorts 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
        onStatsUpdate={setStats}
      />
  );
}

export default App;