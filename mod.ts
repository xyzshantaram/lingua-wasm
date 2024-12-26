interface TranslationResult {
    id: string;
    res?: Map<string, number>;
    err?: string;
}

/**
 * A class for managing a worker that does language detection. See constructor docs for more details.
 * @example ```
 * const detector = new LanguageDetector();
 * await detector.detect("this is a string"); // => "eng"
 * ```
 */
export class LanguageDetector {
    private worker: Worker;
    private pending: Map<string, PromiseWithResolvers<Map<string, number>>> = new Map();
    destroyed: boolean = false;

    /**
     * Instantiate a new LanguageDetector. 
     * @param workerPath Path to the worker file. If not supplied, it defaults to using the lingua-wasm build present with this package.
     * The worker is simply posted messages with a detection id and the string to detect. It must then respond with the same detection id and the detected language (or undefined.)
     */
    constructor(workerPath: string = import.meta.resolve("./src/worker.js")) {
        this.worker = new Worker(workerPath, { type: 'module' });
        this.worker.onmessage = (e: MessageEvent<TranslationResult>) => {
            const { id, res, err } = e.data;
            if (!id) throw new Error("Error: Worker did not return a translation ID!");
            if (!this.pending.has(id)) return;

            if (err) {
                this.pending.get(id)!.reject(err);
            }
            else if (res) {
                this.pending.get(id)!.resolve(res);
            }
        }
    }

    /**
     * Detect the language of a string.
     * @param str The string to detect for.
     * @returns The ISO 639-3 code of the detected language, or undefined if a language could not be detected.
     */
    detect(str: string, threshold?: number): Promise<Map<string, number>> {
        this.checkDestroyed();
        const uuid = crypto.randomUUID();
        this.worker.postMessage({ id: uuid, str, t: threshold });

        const p = Promise.withResolvers<Map<string, number>>();
        this.pending.set(uuid, p);
        return p.promise;
    }

    checkDestroyed() {
        if (this.destroyed) throw new Error("Language detection attempted on a destroyed detector!");
    }

    destroy() {
        this.worker.terminate();
        this.destroyed = true;
    }
}