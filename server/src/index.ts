import * as Koa from "koa";
import logger from "./logger";
import router from "./routes";

const PORT = process.env.PORT || 3000;

const app = new Koa();

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get("X-Response-Time");
  logger.info(`${ctx.method} ${ctx.url} - ${rt}`);
});

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set("X-Response-Time", `${ms}ms`);
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT, () => {
  logger.info(`Started server on port ${PORT}`);
});
