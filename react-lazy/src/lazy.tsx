import React, { useEffect, useState } from "react";

type Props = {
  //可视区域高度
  height?: number;
  //容器宽度
  width?: number;
  //每一项高度
  itemSize?: number;
  // 总数量
  itemCount?: number;
  children?: React.ReactNode;
};

export const Lazy = (props: Props) => {
  const { itemSize = 10, height, itemCount, children, width } = props;
  const [scrollTop, setScrollTop] = useState(0);

  const handleScroll = (e: any) => {
    setScrollTop(e.currentTarget.scrollTop);
    
  };

  const getContainer = (scrollTop: number) => {
    //可视区域上边界
    let startIndex = Math.floor(scrollTop / parseInt(itemSize));
    // 缓冲区域上边界
    let cacheStartIndex = startIndex - 2;
    // 可视区能展示的元素的最大个数
    const numVisible = Math.ceil(height / itemSize);
    //下缓冲区结束边界
    let cacheEndIndex = startIndex + numVisible + 2;
    let items = [];
    for (let i = cacheStartIndex; i < cacheEndIndex; i++) {
      items.push(
        <div
          style={{ position: "absolute", top: i * itemSize, height: itemSize }}
        >
          {i}
        </div>
      );
    }
    return items;
  };


  return (
    <div
      style={{
        height: height,
        width: props.width,
        position: "relative",
        overflow: "auto",
      }}
      className="container"
      onScroll={(e) => {
        handleScroll(e);
      }}
    >
      {getContainer(scrollTop)}
    </div>
  );
};
