import React from "react";

// @function  UserContext
const UserContext = React.createContext({ email: "", auth: false });

// @function  UserProvider
// Create function to provide UserContext
const UserProvider = ({ children }) => {
  const [user, setUser] = React.useState({ email: "", auth: false });

  const loginContext = (email, token) => {
    setUser((user) => ({
      email: email,
      auth: true,
    }));
    //khi mà chạy vào cái hàm này thì nó sẽ cập nhập lại cái biến user cho mình
    localStorage.setItem("token", token);
    localStorage.setItem("email", token);
  };
  // những cái name đều đc thay bằng email hết bởi vì khi login thành công thì mình sẽ hiển thị email
  // Nếu như lưu vào localStorage thì đôi khi nó bị lộ, nên là chừ mình lưu nó vào trong cái biến global lun
  const logout = (email, token) => {
    localStorage.removeItem("token", token);
    localStorage.removeItem("email", token);
    // localStorage.removeItem("token");
    setUser((user) => ({
      email: "",
      auth: false,
    }));
  };
  // mỗi lần thay đổi giá trị của cái biến useContext thì ngay lập tức combonent bạn sẽ bị rerender lại những cái nới nào sử dụng biến đấy
  // biến đấy thay đổi giá trị thì ngày lập tức component ta bị render
  return (
    <UserContext.Provider value={{ user, loginContext, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };

// search : usecontext Dan Curtis
