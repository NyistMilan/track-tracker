import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonCard = () => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col space-y-3 animate-pulse">
      <div className="w-full h-40 bg-gray-700 rounded-lg mb-3"></div>
      <Skeleton height={20} width="60%" />
      <Skeleton height={16} width="80%" />
      <Skeleton height={16} width="70%" />
      <Skeleton height={12} width="90%" className="mt-auto" />
    </div>
  );
};

export default SkeletonCard;
