import { useEffect, useState } from "react";
import { Button, Col, Image, Row, Form } from "react-bootstrap";
import axios from "axios";

export default function ProfilePostCard({ content, postId, userId, onPostDelete }) {
  const [likes, setLikes] = useState(0);         // Count likes
  const [liked, setLiked] = useState(false);     // Track if liked by the user
  const [isEditing, setIsEditing] = useState(false); // Track edit mode
  const [updatedContent, setUpdatedContent] = useState(content); // Editable content

  const BASE_URL = "https://6cd0850f-8db1-4bea-8232-8e4cc4b8ec25-00-1iyw4r05fi4eq.pike.replit.dev:3000";
  const pic = "https://pbs.twimg.com/profile_images/1873974185766060032/gRZc3N-3_400x400.jpg";

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const currentUserId = JSON.parse(atob(token.split(".")[1])).id;

      // Fetch likes and user status
      axios
        .get(`${BASE_URL}/likes/post/${postId}`)
        .then((res) => {
          setLikes(res.data.likes); // Total likes count
          const userLiked = res.data.likedBy.includes(currentUserId);
          setLiked(userLiked); // Set liked state
        })
        .catch((error) => console.error("Error fetching likes:", error));
    }
  }, [postId]);

  // Handle Like/Unlike
  const handleLike = () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const currentUserId = JSON.parse(atob(token.split(".")[1])).id;

    if (!liked) {
      setLiked(true);
      setLikes((prevLikes) => prevLikes + 1);

      axios
        .post(`${BASE_URL}/likes`, {
          user_id: currentUserId,
          post_id: postId,
        })
        .catch((error) => {
          console.error("Error liking post:", error);
          setLiked(false);
          setLikes((prevLikes) => prevLikes - 1);
        });
    } else {
      setLiked(false);
      setLikes((prevLikes) => prevLikes - 1);

      axios
        .delete(`${BASE_URL}/likes/${postId}`, { data: { user_id: currentUserId } })
        .catch((error) => {
          console.error("Error unliking post:", error);
          setLiked(true);
          setLikes((prevLikes) => prevLikes + 1);
        });
    }
  };

  // Update Post
  const handleUpdate = () => {
    axios
      .put(`${BASE_URL}/posts/${postId}`, {
        title: "Updated Post",
        content: updatedContent,
        user_id: userId, // Validate ownership
      })
      .then(() => {
        setIsEditing(false); // Exit edit mode
      })
      .catch((error) => console.error("Error updating post:", error));
  };

  // Delete Post
  const handleDelete = () => {
    axios
      .delete(`${BASE_URL}/posts/${postId}`, { data: { user_id: userId } })
      .then(() => {
        onPostDelete(postId); // Notify parent to remove from UI
      })
      .catch((error) => console.error("Error deleting post:", error));
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

        {isEditing ? (
          <Form.Control
            as="textarea"
            rows={2}
            value={updatedContent}
            onChange={(e) => setUpdatedContent(e.target.value)}
          />
        ) : (
          <p>{updatedContent}</p>
        )}

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

          {userId && (
            <>
              <Button
                variant="info"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel" : "Edit"}
              </Button>
              {isEditing ? (
                <Button variant="success" onClick={handleUpdate}>
                  Save
                </Button>
              ) : (
                <Button variant="danger" onClick={handleDelete}>
                  Delete
                </Button>
              )}
            </>
          )}
        </div>
      </Col>
    </Row>
  );
}
