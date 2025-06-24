import React from "react";
import { Link } from "react-router-dom";

const hover = "hover:bg-gray-300 p-2 w-full text-center";

export default function Side() {
  return (
    <>
      <div className="flex flex-col">
        <Link to="/" className={hover}>
          Dashboard
        </Link>
        <Link to="/trade-admin" className={hover}>
          Trade
        </Link>
        <Link to="/key-admin" className={hover}>
          Key ACC
        </Link>
      </div>
    </>
  );
}
