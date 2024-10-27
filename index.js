import { render } from "preact";
import { html } from "htm/preact";

import { App } from "./src/App.js";

render(html`<${App} />`, document.getElementById("app"));
