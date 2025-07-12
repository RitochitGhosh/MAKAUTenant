import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import UnauthenticatedPage from "./UnauthenticatedPage";

export default function PrivateRoute() {
  const currentUser = useSelector((state) => state.user.currentUser);

  return currentUser ? <Outlet /> : <UnauthenticatedPage />
}
