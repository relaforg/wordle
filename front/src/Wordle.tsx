import { useEffect, useState } from "react";
import { Grid } from "./Grid";
import type { Feedback, Game, Letter } from "./Types";
import wordleIcon from "./assets/wordle-icon.svg";
import { Banner } from "./Banner";

export function Wordle() {
  const [currentWord, setCurrentWord] = useState<Letter[]>([]);
  const [game, setGame] = useState<Game>({
    word: "",
    game_status: "InProgress",
    board_state: [],
  });
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  async function setBoard(game: Game) {
    setGame(game);
    setCurrentWord([]);
    if (game.game_status == "Win") {
      setFeedback({ text: "Well done!", type: "Info" });
    } else if (game.game_status == "Lose") {
      setFeedback({ text: `The answer was: ${game.word}`, type: "Warning" });
    } else {
      setFeedback(null);
    }
  }

  async function resetGame() {
    try {
      const resetResponse = await fetch("/api/reset");

      if (!resetResponse.ok) {
        throw new Error(`Game reset failed: ${resetResponse.status}`);
      }

      const initResponse = await fetch("/api/init");

      if (!initResponse.ok) {
        throw new Error(`Game init failed: ${initResponse.status}`);
      }

      const game = await initResponse.json();

      setBoard(game);
    } catch (error) {
      setFeedback({ text: "Network error!", type: "Error" });
      console.error(error);
    }
  }

  function addInput(key: string, word: Letter[]) {
    if (key === "Backspace" && word.length > 0) {
      return word.slice(0, word.length - 1);
    }
    if (
      word.length < 5 &&
      key.length == 1 &&
      key.toLowerCase() >= "a" &&
      key.toLowerCase() <= "z"
    ) {
      return word.concat([{ char: key.toLowerCase(), status: "Guessing" }]);
    }
    return word;
  }

  useEffect(() => {
    async function fetchInitialData() {
      let game: Game;

      try {
        const response = await fetch("/api/init");

        if (!response.ok) {
          game = {
            word: "",
            game_status: "InProgress",
            board_state: [],
          };
          setGame(game);
          throw new Error(`Game init failed: ${response.status}`);
        }

        game = await response.json();
        setBoard(game);
      } catch (error) {
        setFeedback({ text: "Network error!", type: "Error" });
        console.error(error);
      }
    }
    fetchInitialData();
  }, []);

  useEffect(() => {
    const submitWord = async (word: Letter[]) => {
      if (word.length < 5) return;

      const payload = word.map((letter) => letter.char).join("");

      try {
        const response = await fetch("/api/guess", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: payload }),
        });

        if (response.status == 406) {
          setFeedback({
            text: "This word is not in the dictionnary.",
            type: "Warning",
          });
          return;
        }

        if (!response.ok) {
          throw new Error(`Word guessing error: ${response.status}`);
        }

        const game: Game = await response.json();
        setBoard(game);
      } catch (error) {
        setFeedback({ text: "Network error!", type: "Error" });
        console.log(error);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (game.game_status !== "InProgress") return;
      if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey)
        return;

      if (event.key === "Enter") {
        submitWord(currentWord);
      } else {
        if (event.key === "Backspace" && feedback) setFeedback(null);
        setCurrentWord((previous) => addInput(event.key, previous));
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [currentWord, feedback, game]);

  const displayBoard = game.board_state.concat([currentWord]);

  return (
    <>
      <div className="flex flex-col gap-3 min-h-screen justify-center items-center bg-amber-50">
        <div className="flex items-center gap-3 mb-3">
          <img src={wordleIcon} alt="Wordle Logo" className="h-16 w-16" />
          <h1 className="text-5xl font-bold">Wordle</h1>
        </div>
        <div>
          <Grid board={displayBoard} />
        </div>
        <div className="h-12 flex flex-col gap-2 items-center">
          <div>
            {feedback && <Banner text={feedback.text} type={feedback.type} />}
          </div>
          <div>
            {(game.game_status === "Win" || game.game_status === "Lose") && (
              <button
                className="
                rounded-lg bg-green-600 px-6 py-3
                font-bold text-white
                shadow-md transition-all duration-200
                hover:bg-green-700 hover:shadow-lg
                active:scale-95
                focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-green-500
                focus-visible:ring-offset-2
              "
                onClick={resetGame}
              >
                Play again
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Wordle;
