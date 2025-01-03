import React, { useState } from "react";

const FileUpload = ({ onClose }) => {
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(
      (file) => file.type === "application/json"
    );
    if (files.length) {
      handleFileUpload(files);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).filter(
      (file) => file.type === "application/json"
    );
    if (files.length) {
      handleFileUpload(files);
    }
  };

  const handleFileUpload = async (files) => {
    setLoading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/upload`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      if (response.ok) {
        setMessage(
          "Files uploaded successfully! You will soon see the uploaded track analytics in your feed."
        );
      } else {
        const errorData = await response.json();
        setMessage(`Failed to upload files: ${errorData.message}`);
      }
    } catch (error) {
      setMessage("An error occurred while uploading files.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-6 text-center">
          Upload Listening History
        </h2>
        {!message && (
          <>
            <div
              className={`border-2 border-dashed rounded-lg p-4 mb-6 ${
                dragging ? "border-blue-500" : "border-gray-400"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <p className="text-center text-gray-600">
                Drag and drop .json files here
              </p>
            </div>

            <div className="flex justify-between items-center">
              <label
                htmlFor="file-upload"
                className="bg-blue-600 text-white px-6 py-2 rounded cursor-pointer hover:bg-blue-700 transition-all"
              >
                Browse Files
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".json"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                onClick={onClose}
                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-all"
                disabled={loading}
              >
                Cancel
              </button>
            </div>

            {loading && (
              <p className="mt-4 text-center text-gray-500">
                Uploading files...
              </p>
            )}
          </>
        )}

        {message && (
          <div className="text-center">
            <p className="text-gray-800">{message}</p>
            <button
              onClick={onClose}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-all"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
