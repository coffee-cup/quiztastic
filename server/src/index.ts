import * as cors from "@koa/cors";
import * as http from "http";
import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import * as socket from "socket.io";
import { setupSocketRoutes } from "./socket";
import logger from "./logger";
import router from "./routes";
import * as store from "./store";

const PORT = process.env.PORT || 3000;

const app = new Koa();

app.use(cors());
app.use(bodyParser());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = {
      status: err.status,
      message: err.message,
    };
    ctx.app.emit("error", err, ctx);
  }
});

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get("X-Response-Time");

  if (ctx.response.status !== 200) {
    logger.error(`${ctx.response.status} - ${ctx.method} ${ctx.url}`);
  } else {
    logger.info(`${ctx.method} ${ctx.url} - ${rt}`);
  }
});

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set("X-Response-Time", `${ms}ms`);
});

app.use(router.routes());
app.use(router.allowedMethods());

const server = http.createServer(app.callback());
const io = socket(server);

const uid = "5c0c2a2d-b38e-49a1-a907-48be9772f4c9";
store.saveGame({
  code: "hello",
  admin: uid,
  joinable: true,
  startDate: Date.now(),
  numQuestions: 0,
  isSuddenDeath: false,
  players: {
    [uid]: {
      id: uid,
      name: "Firefox",
      admin: true,
      lives: 3,
      ready: true,
    },
  },
  gameState: {
    type: "waiting",
  },
  options: {
    category: "All",
    difficulty: "All",
    startingLives: 3,
  },
});

setupSocketRoutes(io);

server.listen(PORT, () => {
  logger.info(`Started server on port ${PORT}`);
});
