import { getAuth } from "firebase/auth";
import { useContext, useEffect } from "react";
import { Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";
import useLocalStorage from "use-local-storage";
import ProfileSideBar from "../components/ProfileSideBar";
import ProfileMidBody from "../components/ProfileMidBody";
import { auth } from "../firebase";

// export default function ProfilePage() {
//   const [authToken, setAuthToken] = useLocalStorage("authToken", "");
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!authToken) navigate("/login");
//   }, [authToken, navigate]);
//   const handleLogout = () => setAuthToken("");

export default function ProfilePage() {
  const auth = getAuth();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);


if (!currentUser) {
  navigate("/login");
}

const handleLogout = () => {
  auth.signOut();
};

  return (
    <>
      <Container>
        <Row>
          <ProfileSideBar handleLogout={handleLogout} />
          <ProfileMidBody />
        </Row>
      </Container>
    </>
  );
}