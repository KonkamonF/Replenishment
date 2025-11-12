import React, { useState } from "react";

export default function Uploadimg() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    console.log("Uploading:", file);
  };

  return (
    <div className="flex flex-col border-pink-200 border rounded-xl shadow-md p-4 ">
      {/* Header */}

      {/* File preview section */}
      {file && (
        <section className="w-full max-w-sm text-center mx-auto ">
          <p className="text-lg font-semibold text-pink-600 mb-2">
            File details
          </p>
          <ul className="text-gray-700 text-sm">
            <li>
              <strong>Name:</strong> {file.name}
            </li>
          </ul>

          <div className="">
            <img
              src={preview}
              alt="Preview"
              className="w-50 h-50 object-cover rounded-lg mx-auto border-2 border-pink-900 shadow-sm  hover:scale-101"
            />
          </div>
        </section>
      )}
      <div className="flex justify-center gap-4">
        {/* File input (moved to bottom) */}
        <div className="mt-2 max-w-md text-center">
          <label
            htmlFor="file"
            className="inline-block px-4 py-1 border-2 text-sm border-pink-500 rounded-lg  text-pink-600 font-medium shadow-sm cursor-pointer hover:bg-pink-100"
          >
            Choose File
          </label>
          <input
            id="file"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {file && (
          <button
            onClick={handleUpload}
            className="mt-2 px-4 py-1 border-2 text-sm border-pink-500 rounded-lg  text-pink-600 font-medium shadow-sm cursor-pointer hover:bg-pink-100"
          >
            Upload file
          </button>
        )}
      </div>
    </div>
  );
}
