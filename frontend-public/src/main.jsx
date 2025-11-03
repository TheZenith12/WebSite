import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from "./App.jsx";
import Details from './Pages/Details.jsx'
import About from './Pages/About.jsx';
import './index.css'


createRoot(document.getElementById('root')).render(
<React.StrictMode>
<BrowserRouter>
<Routes>
<Route path="/" element={<App />} />
<Route path="/details/:id" element={<Details />} />
<Route path="/about" element={<About />} />
</Routes>
</BrowserRouter>
</React.StrictMode>
)