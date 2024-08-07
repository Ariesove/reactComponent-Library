import {
  useInteractions,
  useFloating,
  useHover,
  arrow,
  useClick,
  useDismiss,
  offset,
  FloatingArrow
} from '@floating-ui/react';
import { useRef, useState } from 'react';
 import './App.css'
export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null)
  const {refs, floatingStyles, context} = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware:[offset(10),arrow({
      element:arrowRef
    })],
 
  });
 
  // const hover = useHover(context);
  const click =useClick(context);
  const dismiss = useDismiss(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
  ]);

  return (
    <>
      <button ref={refs.setReference} {...getReferenceProps()}>
        hello
      </button>
      {
        isOpen && <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            光光光光光
                       <FloatingArrow ref={arrowRef} context={context} fill="#fff" stroke="#000" strokeWidth={1}/>
          </div>
      }

    </>
  );
}
