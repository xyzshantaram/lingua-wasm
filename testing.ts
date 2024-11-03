import { LanguageDetector } from "jsr:@xyzshantaram/lingua-wasm";

const d = new LanguageDetector();
console.log(await d.detect(prompt("What to translate?") || "empty string"));