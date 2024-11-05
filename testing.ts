import { LanguageDetector } from "./mod.ts";

const d = new LanguageDetector();
let str;
while (true) {
    str = prompt("What to detect?");
    if (!str || ['exit', 'quit'].includes(str)) {
        d.destroy();
        Deno.exit(1);
    }
    console.time('detection took');
    console.log(await d.detect(str));
    console.timeEnd('detection took');
}