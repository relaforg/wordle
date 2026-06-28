
export type LetterStatus = "Found"| "NotFound" | "Misplaced" | "Guessing";

export type Letter = {
  char: string;
  status: LetterStatus;
};

export type GameStatus = "Win"| "InProgress" | "Lose";

export type Game = {
    word: string,
    game_status: GameStatus,
    board_state: Letter[][]
}

export type Feedback = {
  text: string,
  type: "Info" | "Warning"| "Error"
}
