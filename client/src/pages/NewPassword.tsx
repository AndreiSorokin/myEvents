import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import { useTheme } from "@/components/contextAPI/ThemeContext";
import { getThemeStyles } from "@/utils/themeUtils";
import { useParams } from "react-router-dom";

const NewPassword = () => {
  const { token } = useParams<{ token: string }>();
  const { theme } = useTheme();
  const { bgColor, fontColor } = getThemeStyles(theme);

  if (!token) {
    return <div>Error: Token is missing</div>;
  }

  return (
    <div className={`${bgColor} ${fontColor}`}>
      <ResetPasswordForm token={token} />
    </div>
  );
};

export default NewPassword;
