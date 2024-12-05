/**
 * Fetch the birds from the server
 * @returns {Promise<{realBirds: string[], fakeBirds: string[]}>}
 */
export const fetchBirds = async () => {
  const [realBirds, fakeBirds] = await Promise.all([
    fetchRealBirds(),
    fetchFakeBirds(),
  ]);
  return { realBirds, fakeBirds };
};

export const fetchRealBirds = async () => {
  const response = await fetch("/assets/real-birds.txt");
  return processBirds(await response.text());
};

export const fetchFakeBirds = async () => {
  const response = await fetch("/assets/fake-birds.txt");
  return processBirds(await response.text());
};

const processBirds = (text) => {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
};
