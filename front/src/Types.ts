
export type LetterStatus = "Found"| "NotFound" | "Misplaced" | "Guessing";

export type Letter = {
  char: string;
  status: LetterStatus;
};

export type GameStatus = "Win"| "InProgress" | "Lose";

export type Game = {
    game_status: GameStatus,
    board_state: Letter[][]
}
