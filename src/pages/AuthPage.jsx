import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";

import { useEffect, useState, useContext } from "react";
import { Button, Col, Form, Image, Modal, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthProvider";

export default function AuthPage() {
  const loginImage = "https://sig1.co/img-twitter-1";

  const [modalShow, setModalShow] = useState(null); // Modal control
  const handleShowSignUp = () => setModalShow("signup");
  const handleShowLogin = () => setModalShow("login");
  const handleShowReset = () => setModalShow("reset");
  const [email, setEmail] = useState(""); // Email input
  const [password, setPassword] = useState(""); // Password input
  const [errorMessage, setErrorMessage] = useState(""); // Error message state
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const navigate = useNavigate();
  const auth = getAuth();
  const { currentUser } = useContext(AuthContext);

  // Redirect to profile if user is logged in
  useEffect(() => {
    if (currentUser) navigate("/profile");
  }, [currentUser, navigate]);

  // Handle Signup
  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear errors
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User signed up:", res.user);
    } catch (error) {
      console.error("Signup Error:", error);
      handleAuthError(error.code); // Handle specific errors
    }
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear errors
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login Error:", error);
      handleAuthError(error.code); // Handle specific errors
    }
  };

  // Handle Social Logins
  const handleSocialLogin = async (provider) => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Social Login Error:", error);
      setErrorMessage("Failed to login with social account.");
    }
  };

  // Handle Password Reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setResetMessage("");
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMessage("Password reset email sent successfully.");
    } catch (error) {
      console.error("Password Reset Error:", error);
      setResetMessage("Failed to send password reset email.");
    }
  };

  // Handle Firebase Auth Errors
  const handleAuthError = (code) => {
    switch (code) {
      case "auth/email-already-in-use":
        setErrorMessage("Email is already in use.");
        break;
      case "auth/invalid-email":
        setErrorMessage("Invalid email format.");
        break;
      case "auth/weak-password":
        setErrorMessage("Password must be at least 6 characters.");
        break;
      case "auth/user-not-found":
        setErrorMessage("User not found. Please check your email.");
        break;
      case "auth/wrong-password":
        setErrorMessage("Incorrect password. Please try again.");
        break;
      case "auth/too-many-requests":
        setErrorMessage("Too many failed attempts. Try again later.");
        break;
      default:
        setErrorMessage("Authentication failed. Please try again.");
        break;
    }
  };

  const handleClose = () => setModalShow(null);

  return (
    <Row>
      <Col sm={6}>
        <Image src={loginImage} fluid />
      </Col>
      <Col sm={6} className="p-4">
        <i
          className="bi bi-twitter"
          style={{ fontSize: 50, color: "dodgerblue" }}
        ></i>

        <p className="mt-5" style={{ fontSize: 64 }}>Happening Now</p>
        <h2 className="my-5" style={{ fontSize: 31 }}>Join Twitter today.</h2>

        <Col sm={5} className="d-grid gap-2">
          <Button
            className="rounded-pill"
            variant="outline-primary"
            onClick={handleShowSignUp}
          >
            Create an account
          </Button>
          <p style={{ fontSize: "12px" }}>By signing up, you agree to the terms.</p>
          <p className="mt-5" style={{ fontWeight: "bold" }}>
            Already have an account?
          </p>
          <Button
            className="rounded-pill"
            variant="outline-primary"
            onClick={handleShowLogin}
          >
            Sign in
          </Button>

          <div className="d-flex justify-content-center mt-3">
              <Button
                variant="outline-secondary"
                className="rounded-circle mx-2"
                onClick={() => handleSocialLogin(new GoogleAuthProvider())}
              >
                <i className="bi bi-google"></i>
              </Button>
              <Button
                variant="outline-secondary"
                className="rounded-circle mx-2"
                onClick={() => handleSocialLogin(new OAuthProvider("apple.com"))}
              >
                <i className="bi bi-apple"></i>
              </Button>
              <Button
                variant="outline-secondary"
                className="rounded-circle mx-2"
                onClick={() => handleSocialLogin(new FacebookAuthProvider())}
              >
                <i className="bi bi-facebook"></i>
              </Button>
            </div>

        </Col>

        <Modal
          show={modalShow === "login"}
          onHide={handleClose}
          animation={false}
          centered
        >
          <Modal.Body>
            <h2 className="mb-4" style={{ fontWeight: "bold" }}>
              Log in to your account
            </h2>

            {errorMessage && (
              <p className="text-danger text-center mb-3">
                {errorMessage}
              </p>
            )}

            <Form className="d-grid gap-2 px-5" onSubmit={handleLogin}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Enter email"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Control
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Password"
                />
              </Form.Group>

              <Button className="rounded-pill" type="submit">
                Log in
              </Button>
            </Form>

            <Button
              className="rounded-pill mt-3 d-grid mx-auto"
              variant="outline-secondary"
              onClick={handleShowReset}
            >
              Reset Password via Email
            </Button>
          </Modal.Body>
        </Modal>

        <Modal
          show={modalShow === "reset"}
          onHide={handleClose}
          animation={false}
          centered
        >
          <Modal.Body>
            <h2 className="mb-4" style={{ fontWeight: "bold" }}>
              Reset Password
            </h2>

            {resetMessage && (
              <p className="text-success text-center mb-3">
                {resetMessage}
              </p>
            )}

            <Form className="d-grid gap-2 px-5" onSubmit={handlePasswordReset}>
              <Form.Group className="mb-3" controlId="formResetEmail">
                <Form.Control
                  onChange={(e) => setResetEmail(e.target.value)}
                  type="email"
                  placeholder="Enter email"
                />
              </Form.Group>

              <Button className="rounded-pill" type="submit">
                Send Reset Password Email
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        <Modal
          show={modalShow === "signup"}
          onHide={handleClose}
          animation={false}
          centered
        >
          <Modal.Body>
            <h2 className="mb-4" style={{ fontWeight: "bold" }}>
              Create your account
            </h2>

            {errorMessage && (
              <p className="text-danger text-center mb-3">
                {errorMessage}
              </p>
            )}

            <Form className="d-grid gap-2 px-5" onSubmit={handleSignUp}>
              <Form.Group className="mb-3" controlId="formSignUpEmail">
                <Form.Control
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Enter email"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formSignUpPassword">
                <Form.Control
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Password"
                />
              </Form.Group>

              <Button className="rounded-pill" type="submit">
                Sign Up
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Col>
    </Row>
  );
}
