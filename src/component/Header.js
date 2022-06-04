import { Container, Nav, NavDropdown } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import logo from "../assets/images/logo192.png";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useContext, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleLogoutRedux } from "../redux/actions/userAction";

const Header = (props) => {
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.account);

  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(handleLogoutRedux());

    // navigate("/");
    // toast.success("Log out success");
  };
  useEffect(() => {
    if (user && user.auth === false && window.location.pathname !== "/login") {
      navigate("/");
      toast.success("Log out success!");
    }
  }, [user]);
  //bên file userReducer set thằng auth: null bở vì
  //Khi mà mình logout thì nó sẽ bắn ra 1 cái toast success, Vì cái thằng user mới vào nó sẽ chạy lần đầu
  //Vì hén là 1 cái depedentce(thêm thành phần phụ thuc nó sẽ check cái biến này)
  // mà lần đầu thì nó lun bằng false nên hén chính là lí do hén có cái toast đó
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
