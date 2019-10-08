import { Game, GameOptions } from "./types";

const baseUrl = `${process.env.BASE_URL || "http://localhost:3000"}/api`;

const apiRoutes = {
  game: (code?: string) => `game${code != null ? "/" + code : ""}`,
  categories: () => `trivia/categories`,
  difficulties: () => `trivia/difficulties`,
  allGameCodes: () => `games`,
  ping: () => `ping`,
};

const apiUrl = (path: string): string => `${baseUrl}/${path}`;

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

const handleJson = async (res: Response) => {
  if (res.status !== 200) {
    const err = await res.json();
    throw new Error(err.message);
  }

  return res.json();
};

const get = (path: string): Promise<any> =>
  fetch(path, {
    method: "GET",
    headers,
  }).then(handleJson);

const post = (path: string, body: any): Promise<any> =>
  fetch(path, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  }).then(handleJson);

export const createGame = (uid: string, options: GameOptions): Promise<Game> =>
  post(apiUrl(apiRoutes.game()), {
    uid,
    options,
  });

export const getCategories = (): Promise<string[]> =>
  get(apiUrl(apiRoutes.categories()));

export const getDifficulties = (): Promise<string[]> =>
  get(apiUrl(apiRoutes.difficulties()));

export const getAllGameCodes = (): Promise<string[]> =>
  get(apiUrl(apiRoutes.allGameCodes()));

export const ping = () => get(apiUrl(apiRoutes.ping()));
