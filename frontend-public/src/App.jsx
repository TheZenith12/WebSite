import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import PlacesGrid from "./components/PlacesGrid";


export default function App() {
return (
    
<div className="min-h-screen flex flex-col">
<Header />
<main className="flex-1 container mx-auto px-4 py-8">
<Hero />
<h2 className="mt-8 text-2xl font-semibold"> </h2>
<PlacesGrid />
</main>
<footer className="bg-gray-100 py-6 text-center">© {new Date().getFullYear()} AmraltinGazar</footer>
</div>

)
}