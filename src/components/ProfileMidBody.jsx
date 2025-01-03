import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Button, Col, Image, Nav, Row, Spinner } from "react-bootstrap";
import ProfilePostCard from "./ProfilePostCard";
import { fetchPostsByUser } from "../features/posts/postsSlice";
import { useDispatch, useSelector } from "react-redux";

export default function ProfileMidBody() {
  // const [posts, setPosts] = useState([]);
  const url = "https://pbs.twimg.com/profile_banners/44196397/1726163678/1500x500";
  const pic = "https://pbs.twimg.com/profile_images/1874558173962481664/8HSTqIlD_400x400.jpg";

  // // Fetch posts based on user id
  // const fetchPosts = (userId) => {
  //   fetch(`https://6cd0850f-8db1-4bea-8232-8e4cc4b8ec25-00-1iyw4r05fi4eq.pike.replit.dev:3000/posts/user/${userId}`)
  //   .then((response) => response.json())
  //   .then((data) => setPosts(data))
  //   .catch((error) => console.error("Error:", error));
  // }

// const dispatch = useDispatch();
const posts = useSelector(store => store.posts.posts)
const loading = useSelector(store => store.posts.loading)

  // useEffect(() => {
  //   const token = localStorage.getItem("authToken");
  //   if (token) {
  //     const decodedToken = jwtDecode(token);
  //     const userId = decodedToken.id;
  //     dispatch(fetchPostsByUser(userId));
  //   }
  // }, [dispatch]);


  return (
    <Col sm={6} className="bg-light" style={{ border: "1px solid lightgrey" }}>
      <Image src={url} fluid />
      <br />
      <Image
        src={pic}
        roundedCircle
        style={{
          width: 150,
          position: "absolute",
          top: "140px",
          border: "4px solid #F8F9FA",
          marginLeft: 15,
        }}
      />

      <Row className="justify-content-end">
        <Col xs="auto">
          <Button className="rounded-pill mt-2" variant="outline-secondary">
            Edit Profile
          </Button>
        </Col>
      </Row>

      <p className="mt-5" style={{ margin: 0, fontWeight: "bold", fontSize: "15px" }}>
        Elon Musk
      </p>

      <p style={{ marginBottom: "2px"}}>@elon.musk</p>

      <p>I help people switch careers to be a software developer at sigmaschool.co</p>

      <p>Entrepreneur</p>

      <p>
        <strong>271</strong> Following <strong>610</strong> Followers
      </p>

      <Nav variant="underline" defaultActiveKey="/home" justify>
        <Nav.Item>
          <Nav.Link eventKey="/home">Tweets</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-1">Replies</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-2">Highlights</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-3">Media</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-4">Likes</Nav.Link>
        </Nav.Item>
      </Nav>
      {loading && <Spinner animation="border" className="ms-3 mt-3" variant="primary"/>}
      {posts.length > 0 && posts.map((post) => (
        <ProfilePostCard key={post.id} content={post.content} postId={post.id}/>
      ))}
    </Col>
  )
}