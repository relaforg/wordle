import { Square } from "./Square";
import type { Letter } from "./Types";

interface RowProps {
  word: Letter[];
}

export function Row(props: RowProps) {
  const letterItems = [];
  for (let i = 0; i < 5; i++) {
    letterItems.push(
      <Square
        key={i}
        letter={
          props.word[i] ? props.word[i] : { char: "", status: "Guessing" }
        }
      />,
    );
  }
  return (
    <>
      <div className="flex flex-row gap-1">{letterItems}</div>
    </>
  );
}
