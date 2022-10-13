import { Navigate } from "react-router-dom";
const PrivateRoute = ({ children, redirectTo }) => {
  const auth = JSON.parse(localStorage.getItem("token"));
  return auth ? children : <Navigate to={redirectTo} />;
};

export default PrivateRoute;
