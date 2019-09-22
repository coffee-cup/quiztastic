import * as Koa from "koa";
import logger from "./logger";
import router from "./routes";
import * as bodyParser from "koa-bodyparser";
import * as cors from "@koa/cors";
import * as socket from "socket.io";
import * as http from "http";
import { setupSocketRoutes } from "./games";

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

setupSocketRoutes(io);

server.listen(PORT, () => {
  logger.info(`Started server on port ${PORT}`);
});
