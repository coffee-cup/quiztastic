import { createGame } from "../src/games";
import { categories, difficulties } from "../src/trivia";

describe("game", () => {
  it("creates new game with no players", () => {
    const game = createGame(
      "abc",
      Object.keys(categories)[0],
      Object.keys(difficulties)[0],
    );

    expect(game.players).toHaveLength(1);
    expect(game.players[0].id).toBe("abc");
  });
});
