import { useTheme } from "@/components/contextAPI/ThemeContext";
import { getThemeStyles } from "@/utils/themeUtils";

const LandingPage = () => {
  const { theme } = useTheme();
  const { bgColor, fontColor } = getThemeStyles(theme);

  return (
    <div>
      <div
        className={`flex items-center justify-center h-screen ${bgColor} ${fontColor}`}
      >
        Landing page
      </div>
    </div>
  );
};

export default LandingPage;
