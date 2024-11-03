import { detect } from "../pkg/lingua_wasm.js";

self.onmessage = (e) => {
    const { tid, str } = e.data;
    if (!tid) {
        throw new Error("No translation id provided!");
    }
    if (!str) {
        self.postMessage({
            tid,
            err: "No message provided."
        });
    }

    self.postMessage({ tid, res: detect(str) });
}