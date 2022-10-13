import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/home/Home";

function Routing() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<Home />} />

      {/* <Route path="/" element={<Home />} /> */}
    </Routes>
  );
}

export default Routing;
