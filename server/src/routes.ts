import * as Router from "koa-router";
import { createGame, createPlayer, randomCode } from "./games";
import logger from "./logger";
import { getGame, isCodeAvailable, saveGame } from "./store";
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
  const {
    uid,
    category,
    difficulty,
  }: {
    uid: string;
    category: string;
    difficulty: string;
  } = ctx.request.body;

  if (
    !verifyString(uid) ||
    !verifyString(category) ||
    !verifyString(difficulty)
  ) {
    ctx.throw(400, "Bad input");
    return;
  }

  let code = randomCode();
  let foundCode = false;
  for (let i = 0; i < 1000; i += 1) {
    if (isCodeAvailable(code)) {
      foundCode = true;
      break;
    }
    code = randomCode();
  }

  if (!foundCode) {
    logger.error("No code available");
    ctx.throw(500, "No code available");
    return;
  }

  const admin = createPlayer(uid, true);

  logger.info(`${admin.name} created game ${code}`);

  const game = createGame(admin, code, category, difficulty);
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
