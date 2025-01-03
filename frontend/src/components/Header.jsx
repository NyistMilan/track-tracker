import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import FileUpload from "./FileUpload";

const Header = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const maxScroll = 100;
      const progress = Math.min(scrollTop / maxScroll, 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        window.location.href = "/";
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  const handleFilesUploaded = (files) => {
    console.log("Uploaded files:", files);
    setShowUploadDialog(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gray-900 bg-opacity-90 shadow-md transition-shadow duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1
          className="text-3xl font-bold tracking-wide"
          style={{
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          <span
            style={{
              color: `rgb(
                ${255 - scrollProgress * (255 - 22)},
                ${255 - scrollProgress * (255 - 163)},
                ${255 - scrollProgress * (255 - 74)}
              )`,
              transition: "color 0.3s ease",
            }}
          >
            Track
          </span>
          <span className="text-white">Tracker</span>
        </h1>

        <nav className="flex space-x-4">
          <NavLink
            to="/current_history"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md text-sm font-semibold uppercase tracking-wide transition-all duration-300 ${
                isActive
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-gray-800 text-gray-300 hover:bg-green-500 hover:text-white"
              }`
            }
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Current History
          </NavLink>
          <NavLink
            to="/full_history"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md text-sm font-semibold uppercase tracking-wide transition-all duration-300 ${
                isActive
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-gray-800 text-gray-300 hover:bg-green-500 hover:text-white"
              }`
            }
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Full History
          </NavLink>
          <button
            onClick={() => setShowUploadDialog(true)}
            className="px-4 py-2 rounded-md text-sm font-semibold uppercase tracking-wide bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Upload
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-md text-sm font-semibold uppercase tracking-wide bg-red-600 text-white hover:bg-red-700 transition-all duration-300"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Logout
          </button>
        </nav>
      </div>
      {showUploadDialog && (
        <FileUpload
          onClose={() => setShowUploadDialog(false)}
          onFilesSelected={handleFilesUploaded}
        />
      )}
    </header>
  );
};

export default Header;
