import React, { useState } from 'react';

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
    <div className="flex flex-col items-center justify-center bg-gradient-to-b from-pink-50 to-white p-6">
      {/* Header */}

      {/* File preview section */}
      {file && (
        <section className="w-full max-w-sm text-center bg-white border border-pink-200 rounded-xl shadow-md p-4 transition-all duration-300 hover:shadow-lg">
          <p className="text-lg font-semibold text-pink-600 mb-2">File details</p>
          <ul className="text-gray-700 text-sm">
            <li><strong>Name:</strong> {file.name}</li>
          </ul>

          <div className="mt-4">
            <img
              src={preview}
              alt="Preview"
              className="w-50 h-50 object-cover  rounded-lg mx-auto border-2 border-pink-300 shadow-sm transition-transform duration-300 hover:scale-105"
            />
          </div>
        </section>
      )}

      {/* Upload button */}
      <div className='flex gap-4'>
         {/* File input (moved to bottom) */}
      <div className="mt-2 max-w-md text-center">
        <label
          htmlFor="file"
          className="inline-block px-4 py-1 border-2 text-sm border-pink-500 rounded-lg bg-white text-pink-600 font-medium shadow-sm cursor-pointer hover:bg-pink-50 transition"
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
          className="mt-2 px-4 py-1 border-2 text-sm border-pink-500 rounded-lg text-pink-600 font-semibold shadow-sm hover:bg-pink-100 hover:text-pink-700 transition-all"
        >
          Upload file
        </button>
      )}
     

      </div>
    </div>
  );
}
