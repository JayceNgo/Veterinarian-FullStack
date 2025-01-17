import QRCode from "react-qr-code";

export function Code(props) {
  const size = props.size ?? 256;
  console.log(props.value);
  return (
    <QRCode
      size={size}
      style={{
        height: "auto",
        padding: "1rem",
        maxWidth: "100%",
        width: props.size ? "" : "100%",
      }}
      value={props.value}
      viewBox={`0 0 ${size} ${size}`}
    />
  );
}
