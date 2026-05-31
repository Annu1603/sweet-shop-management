import { useTheme } from "../context/ThemeContext";

export const useDark = () => {
  const { dark } = useTheme();
  return dark;
};