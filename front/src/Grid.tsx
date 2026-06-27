import { Row } from "./Row";
import type { Letter } from "./Types";

interface GridProps {
  board: Letter[][];
}

export function Grid(props: GridProps) {
  const rowItems = [];
  for (let i = 0; i < 6; i++) {
    rowItems.push(<Row key={i} word={props.board[i] ? props.board[i] : []} />);
  }
  return (
    <>
      <div className="flex flex-col gap-1">{rowItems}</div>
    </>
  );
}
