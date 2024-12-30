import { useEffect, useState } from "react";
import { Button, Container, ListGroup } from "react-bootstrap";
import axios from "axios";
import useLocalStorage from "use-local-storage";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [authToken] = useLocalStorage("authToken", "");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get("https://your-backend-url/users", {
                    headers: { Authorization: authToken },
                });
                setUsers(res.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, [authToken]);

    const handleFollow = async (userId) => {
        try {
            await axios.post(
                `https://your-backend-url/users/${userId}/follow`,
                {},
                { headers: { Authorization: authToken } }
            );
            alert("Followed successfully!");
        } catch (error) {
            console.error("Error following user:", error);
        }
    };

    const handleUnfollow = async (userId) => {
        try {
            await axios.post(
                `https://your-backend-url/users/${userId}/unfollow`,
                {},
                { headers: { Authorization: authToken } }
            );
            alert("Unfollowed successfully!");
        } catch (error) {
            console.error("Error unfollowing user:", error);
        }
    };

    return (
        <Container>
            <h2>All Users</h2>
            <ListGroup>
                {users.map((user) => (
                    <ListGroup.Item key={user.id}>
                        {user.username}
                        <Button
                            className="ms-3"
                            onClick={() =>
                                user.isFollowing
                                    ? handleUnfollow(user.id)
                                    : handleFollow(user.id)
                            }
                        >
                            {user.isFollowing ? "Unfollow" : "Follow"}
                        </Button>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Container>
    );
}
