import { fetchRealBirds, fetchFakeBirds } from "./fetchBirds.js";

export const fetchRandomBird = async () => {
  const real = Math.random() < 0.5;

  const birds = real ? await fetchRealBirds() : await fetchFakeBirds();
  const bird = birds[Math.floor(Math.random() * birds.length)];
  const filename = bird
    .replaceAll(" ", "-")
    .replaceAll("'", "") // some birds have posessive names
    .toLowerCase();

  return { bird, isReal: real, filename };
};
