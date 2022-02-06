import React from "react";
import Login from "./Login";

const Homepage = () => {
  return (
    <div className="h-screen w-screen flex flex-col justify-start items-center">
      <h1 className="text-6xl text-gray-300 tracking-widest uppercase font-bold m-32 text-center">
        Untitled Project <span className="text-lg">v1.0</span>
      </h1>

      <Login />
    </div>
  );
};

export default Homepage;
