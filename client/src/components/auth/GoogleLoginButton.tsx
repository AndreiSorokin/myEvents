import { CustomError } from "@/misc/error";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const GoogleLoginButton: React.FC = () => {
  const navigate = useNavigate();
  const handleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) {
      toast.error("Login failed. No credential received.");
      return;
    }
    try {
      // Send the Google ID token to the backend
      const res = await fetch(
        "http://localhost:3003/api/v1/auth/google-login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: response.credential }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        // Store tokens and navigate to home page
        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
        toast.success("Login successful!");
        navigate("/events");

        // You can add a navigation logic here if needed
      } else {
        const errorData = await res.json();
        toast.error(`Login failed: ${errorData.message}`);
      }
    } catch (error) {
      const err = error as CustomError;
      toast.error(
        "Login failed. Please try again. Error: " + err.data?.message
      );
    }
  };

  const handleError = () => {
    toast.error("Google login failed. Please try again.");
  };

  return <GoogleLogin onSuccess={handleSuccess} onError={handleError} />;
};

export default GoogleLoginButton;
