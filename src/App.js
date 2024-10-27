import { html } from "htm/preact";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

import { fetchRandomBird } from "./fetchRandomBird.js";

export const App = () => {
  const data = useSignal();
  const answer = useSignal();

  useEffect(async () => {
    data.value = await fetchRandomBird();
  }, []);

  const onAnswerReal = () => {
    answer.value = "real";
  };

  const onAnswerFake = () => {
    answer.value = "fake";
  };

  if (!data.value) return null;

  return html`<div class="App">
    <div class="Content">
      <h1 class="BirdName">${data.value.bird}</h1>
      <img
        src="https://cdn.royvandewater.com/birdnotbird/${data.value.filename}"
      />

      ${answer.value
        ? html`<${Result} answer=${answer} data=${data} />`
        : html`<${Chooser}
            onAnswerReal=${onAnswerReal}
            onAnswerFake=${onAnswerFake}
          /> `}
    </div>
  </div>`;
};

const Chooser = ({ onAnswerReal, onAnswerFake }) => {
  return html`<div>
    <button className="Real Choice" onClick=${onAnswerReal}>Real</button>
    <button className="Fake Choice" onClick=${onAnswerFake}>Fake</button>
  </div>`;
};

const Result = ({ answer, data }) => {
  const correctAnswer = data.value.isReal ? "real" : "fake";

  if (answer.value === correctAnswer) {
    return html`<div>
      <h1>Correct!</h1>
      <p>This bird is <strong>${correctAnswer}</strong>!</p>
    </div>`;
  }

  return html`<div>
    <h1>Wrong!</h1>
    <p>This bird is actually <strong>${correctAnswer}</strong>!</p>
  </div>`;
};
