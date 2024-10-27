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

export const fetchRandomBird = async () => {
  const isReal = Math.random() < 0.5;

  const birds = isReal ? await fetchRealBirds() : await fetchFakeBirds();

  const bird = pipe(birds, sample1, capitalizeWords);

  const filename = toFilename(bird);

  console.log(bird, isReal, filename);

  return { bird, isReal, filename };
};
