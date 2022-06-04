import axios from "axios";

const instance = axios.create({
  baseURL: "https://reqres.in",
});

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data ? response.data : { statusCode: response.status };
    // nếu nó kh rỗng thì lấy nó, còn kh thì lấy cái reponse.status
  },
  function (error) {
    // console.log("check error:", error);
    let res = {};
    // search: handle error axios
    if (error.response) {
      //đây dùng if là bởi vì error mà kh trả về phản hồi mà .response thì nó sẽ bị undefened, mà undefened mà .data thì ngũm lun ứng dụng
      // search: axios-handle-errors
      // Request made and server responded
      res.data = error.response.data;
      res.status = error.response.status;
      res.headers = error.response.headers;
    } else if (error.request) {
      // The request was made but no response was received
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return res;
    // return Promise.reject(error);
  }
);
export default instance;
