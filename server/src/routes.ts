import * as Router from "koa-router";
import { createGame } from "./games";
import { getGame, saveGame } from "./store";

const router = new Router();

router.get("/api/game/:code", async ctx => {
  const code: string = ctx.params.code;
  const game = getGame(code);

  if (game == null) {
    ctx.res.statusCode = 404;
    return;
  }

  ctx.body = game;
});

router.post("/api/game", async ctx => {
  const game = createGame([]);
  saveGame(game);

  ctx.body = game;
});

export default router;
