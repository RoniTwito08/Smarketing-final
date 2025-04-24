import ExplainPictures from "./ExplainPictures";

interface ExplainsProps {
  direction: "row" | "row-reverse"; //row= picture at the left side, row-reverse= picture at the right side
  imageSource: string;
  Header: string;
  text: React.ReactNode;
}

const Explainations: React.FC<ExplainsProps> = ({
  direction,
  imageSource,
  Header,
  text,
}) => {
  return (
    <div
      className="explain"
      style={{ ...styles.container, flexDirection: direction }}
    >
      <ExplainPictures
        direction={direction}
        imageSource={imageSource}
        text={Header}
      />

      <div className="text" style={styles.text}>
        {text}
      </div>
    </div>
  );
};

{
}

const styles = {
  container: {
    display: "flex",
    flexWrap: "wrap" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: "40px",
    // margin: "100px",
    padding: "0 100px",
  },

  text: {
    flex: "1 1 300px",
    fontSize: "24px",
    color: "#333",
  },
};

export default Explainations;
