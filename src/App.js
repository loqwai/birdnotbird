import { html } from "htm/preact";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

import { pickRandomBird } from "./pickRandomBird.js";
import { fetchBirds } from "./fetchBirds.js";

export const App = () => {
  const birds = useSignal();
  const bird = useSignal();
  const answer = useSignal();

  useEffect(async () => {
    birds.value = await fetchBirds();
    bird.value = pickRandomBird(birds.value);
  }, []);

  const onAnswerReal = () => {
    answer.value = "real";
  };

  const onAnswerFake = () => {
    answer.value = "fake";
  };

  if (!bird.value) return null;

  return html`<div class="App">
    <div class="Content">
      <h1 class="BirdName">${bird.value.name}</h1>
      <img
        src="https://cdn.royvandewater.com/birdnotbird/${bird.value.filename}"
      />

      ${answer.value
        ? html`<${Result}
            answer=${answer}
            correctAnswer=${bird.value.isReal ? "real" : "fake"}
          />`
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

const Result = ({ answer, correctAnswer }) => {
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
