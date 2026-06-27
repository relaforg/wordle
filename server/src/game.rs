use rand::seq::IndexedRandom;
use rocket::serde::Serialize;
use std::{collections::HashMap, sync::LazyLock};

static WORDS: LazyLock<Vec<String>> = LazyLock::new(|| {
    std::fs::read_to_string("words.txt")
        .expect("words.txt not found")
        .lines()
        .map(String::from)
        .collect()
});

#[derive(Clone, Serialize, PartialEq)]
#[serde(crate = "rocket::serde")]
pub enum GameStatus {
    Lose,
    InProgress,
    Win,
}

#[derive(Clone, Serialize, PartialEq)]
#[serde(crate = "rocket::serde")]
pub enum LetterState {
    NotFound,
    Found,
    Misplaced,
}

#[derive(Clone, Serialize)]
#[serde(crate = "rocket::serde")]
pub struct LetterStatus {
    char: char,
    pub status: LetterState,
}

#[derive(Clone, Serialize)]
#[serde(crate = "rocket::serde")]
pub struct GameStateView {
    game_status: GameStatus,
    board_state: Vec<Vec<LetterStatus>>,
}

impl From<GameState> for GameStateView {
    fn from(game_state: GameState) -> Self {
        GameStateView {
            game_status: game_state.game_status,
            board_state: game_state.board_state,
        }
    }
}

#[derive(Clone, Serialize)]
#[serde(crate = "rocket::serde")]
pub struct GameState {
    pub word: String,
    pub game_status: GameStatus,
    pub board_state: Vec<Vec<LetterStatus>>,
}

impl GameState {
    pub fn new() -> Self {
        GameState {
            word: WORDS
                .choose(&mut rand::rng())
                .expect("empty word list")
                .clone(),
            game_status: GameStatus::InProgress,
            board_state: Vec::new(),
        }
    }

    pub fn add_state(&mut self, word: &str) -> Vec<LetterStatus> {
        let mut occ = HashMap::new();
        for c in self.word.chars() {
            *occ.entry(c).or_insert(0) += 1;
        }
        let target: Vec<char> = self.word.chars().collect();
        let mut state = Vec::new();
        for (i, c) in word.chars().enumerate() {
            if c == target[i] {
                state.push(LetterStatus {
                    char: c,
                    status: LetterState::Found,
                });
                if let Some(count) = occ.get_mut(&c) {
                    *count -= 1;
                }
            } else if target.contains(&c) && occ.contains_key(&c) && occ[&c] > 0 {
                state.push(LetterStatus {
                    char: c,
                    status: LetterState::Misplaced,
                });
                if let Some(count) = occ.get_mut(&c) {
                    *count -= 1;
                }
            } else {
                state.push(LetterStatus {
                    char: c,
                    status: LetterState::NotFound,
                });
            }
        }

        self.board_state.push(state.clone());
        state
    }
}
