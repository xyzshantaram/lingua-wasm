import { detect } from "../pkg/lingua_wasm.js";

self.onmessage = (e) => {
    const { id, str, t } = e.data;
    if (!id) {
        throw new Error("No translation id provided!");
    }
    if (!str) {
        self.postMessage({
            id,
            err: "No message provided."
        });
    }

    self.postMessage({ id, res: detect(str, t) });
}