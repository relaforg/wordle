import { useEffect, useState } from "react";
import { Grid } from "./Grid";
import { type GameStatus, type Letter } from "./Types";

export function Wordle() {
  const currentBoard: Letter[][] = [
    [
      { char: "t", status: "Found" },
      { char: "e", status: "NotFound" },
      { char: "s", status: "Misplaced" },
      { char: "t", status: "Misplaced" },
      { char: "s", status: "NotFound" },
    ],
    [
      { char: "t", status: "Found" },
      { char: "e", status: "NotFound" },
      { char: "s", status: "Misplaced" },
      { char: "t", status: "Misplaced" },
      { char: "s", status: "NotFound" },
    ],
    [
      { char: "t", status: "Found" },
      { char: "e", status: "NotFound" },
      { char: "s", status: "Misplaced" },
      { char: "t", status: "Misplaced" },
      { char: "s", status: "NotFound" }
    ],
    [
      { char: "t", status: "Found" },
      { char: "e", status: "NotFound" },
      { char: "s", status: "Misplaced" },
      { char: "t", status: "Misplaced" },
      { char: "s", status: "NotFound" },
    ],
  ];

  const gameStatus: GameStatus = {
    "game_status": 0,
    "board_state": currentBoard
  }

  function addInput(key: string, word: Letter[]) {
    if (key == "Backspace" && word.length > 0) {
      return word.slice(0, word.length - 1);
    }
    if (word.length < 5 && key.length == 1 && key.toLowerCase() >= "a" && key <= "z") {
      return word.concat([{ char: key.toLowerCase(), status: "Guessing" }]);
    }
    return word;
  }

  const [currentWord, setCurrentWord] = useState([])


  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      console.log(event.key);
      setCurrentWord((previous) => addInput(event.key, previous));
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const displayBoard = currentBoard.concat([currentWord]);
  console.log(displayBoard);
  return (
    <>
      <section
        id="wordle_grid"
        className="flex min-h-screen justify-center items-center"
      >
        <Grid board={displayBoard} />
      </section>
    </>
  );
}

export default Wordle;
