import React, { Suspense, lazy, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";

const Login = lazy(() => import("./pages/Login"));
const CurrentHistory = lazy(() => import("./pages/CurrentHistory"));
const FullHistory = lazy(() => import("./pages/FullHistory"));

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/auth/check`,
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      setIsAuthenticated(false);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      {!isAuthenticated ? (
        <Routes>
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/" element={<Login />} />
        </Routes>
      ) : (
        <>
          <Header />
          <Routes>
            <Route path="/current_history" element={<CurrentHistory />} />
            <Route path="/full_history" element={<FullHistory />} />
            <Route path="/" element={<Navigate to="/current_history" />} />
          </Routes>
        </>
      )}
    </Router>
  );
};

export default App;
