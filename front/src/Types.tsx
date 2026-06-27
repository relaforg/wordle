
export type LetterStatus = "Found"| "NotFound" | "Misplaced" | "Guessing";

export type Letter = {
  char: string;
  status: LetterStatus;
};

export type GameStatus = {
    game_status: number,
    board_state: Letter[][]
}
