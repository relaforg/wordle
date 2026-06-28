use std::collections::HashMap;

use rocket::{
    State,
    futures::lock::Mutex,
    get,
    http::{Cookie, CookieJar, Status},
    launch, post, routes,
    serde::{Deserialize, json::Json},
};
use uuid::Uuid;

use crate::game::{GameState, GameStateView, GameStatus, LetterState, WORDS};

mod game;

type Games = Mutex<HashMap<Uuid, GameState>>;

#[derive(Deserialize)]
#[serde(crate = "rocket::serde")]
struct Guess {
    data: String,
}

#[get("/")]
fn index() -> &'static str {
    "Wordle!"
}

#[get("/reset")]
async fn reset(cookies: &CookieJar<'_>, state: &State<Games>) -> Result<(), Status> {
    match cookies.get_private("id") {
        Some(id) => {
            state
                .lock()
                .await
                .remove(&Uuid::parse_str(id.value()).map_err(|_| Status::UnprocessableEntity)?);
            Ok(())
        }
        None => Err(Status::BadRequest),
    }
}

#[get("/init")]
async fn init(
    cookies: &CookieJar<'_>,
    state: &State<Games>,
) -> Result<Json<GameStateView>, Status> {
    match cookies.get_private("id") {
        Some(id) => {
            let id = Uuid::parse_str(id.value()).map_err(|_| Status::UnprocessableEntity)?;
            Ok(Json(GameStateView::from(
                state
                    .lock()
                    .await
                    .get(&id)
                    .unwrap_or(&GameState::new())
                    .clone(),
            )))
        }
        None => Ok(Json(GameStateView::from(GameState::new()))),
    }
}

#[post("/guess", data = "<body>")]
async fn guess(
    body: Json<Guess>,
    cookies: &CookieJar<'_>,
    state: &State<Games>,
) -> Result<Json<GameStateView>, Status> {
    let word = body.data.clone();
    if !WORDS.contains(&word) {
        return Err(Status::NotAcceptable);
    }
    let (id, mut game_state) = match cookies.get_private("id") {
        Some(id) => {
            let id = Uuid::parse_str(id.value()).map_err(|_| Status::UnprocessableEntity)?;
            (
                id,
                state
                    .lock()
                    .await
                    .entry(id)
                    .or_insert_with(GameState::new)
                    .clone(),
            )
        }
        None => {
            let id = Uuid::new_v4();
            cookies.add_private(Cookie::new("id", id.to_string()));
            (id, GameState::new())
        }
    };

    if game_state.board_state.len() >= 6 || game_state.game_status != GameStatus::InProgress {
        return Err(Status::BadRequest);
    }

    let new_state = game_state.add_state(&word);
    if new_state.iter().all(|s| s.status == LetterState::Found) {
        game_state.game_status = GameStatus::Win;
    } else if game_state.board_state.len() >= 6 {
        game_state.game_status = GameStatus::Lose;
    }

    state.lock().await.insert(id, game_state.clone());
    Ok(Json(GameStateView::from(game_state)))
}

#[launch]
fn rocket() -> _ {
    dotenvy::dotenv().ok();
    rocket::build()
        .manage(Mutex::new(HashMap::<Uuid, GameState>::new()))
        .mount("/", routes![index, reset, guess, init])
}
