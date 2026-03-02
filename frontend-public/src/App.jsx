import React, { useEffect, useState } from "react";
import axios from "axios";
import Resorts from "./components/Resorts";
import AddResort from "./Pages/AddResort";

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