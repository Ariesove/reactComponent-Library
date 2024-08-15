import {
  FloatingArrow,
  arrow,
  offset,
  useClick,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
} from "@floating-ui/react";
import { useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
export interface PopoverProps {
  style?: React.CSSProperties;
  children?: React.ReactNode;
  direction: "top" | "right" | "bottom" | "left";
  content: React.ReactNode;
  trigger: "click" | "hover";
}

export default function PopoverComponent(props: PopoverProps) {
  const { direction = "top", content = "测试", trigger = "click" } = props;
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(10),
      arrow({
        element: arrowRef,
      }),
    ],
  });

  const hover = useHover(context);
  const click = useClick(context);
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    trigger === "click" ? click : hover,
    dismiss,
  ]);
  const floatingCom = isOpen && (
    <div ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
      {content}
      <FloatingArrow
        ref={arrowRef}
        context={context}
        fill="#fff"
        stroke="#000"
        strokeWidth={1}
      />
    </div>
  );
  // 这里不加memeo直接死死循环
  const float = useMemo(() => {
    const div = document.createElement("div");
    div.className = "wrapper";
    document.body.appendChild(div);
    return div;
  }, []);
  return (
    <>
      <button ref={refs.setReference} {...getReferenceProps()}>
        hello
      </button>
      {createPortal(floatingCom, float)}
    </>
  );
}
