interface IProps {
  width?: string | number;
  height?: string | number;
}

export default function Spacer({ width, height }: IProps) {
  return (
    <div style={{ width: width ? width : 0, height: height ? height : 0 }} />
  );
}
