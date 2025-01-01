import { useEffect, useState } from "react";
import { Button, Col, Image, Row } from "react-bootstrap";
import axios from "axios";

export default function ProfilePostCard({ content, postId }) {
  const [likes, setLikes] = useState(0);         // Count likes
  const [liked, setLiked] = useState(false);     // Track if liked by the user

  const BASE_URL = "https://6cd0850f-8db1-4bea-8232-8e4cc4b8ec25-00-1iyw4r05fi4eq.pike.replit.dev:3000";
  const pic = "https://pbs.twimg.com/profile_images/1587405892437221376/h167Jlb2_400x400.jpg";

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const userId = JSON.parse(atob(token.split(".")[1])).id;

      // Fetch likes and user status
      axios
        .get(`${BASE_URL}/likes/post/${postId}`)
        .then((res) => {
          setLikes(res.data.likes); // Set total likes count
          const userLiked = res.data.likedBy.includes(userId); // Check if user liked
          setLiked(userLiked); // Update liked state
        })
        .catch((error) => console.error("Error fetching likes:", error));
    }
  }, [postId]);

  // Handle Like/Unlike
  const handleLike = () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const userId = JSON.parse(atob(token.split(".")[1])).id;

    if (!liked) {
      // Like: Optimistic Update
      setLiked(true);
      setLikes((prevLikes) => prevLikes + 1);

      axios
        .post(`${BASE_URL}/likes`, {
          user_id: userId,
          post_id: postId,
        })
        .catch((error) => {
          console.error("Error liking post:", error);
          setLiked(false); // Rollback UI
          setLikes((prevLikes) => prevLikes - 1);
        });
    } else {
      // Unlike: Optimistic Update
      setLiked(false);
      setLikes((prevLikes) => prevLikes - 1);

      axios
        .delete(`${BASE_URL}/likes/${postId}`, { data: { user_id: userId } })
        .catch((error) => {
          console.error("Error unliking post:", error);
          setLiked(true); // Rollback UI
          setLikes((prevLikes) => prevLikes + 1);
        });
    }
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
          <Button
            variant={liked ? "danger" : "light"}
            onClick={handleLike}
          >
            <i className={`bi ${liked ? "bi-heart-fill" : "bi-heart"}`}>
              {" "}
              {likes}
            </i>
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
