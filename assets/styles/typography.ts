import Typography from "typography";

const fontFamilies = [
  "-apple-system",
  "BlinkMacSystemFont",
  "Segoe UI",
  "Roboto",
  "Oxygen-Sans",
  "Ubuntu",
  "Cantarell",
  "Helvetica Neue",
  "sans-serif",
  "Apple Color Emoji",
  "Segoe UI Emoji",
  "Segoe UI Symbol",
];

const typography = new Typography({
  baseFontSize: "16px",
  baseLineHeight: 1.666,
  headerFontFamily: fontFamilies,
  bodyFontFamily: fontFamilies,
});

export default typography;
