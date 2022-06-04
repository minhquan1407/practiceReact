import {
  FETCH_USER_ERROR,
  FETCH_USER_LOGIN,
  FETCH_USER_SUCCESS,
  USER_LOGOUT,
  USER_REFRESH,
} from "../actions/userAction";
const INITIAL_STATE = {
  account: {
    email: "",
    auth: null,
    token: "",
  },
  isLoading: false,
  isError: false,
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_USER_LOGIN:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };

    case FETCH_USER_ERROR:
      return {
        ...state,
        account: {
          // này là đang ghi đè biến account ở trên, nó là 1 obj
          auth: false,
        },
        isLoading: false,
        isError: true,
      };
    case FETCH_USER_SUCCESS:
      console.log("check action:", action);
      return {
        ...state, //lí do .data vì ở bên userAction đang truyền đi 1 cái biến data
        account: {
          email: action.data.email,
          token: action.data.token,
          auth: true,
        },
        isLoading: false,
        isError: false,
      };
    case USER_LOGOUT:
      //Vì đây là API ảo,mà nếu API thật thì mỗi lần logout thì phải gọi API để server nó xóa cái session đi
      localStorage.removeItem("email");
      localStorage.removeItem("token");
      return {
        ...state,
        account: {
          email: "",
          token: "",
          auth: false,
        },
      };
    case USER_REFRESH:
      return {
        ...state,
        account: {
          email: localStorage.getItem("email"),
          token: localStorage.getItem("token"),
          auth: true,
        },
      };

    default:
      return state;
  }
};

export default userReducer;
