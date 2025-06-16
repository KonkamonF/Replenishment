import React from "react";
import { Link } from "react-router-dom";

export default function Side() {
  return (
    <>
      <div className="flex flex-col">
        <Link to={"/"}>Dashboard</Link>
        <Link to={"trade-admin"}>Trade</Link>
        <Link to={"key-admin"}>Key ACC</Link>
      </div>
    </>
  );
}
