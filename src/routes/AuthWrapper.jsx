import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export const AdminAuth = () => {
  const isAdmin = useSelector(state => state.user.isAdmin);
  return isAdmin ? <Outlet /> : <Navigate to="/login" />;
};
