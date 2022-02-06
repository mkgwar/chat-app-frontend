import { useState } from "react";
import api from "../API/index";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [userData, setuserData] = useState({ username: "", password: "" });
  const [errorMessage, seterrorMessage] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const navigate = useNavigate();

  const changeHandler = (event) => {
    setuserData({ ...userData, [event.target.name]: event.target.value });
  };

  const submit = async (event) => {
    event.preventDefault();
    setisLoading(true);
    const data = await api.signin(userData);
    setisLoading(false);

    if (data.status === "ERROR") {
      seterrorMessage(data.message);
    } else if (data.status === "OK") {
      localStorage.setItem("token", data.token);
      navigate("/channel/welcome");
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-between text-sm items-center p-8 bg-gray-800 shadow-md gap-4">
        <input
          type="text"
          placeholder="username"
          name="username"
          className="focus:outline-0 w-60 p-2 text-gray-300 bg-black"
          onChange={changeHandler}
        />
        <input
          type="password"
          placeholder="password"
          name="password"
          className="focus:outline-0 w-60 p-2 text-gray-300 bg-black"
          onChange={changeHandler}
        />

        <div className="text-red-500 w-full text-center">{errorMessage}</div>

        <button
          onClick={submit}
          className="focus:outline-0 w-60 h-12 text-gray-300 bg-gray-700 font-bold shadow-md"
        >
          {isLoading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="loading w-2 h-2 bg-gray-300 rounded-full relative" />
            </div>
          ) : (
            <div>Login</div>
          )}
        </button>
      </div>
      <div className="w-full text-gray-300 p-4 text-center bg-gray-800 mt-4 text-sm shadow-md">
        Don't have an account?{" "}
        <Link to="/signup" className="text-blue-500 hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default Login;
