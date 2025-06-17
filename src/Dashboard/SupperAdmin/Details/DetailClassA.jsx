import React from "react";

export default function DetailClassA({ setIsDetailsClassA }) {
  return (
    <>
      <div className="bg-amber-200 w-screen">
        <div onClick={() => setIsDetailsClassA(false)} className="text-black">
          x
        </div>
      </div>
    </>
  );
}
