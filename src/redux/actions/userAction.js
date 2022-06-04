import { toast } from "react-toastify";
import { loginApi } from "../../services/UserServices";

export const USER_LOGIN = "USER_LOGIN";
export const USER_LOGOUT = "USER_LOGOUT";
export const USER_REFRESH = "USER_REFRESH";

export const FETCH_USER_LOGIN = "FETCH_USER_LOGIN";
export const FETCH_USER_ERROR = "FETCH_USER_ERROR";
export const FETCH_USER_SUCCESS = "FETCH_USER_SUCCESS";

export const handleLoginRedux = (email, password) => {
  return async (dispatch, getState) => {
    //dispath cái keyword này để mình có thể thao tác giữa thằng react và thằng redux
    //getState trả ra cái thằng state hiện tại của redux
    dispatch({ type: FETCH_USER_LOGIN });
    let res = await loginApi(email.trim(), password);
    // console.log(">>> check res: ", res);
    if (res && res.token) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("email", email.trim());
      dispatch({
        type: FETCH_USER_SUCCESS,
        data: { email: email.trim(), token: res.token },
      });
    } else {
      //error
      if (res && res.status === 400) {
        toast.error(res.data.error);
      }
      dispatch({
        type: FETCH_USER_ERROR,
      });
    }
  };
};

export const handleLogoutRedux = () => {
  return (dispatch, getState) => {
    dispatch({
      type: USER_LOGOUT,
    });
  };
};

export const handleRefresh = () => {
  //mỗi lần mà đi làm thì Refresh lại thi phải call API để nạp vào thằng redux thì chúng ta bắt đầu lại từ đầu
  return (dispatch, getState) => {
    dispatch({
      type: USER_REFRESH,
    });
  };
};
