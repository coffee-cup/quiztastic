import * as Router from "koa-router";
import { createGame } from "./games";
import { getGame, saveGame } from "./store";
import { categories, difficulties } from "./trivia";
import { verifyString } from "./verify";

const router = new Router();

router.get("/api/game/:code", async ctx => {
  const code: string = ctx.params.code;
  const game = getGame(code);

  if (game == null) {
    ctx.throw(404, "Game does not exist");
  }

  ctx.body = game;
});

router.post("/api/game", async ctx => {
  const { uid, category, difficulty } = ctx.request.body;

  if (
    !verifyString(uid) ||
    !verifyString(category) ||
    !verifyString(difficulty)
  ) {
    ctx.throw(400, "Bad input");
    return;
  }

  const game = createGame(uid, category, difficulty);
  saveGame(game);
  ctx.body = game;
});

router.get("/api/trivia/categories", async ctx => {
  ctx.body = Object.keys(categories);
});

router.get("/api/trivia/difficulties", async ctx => {
  ctx.body = Object.keys(difficulties);
});

export default router;
