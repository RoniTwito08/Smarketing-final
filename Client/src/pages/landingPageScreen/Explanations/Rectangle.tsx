interface RectangleProps {
  backgroundColor: string;
  width: string;
  height: string;
  top: string;
  left: string;
  zIndex: string;
}

const Rectangle: React.FC<RectangleProps> = ({
  backgroundColor,
  width,
  height,
  top,
  left,
  zIndex,
}) => {
  return (
    <div
      className="rectangle"
      style={{
        backgroundColor,
        width,
        height,
        // top,
        // left,
        zIndex,
        // position: "absolute" as const,
        flexShrink: "0",
      }}
    ></div>
  );
};

export default Rectangle;
