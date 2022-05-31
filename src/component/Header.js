import { Container, Nav, NavDropdown } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import logo from "../assets/images/logo192.png";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../Context/UserContext";

const Header = (props) => {
  // const [hideHeader, setHideHeader] = useState("");
  const { logout, user } = useContext(UserContext);
  //cái logout này là mình con bên trong thằng UserContext, bên trong thằng context chỗ value nó đang truyền đi 1 cái obj
  //bên trong obj đấy nó gồm 3 thứ, thứ nhất là biến user và 2 function
  // chúng ta lấy func logout là mún ám thị rằng đang dùng 1 biến obj và muốn lấy ra cái func bên trong cái biến obj đấy (ở đây là func logout)
  // chúng ta gọi thằng đến thằng useContext, và tại sao UserContext nó có thể export ra đc
  // bởi vì  bên component UserContext mình truyền nó như 1 cái props
  // Đây là t/d của useContext nó giúp chúng ta chia sẻ data bên trong ứng dụng React, mà kh phải tốn công truyền từ thằng cha xún con
  // Chúng ta đang tạo những cái biến global toàn cục

  // nếu 1 biến trong useContext thay đổi thì giao diện ta sẽ bị thay đổi theo
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Log out success");
  };
  // useEffect(() => {
  //   if (window.location.pathname === "/login") {
  //     setHideHeader(true);
  //   }
  // }, []);
  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">
            <img
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            />
            <span> Kuan ハンサム</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {((user && user.auth) || window.location.pathname === "/") && (
              //ban đầu ta chưa hề có cái thằng này (user && user.auth) thằng này bằng false
              //sau khi đã đăng nhập rồi nó sẽ tự động trở thành true đây chính là lí do nó hiện thanh header lên khi đăng nhập thành công
              <>
                <Nav className="me-auto">
                  <NavLink to="/" className="nav-link">
                    Home
                  </NavLink>
                  <NavLink to="/users" className="nav-link">
                    Manage-Users
                  </NavLink>
                </Nav>
                <Nav>
                  {user && user.email && (
                    <span className="nav-link">Welcome {user.email}</span>
                  )}
                  <NavDropdown title="Setting">
                    {user && user.auth === true ? (
                      <NavDropdown.Item onClick={() => handleLogout()}>
                        Logout
                      </NavDropdown.Item>
                    ) : (
                      <NavLink to="/login" className="dropdown-item">
                        Login
                      </NavLink>
                    )}
                  </NavDropdown>
                </Nav>
              </>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
