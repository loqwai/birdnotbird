import { pickRandomBird, toFilename } from "./pickRandomBird.js";
import { toKebabCase } from "remeda";

/**
 * Pick a bird from the list of all birds. If a bird id is provided in the url,
 * pick that bird. Otherwise, pick a random bird.
 *
 * @param {{realBirds: string[], fakeBirds: string[]}} allBirds
 * @param {string} urlBirdId
 * @returns {string}
 */
export const pickBird = (allBirds, urlBirdId) => {
  if (!urlBirdId) return pickRandomBird(allBirds);

  const realBird = findById(allBirds.realBirds, urlBirdId);

  if (realBird) {
    return {
      isReal: true,
      name: realBird,
      filename: toFilename(realBird),
    };
  }

  const fakeBird = findById(allBirds.fakeBirds, urlBirdId);

  if (fakeBird) {
    return {
      isReal: false,
      name: fakeBird,
      filename: toFilename(fakeBird),
    };
  }

  throw new Error(`Bird not found: ${urlBirdId}`);
};

/**
 * Find a bird by its id.
 *
 * @param {string[]} birds
 * @param {string} id
 * @returns {string | undefined}
 */
const findById = (birds, id) => {
  return birds.find((bird) => toKebabCase(bird) === id);
};
