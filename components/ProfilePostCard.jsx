import { useEffect, useState } from "react";
import { Button, Col, Image, Row } from "react-bootstrap";
import axios from "axios";

export default function ProfilePostCard({ content, postId }) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false); // Track if user liked the post
  const pic = "https://pbs.twimg.com/profile_images/1587405892437221376/h167Jlb2_400x400.jpg";

  useEffect(() => {
    // Fetch initial likes count for the post
    fetch(`https://6cd0850f-8db1-4bea-8232-8e4cc4b8ec25-00-1iyw4r05fi4eq.pike.replit.dev:3000/posts/${postId}`)
      .then((response) => response.json())
      .then((data) => setLikes(data.length))
      .catch((error) => console.error("Error:", error));
  }, [postId]);

  // Optimistic update for likes
  const handleLike = () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("No auth token found");
      return;
    }

    const userId = JSON.parse(atob(token.split(".")[1])).id; // Decode token to get user ID

    // Optimistically update the UI
    setLiked(true);
    setLikes((prevLikes) => prevLikes + 1);

    // Send like to server
    axios
      .post("https://6cd0850f-8db1-4bea-8232-8e4cc4b8ec25-00-1iyw4r05fi4eq.pike.replit.dev:3000/likes", {
        user_id: userId,
        post_id: postId,
      })
      .then((response) => {
        console.log("Like added:", response.data);
      })
      .catch((error) => {
        console.error("Error liking post:", error);

        // Rollback UI if the request fails
        setLiked(false);
        setLikes((prevLikes) => prevLikes - 1);
      });
  };

  return (
    <Row
      className="p-3"
      style={{
        borderTop: "1px solid #D3D3D3",
        borderBottom: "1px solid #D3D3D3",
      }}
    >
      <Col sm={1}>
        <Image src={pic} fluid roundedCircle />
      </Col>

      <Col>
        <strong>Wallace</strong>
        <span> @wallace.wong · Jan 1</span>
        <p>{content}</p>
        <div className="d-flex justify-content-between">
          <Button variant="light">
            <i className="bi bi-chat"></i>
          </Button>
          <Button variant="light">
            <i className="bi bi-repeat"></i>
          </Button>
          <Button variant={liked ? "danger" : "light"} onClick={handleLike}>
            <i className={`bi ${liked ? "bi-heart-fill" : "bi-heart"}`}> {likes}</i>
          </Button>
          <Button variant="light">
            <i className="bi bi-graph-up"></i>
          </Button>
          <Button variant="light">
            <i className="bi bi-upload"></i>
          </Button>
        </div>
      </Col>
    </Row>
  );
}
