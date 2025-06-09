import color from "color";

export function colorWithOpacity(colorValue: string, opacity: number) {
  // Validate opacity value
  if (opacity < 0 || opacity > 1) {
    throw new Error("Opacity value must be between 0 and 1.");
  }

  try {
    const colorObject = color(colorValue);
    return colorObject.alpha(opacity).rgb().string();
  } catch (error) {
    throw new Error(
      "Invalid color format. Please use a valid hex, RGB, or named color."
    );
  }
}
