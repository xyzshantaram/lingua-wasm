interface TranslationResult {
    id: string;
    res?: string;
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
    private pending: Map<string, PromiseWithResolvers<string>> = new Map();

    /**
     * Instantiate a new LanguageDetector. 
     * @param workerPath Path to the worker file. If not supplied, it defaults to using the lingua-wasm build present with this package.
     * The worker is simply posted messages with a detection id and the string to detect. It must then respond with the same detection id and the detected language (or undefined.)
     */
    constructor(workerPath: string = "jsr:@xyzshantaram/lingua-wasm/worker") {
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
    detect(str: string): Promise<string | undefined> {
        const uuid = crypto.randomUUID();
        this.worker.postMessage({ id: uuid, str });

        const p = Promise.withResolvers<string>();
        this.pending.set(uuid, p);
        return p.promise;
    }
}