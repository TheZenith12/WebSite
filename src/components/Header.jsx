import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-green-600 text-white shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center px-6">
        <h1 className="text-2xl font-bold">🌿 AmraltinGazar</h1>
        <nav className="space-x-6">
          <Link
          to="/About"
          style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}
        >
          Бидний тухай
        </Link>
        </nav>
      </div>
    </header>
  );
}
