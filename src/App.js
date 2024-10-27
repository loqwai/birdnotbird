import { html } from "htm/preact";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

import { fetchRandomBird } from "./fetchRandomBird.js";

export const App = () => {
  const data = useSignal(1);

  useEffect(async () => {
    data.value = await fetchRandomBird();
  }, []);

  if (!data.value) return null;

  return html`<div>
    <h1>${data.value.bird}</h1>
    <p>${data.value.isReal ? "Real" : "Fake"}</p>
  </div>`;
};
