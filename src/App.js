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
  const showSharedUrl = useSignal(false);

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

  const onClickCopy = () => {
    navigator.clipboard.writeText(buildFullUrl(currentBird.value.name));
    showSharedUrl.value = true;
    setTimeout(() => {
      showSharedUrl.value = false;
    }, 2000);
  };

  const onClickOutside = () => {
    showSharedUrl.value = false;
  };

  if (!currentBird.value) return null;

  return html`<div class="App" onClick=${onClickOutside}>
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
        ? html`<${NextActions}
            url=${buildFullUrl(currentBird.value.name)}
            onClickCopy=${(event) => {
              event.stopPropagation();
              return onClickCopy(event);
            }}
            onClickReset=${onClickReset}
          />`
        : html`<${Chooser}
            onAnswerReal=${onAnswerReal}
            onAnswerFake=${onAnswerFake}
          /> `}
      <${SharedUrlToast} show=${showSharedUrl} />
    </div>
  </div>`;
};

const buildUrl = (name) => {
  return `/?${new URLSearchParams({ bird: toKebabCase(name) }).toString()}`;
};

const buildFullUrl = (name) => {
  return `${window.location.origin}${buildUrl(name)}`;
};

const Chooser = ({ onAnswerReal, onAnswerFake }) => {
  return html`<div>
    <button className="Real Choice" onClick=${onAnswerReal}>Real</button>
    <button className="Fake Choice" onClick=${onAnswerFake}>Fake</button>
  </div>`;
};

const NextActions = ({ onClickReset, url, onClickCopy }) => {
  return html`<div class="Next-Actions">
    <button className="Try-Again" onClick=${onClickReset}>Try Again</button>
    <${ShareUrl} url=${url} onClickCopy=${onClickCopy} />
  </div>`;
};

const ShareUrl = ({ url, onClickCopy }) => {
  return html`
    <div class="Share-Url">
      <input type="text" disabled value=${url} />
      <button onClick=${onClickCopy}>Copy</button>
    </div>
  `;
};

const Result = ({ answer, correctAnswer }) => {
  if (answer.value === correctAnswer) {
    return html`<div>
      <h1>Correct!</h1>
      <p>This bird is <strong>${correctAnswer}</strong>!</p>
    </div>`;
  }

  return html`<div>
    <h1>Incorrect</h1>
    <p>This bird is actually <strong>${correctAnswer}</strong>!</p>
  </div>`;
};

const SharedUrlToast = ({ show }) => {
  return html`<div class="Shared-Url-Toast ${show.value ? "show" : ""}">
    Copied to clipboard
  </div>`;
};
