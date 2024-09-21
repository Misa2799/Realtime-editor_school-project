import { ReactNode } from "react";

type BtnProps = {
  children: ReactNode;
  onClick: () => void;
  className?: string;
};

export function Button({ children, onClick, className }: BtnProps) {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
}
