import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { useParams } from "react-router-dom";

const NewPassword = () => {
  const { token } = useParams<{ token: string }>();
  if (!token) {
    return <div>Error: Token is missing</div>;
  }
  return (
    <>
      <ResetPasswordForm token={token} />
    </>
  );
};

export default NewPassword;
