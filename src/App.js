import { html } from "htm/preact";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { toKebabCase } from "remeda";

import { pickBird } from "./pickBird.js";
import { fetchBirds } from "./fetchBirds.js";

export const App = () => {
  const allBirds = useSignal();
  const currentBird = useSignal();
  const answer = useSignal();

  useEffect(async () => {
    allBirds.value = await fetchBirds();

    const url = new URL(window.location);
    const urlBirdId = url.searchParams.get("bird");
    currentBird.value = pickBird(allBirds.value, urlBirdId);
    window.history.replaceState({}, "", buildUrl(currentBird.value.name));
  }, []);

  const onAnswerReal = () => {
    answer.value = "real";
  };

  const onAnswerFake = () => {
    answer.value = "fake";
  };

  const onClickReset = () => {
    answer.value = null;
    currentBird.value = pickBird(allBirds.value, undefined);
    window.history.pushState({}, "", buildUrl(currentBird.value.name));
  };

  if (!currentBird.value) return null;

  return html`<div class="App">
    <div class="Content">
      <h1 class="BirdName">${currentBird.value.name}</h1>
      <img
        src="https://cdn.royvandewater.com/birdnotbird/${currentBird.value
          .filename}"
      />

      ${answer.value &&
      html`<${Result}
        answer=${answer}
        correctAnswer=${currentBird.value.isReal ? "real" : "fake"}
      />`}
      ${answer.value
        ? html`<button className="Try-Again" onClick=${onClickReset}>
            Try Again
          </button>`
        : html`<${Chooser}
            onAnswerReal=${onAnswerReal}
            onAnswerFake=${onAnswerFake}
          /> `}
    </div>
  </div>`;
};

const buildUrl = (name) => {
  return `/?${new URLSearchParams({ bird: toKebabCase(name) }).toString()}`;
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
