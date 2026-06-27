import { type LetterStatus, type Letter } from "./Types";

interface SquareProps {
  letter: Letter;
}

function getSquareColor(status: LetterStatus): string {
  switch (status) {
    case "Found":
      return "bg-green-400";
    case "NotFound":
      return "bg-gray-400";
    case "Misplaced":
      return "bg-yellow-400";
    case "Guessing":
      return "bg-gray-600";      
    default:
      return "bg-gray-600";
  }
}

export function Square(props: SquareProps) {
  const squareColor = getSquareColor(props.letter.status);
  return (
    <div className={`flex size-14 items-center justify-center ${squareColor} text-2xl font-bold text-white`}>
      {props.letter.char}
    </div>
  );
}
