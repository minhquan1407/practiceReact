import { Routes, Route } from "react-router-dom";
import Home from "../component/Home";
import Login from "../component/Login";
import TableUsers from "../component/TableUsers";
import PrivateRoute from "./PrivateRoute";
import NotFound from "./NotFound";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        {/* <PrivateRoute path="/users">
          <TableUsers />
        </PrivateRoute> */}
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <TableUsers />
            </PrivateRoute>
          }
          //Cái thuộc tính element này nó iu cầu truyền vào 1 cái component
          //cho nên dù mình ghi cái j trong đấy nó cũng phải cần trả ra 1 cái component
          //Thành ra mún lấy component TableUsers nên đáy là lí do bên PrivateRoute sử dụng keyword {props.children}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
