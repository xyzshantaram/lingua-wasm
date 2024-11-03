import { detect } from "jsr:@xyzshantaram/lingua-wasm/wasm";

self.onmessage = (e) => {
    const { id, str } = e.data;
    if (!id) {
        throw new Error("No translation id provided!");
    }
    if (!str) {
        self.postMessage({
            id,
            err: "No message provided."
        });
    }

    self.postMessage({ id, res: detect(str) });
}