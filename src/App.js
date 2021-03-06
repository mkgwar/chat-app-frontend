import "./App.css";
import ChannelPage from "./Components/ChannelPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "./Components/Homepage";
import LoginPage from "./Components/LoginPage";
import SignupPage from "./Components/SignupPage";
import NotFoundPage from "./Components/NotFoundPage";

const App = () => {
  return (
    <div className="relative h-screen w-screen">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/channel/:channelName" element={<ChannelPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
