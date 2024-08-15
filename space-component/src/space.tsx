import React from "react";
import classnames from "classnames";
// 能够去继承html 原生的一些属性
export interface SpaceProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  style?: React.CSSProperties;
  size?: SizeType;
}

export type SizeType = "small" | "middle" | "large" | number | undefined;

const sizeMap = {
  small: 8,
  middle: 16,
  large: 24,
};
const Space: React.FC<SpaceProps> = (props) => {
  const {
    className = "space-item",
    style,
    children,
    size,
    ...otherProps
  } = props;
  const childrenArray = React.Children.toArray(children);

  const classNames = classnames("space", "space-item", className);
  // 为什么非得用转成array
  const nodes = childrenArray.map((item) => {
    return <div className="space-item">{item}</div>;
  });

  const calSize = (second) => {
    return typeof size === 'string'? sizeMap[size] : (size || 0);
  };
  return (
    <div className={classNames} style={style} {...otherProps}>
      {nodes}
    </div>
  );
};

export default Space;
