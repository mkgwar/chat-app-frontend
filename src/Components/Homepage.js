import Login from "./Login";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Homepage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token") !== null) navigate("/channel/welcome");
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col justify-start items-center">
      <h1 className="text-6xl text-gray-300 tracking-widest uppercase font-bold m-32 text-center flex items-end gap-4">
        <div className="relative">
          <span className="absolute text-xs -top-4 right-0">
            Now send images!
          </span>
          Untitled Project
        </div>
        <span className="text-lg">v1.1</span>
      </h1>

      <Login />
    </div>
  );
};

export default Homepage;
