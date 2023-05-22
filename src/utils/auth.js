import { Navigate, Outlet } from 'umi'
import Cookies from "js-cookie"

export default (props) => {
  const token = Cookies.get("token");
  if (token) {
    return <Outlet />;
  } else{
    return <Navigate to="/login" />;
  }

}
