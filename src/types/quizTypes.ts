export type HouseKey = "g" | "r" | "h" | "s"; 

export const houseNames: Record<HouseKey, string> = {
  g: "Gryffindor",
  r: "Ravenclaw",
  h: "Hufflepuff",
  s: "Slytherin",
};

export interface Scores {
  g: number;
  r: number;
  h: number;
  s: number;
}

export interface Answer {
  title: string;
  scores: Scores;
}

export interface Question {
  title: string;
  answers: Answer[];
}

export type ChatMsg = { role: "bot" | "user"; text: string; id: string; typing?: true };