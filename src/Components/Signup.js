import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../API/index";

const Signup = () => {
  const [userData, setuserData] = useState({ username: "", password: "" });
  const [errorMessage, seterrorMessage] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [isSuccess, setisSuccess] = useState(false);

  const changeHandler = (event) => {
    setuserData({ ...userData, [event.target.name]: event.target.value });
  };

  const submit = async (event) => {
    event.preventDefault();
    const { username, password } = userData;

    if (username.length < 3 || password.length < 8)
      seterrorMessage("Username or password too small.");
    else {
      seterrorMessage("");
      setisLoading(true);
      setisSuccess(false);
      const data = await api.signup(userData);

      if (data.status === "ERROR") {
        setisLoading(false);
        seterrorMessage(data.message);
      } else if (data.status === "OK") {
        setisLoading(false);
        setisSuccess(true);
      }
    }
  };

  return (
    <div>
      {isSuccess && (
        <div className="bg-gray-800 w-full text-sm text-gray-300 font-bold shadow-sm mb-4 flex items-center gap-4">
          <span className="material-icons h-12 w-12 bg-green-500 flex justify-center items-center text-4xl">
            done
          </span>
          <span>
            User registered successfully.{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </span>
        </div>
      )}

      <div className="flex flex-col justify-between items-center p-8 text-sm bg-gray-800 shadow-md gap-4">
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
            <div>Sign Up</div>
          )}
        </button>

        <div className="w-full text-gray-300 mt-4 text-center">
          username: min 3 characters
          <br />
          password: min 8 characters
        </div>
      </div>
      <div className="w-full text-gray-300 p-4 text-center text-sm bg-gray-800 mt-4 shadow-md">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </div>
    </div>
  );
};

export default Signup;
