import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import axios from "axios";
import useLocalStorage from "use-local-storage";

export default function ProfileEditPage() {
    const [bio, setBio] = useState("");
    const [image, setImage] = useState(null);
    const [authToken] = useLocalStorage("authToken", "");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("bio", bio);
        formData.append("profilePicture", image);

        try {
            await axios.post("https://your-backend-url/profile/edit", formData, {
                headers: {
                    Authorization: authToken,
                    "Content-Type": "multipart/form-data",
                },
            });
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <Container>
            <h2>Edit Profile</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Bio</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Profile Picture</Form.Label>
                    <Form.Control
                        type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </Form.Group>
                <Button type="submit" className="mt-3">
                    Save Changes
                </Button>
            </Form>
        </Container>
    );
}
