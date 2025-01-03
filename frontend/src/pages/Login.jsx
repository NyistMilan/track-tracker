import React, { useState } from "react";
import { motion } from "framer-motion";

const Login = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/login`;
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-900 text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="bg-gray-800 p-10 rounded-lg shadow-lg text-center max-w-md w-full"
      >
        <h1
          className="text-3xl font-semibold mb-4"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          <span
            style={{
              color: "#22c55e", // Same green color as the login button
              transition: "color 0.3s ease",
            }}
          >
            Track
          </span>
          <span className="text-white">Tracker</span>
        </h1>
        <p
          className="mb-6 text-gray-300 text-lg"
          style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}
        >
          Connect your Spotify account to explore your stats.
        </p>

        {loading ? (
          <p
            className="text-green-400 text-lg font-medium"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Redirecting to Spotify...
          </p>
        ) : (
          <button
            onClick={handleLogin}
            className="bg-green-500 px-8 py-3 rounded-md text-lg font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-300"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Login with Spotify
          </button>
        )}

        <p
          className="mt-6 text-sm text-gray-400"
          style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}
        >
          By logging in, you agree to our{" "}
          <a
            href="/privacy-policy"
            className="text-green-400 underline hover:text-green-500"
          >
            Privacy Policy
          </a>{" "}
          and{" "}
          <a
            href="/terms"
            className="text-green-400 underline hover:text-green-500"
          >
            Terms of Service
          </a>
          .
        </p>
      </motion.div>

      <p
        className="mt-10 text-gray-500 text-sm text-center"
        style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}
      >
        Ready to track your music journey? Start now by connecting your account.
      </p>
    </div>
  );
};

export default Login;
