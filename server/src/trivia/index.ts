import fetch from "node-fetch";
import * as querystring from "querystring";
import { Question } from "../types";
import * as meta from "./meta";

export const getQuestion = async (
  category: string,
  difficulty: string,
): Promise<Question> => {
  const categoryCode = meta.categories[category];
  if (categoryCode == null) {
    throw new Error(`Invalid category`);
  }

  const difficultyCode = meta.difficulties[difficulty];
  if (difficultyCode == null) {
    throw new Error(`Invalid difficulty`);
  }

  const query: { [key: string]: any } = {
    amount: 1,
  };

  if (categoryCode !== -1) {
    query.category = categoryCode;
  }
  if (difficultyCode !== "all") {
    query.difficulty = difficultyCode;
  }

  const path = `https://opentdb.com/api.php?${querystring.stringify(query)}`;

  const question: Question = await fetch(path)
    .then(res => res.json())
    .then(json => {
      if (json.response_code !== 0) {
        throw new Error("Error fetching question");
      }

      return json.results[0];
    });

  return question;
};

export * from "./meta";
