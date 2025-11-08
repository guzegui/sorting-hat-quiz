export type HouseKey = "g" | "r" | "h" | "s"; // Gryffindor, Ravenclaw, Hufflepuff, Slytherin

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
