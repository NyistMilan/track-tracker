import React from "react";
import { motion } from "framer-motion";

const TrackCard = ({ track }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow"
    >
      <div className="relative">
        {track.albumImage && track.albumImage !== "unknown" ? (
          <img
            src={track.albumImage}
            alt={track.name}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3
          className="text-lg font-semibold text-white truncate"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          {track.name}
        </h3>
        <p
          className="text-gray-400 text-sm mt-1"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Artist: <span className="text-gray-200">{track.artist}</span>
        </p>
        <p
          className="text-gray-400 text-sm"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Album: <span className="text-gray-200">{track.albumName}</span>
        </p>
        <p
          className="text-gray-500 text-xs mt-auto"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Played at: {track.playedAt}
        </p>
      </div>
    </motion.div>
  );
};

export default TrackCard;
