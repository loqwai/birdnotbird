import { capitalize, first, join, map } from "remeda";
import { pipe, piped, sample, split, toLowerCase } from "remeda";
import { fetchRealBirds, fetchFakeBirds } from "./fetchBirds.js";

const replaceAll = (pattern, replacement) => (str) => {
  return str.replaceAll(pattern, replacement);
};

const replace = (pattern, replacement) => (str) => {
  return str.replace(pattern, replacement);
};

const sample1 = piped(sample(1), first);
const capitalizeWords = piped(split(" "), map(capitalize()), join(" "));

const toFilename = piped(
  replaceAll(" ", "-"),
  replaceAll("'", ""),
  toLowerCase,
  replace(/$/, ".jpg")
);

export const pickRandomBird = ({ realBirds, fakeBirds }) => {
  const isReal = Math.random() < 0.5;
  const birds = isReal ? realBirds : fakeBirds;

  const name = pipe(birds, sample1, capitalizeWords);
  const filename = toFilename(name);

  return { name, isReal, filename };
};
