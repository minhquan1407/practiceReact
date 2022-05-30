import { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import TableUsers from "../component/TableUsers";
import { UserContext } from "../Context/UserContext";
import { Alert } from "react-bootstrap";

const PrivateRoute = (props) => {
  const { user } = useContext(UserContext);

  if (user && !user.auth) {
    return (
      <>
        <Alert variant="danger" className="mt-3">
          <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
          <p>Hello bro! Bro login ik Bro 😍</p>
        </Alert>
      </>
    );
  }
  return <>{props.children}</>;
};

export default PrivateRoute;
