

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let WASM_VECTOR_LEN = 0;

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
};

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}
/**
 * @param {string} s
 * @returns {string | undefined}
 */
export function detect(s) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passStringToWasm0(s, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.detect(retptr, ptr0, len0);
        var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
        var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
        let v2;
        if (r0 !== 0) {
            v2 = getStringFromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1, 1);
        }
        return v2;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4, 4) >>> 0;
    const mem = getDataViewMemory0();
    for (let i = 0; i < array.length; i++) {
        mem.setUint32(ptr + 4 * i, addHeapObject(array[i]), true);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}

const LanguageDetectorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_languagedetector_free(ptr >>> 0, 1));
/**
 * This class detects the language of given input text.
 */
export class LanguageDetector {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(LanguageDetector.prototype);
        obj.__wbg_ptr = ptr;
        LanguageDetectorFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        LanguageDetectorFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_languagedetector_free(ptr, 0);
    }
    /**
     * Detects the language of given input text.
     * If the language cannot be reliably detected, `undefined` is returned.
     * @param {string} text
     * @returns {string | undefined}
     */
    detectLanguageOf(text) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.languagedetector_detectLanguageOf(retptr, this.__wbg_ptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            let v2;
            if (r0 !== 0) {
                v2 = getStringFromWasm0(r0, r1).slice();
                wasm.__wbindgen_free(r0, r1 * 1, 1);
            }
            return v2;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Attempts to detect multiple languages in mixed-language text.
     *
     * This feature is experimental and under continuous development.
     *
     * An array of `DetectionResult` is returned containing an entry for each contiguous
     * single-language text section as identified by the library. Each entry consists
     * of the identified language, a start index and an end index. The indices denote
     * the substring that has been identified as a contiguous single-language text section.
     * @param {string} text
     * @returns {any}
     */
    detectMultipleLanguagesOf(text) {
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.languagedetector_detectMultipleLanguagesOf(this.__wbg_ptr, ptr0, len0);
        return takeObject(ret);
    }
    /**
     * Computes confidence values for each language supported by this detector for the given
     * input text. These values denote how likely it is that the given text has been written
     * in any of the languages supported by this detector.
     *
     * An array of two-element objects is returned containing those languages which the
     * calling instance of `LanguageDetector` has been built from, together with their
     * confidence values. The entries are sorted by their confidence value in descending order.
     * Each value is a probability between 0.0 and 1.0. The probabilities of all languages will
     * sum to 1.0. If the language is unambiguously identified by the rule engine, the value
     * 1.0 will always be returned for this language. The other languages will receive a value
     * of 0.0.
     * @param {string} text
     * @returns {any}
     */
    computeLanguageConfidenceValues(text) {
        const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.languagedetector_computeLanguageConfidenceValues(this.__wbg_ptr, ptr0, len0);
        return takeObject(ret);
    }
    /**
     * Computes the confidence value for the given language and input text. This value denotes
     * how likely it is that the given text has been written in the given language.
     *
     * The value that this method computes is a number between 0.0 and 1.0. If the language is
     * unambiguously identified by the rule engine, the value 1.0 will always be returned.
     * If the given language is not supported by this detector instance, the value 0.0 will
     * always be returned.
     * @param {string} text
     * @param {string} language
     * @returns {number}
     */
    computeLanguageConfidence(text, language) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passStringToWasm0(text, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passStringToWasm0(language, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            wasm.languagedetector_computeLanguageConfidence(retptr, this.__wbg_ptr, ptr0, len0, ptr1, len1);
            var r0 = getDataViewMemory0().getFloat64(retptr + 8 * 0, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            var r3 = getDataViewMemory0().getInt32(retptr + 4 * 3, true);
            if (r3) {
                throw takeObject(r2);
            }
            return r0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}

const LanguageDetectorBuilderFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_languagedetectorbuilder_free(ptr >>> 0, 1));
/**
 * This class configures and creates an instance of `LanguageDetector`.
 */
export class LanguageDetectorBuilder {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(LanguageDetectorBuilder.prototype);
        obj.__wbg_ptr = ptr;
        LanguageDetectorBuilderFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        LanguageDetectorBuilderFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_languagedetectorbuilder_free(ptr, 0);
    }
    /**
     * Creates and returns an instance of `LanguageDetectorBuilder` with all built-in languages.
     * @returns {LanguageDetectorBuilder}
     */
    static fromAllLanguages() {
        const ret = wasm.languagedetectorbuilder_fromAllLanguages();
        return LanguageDetectorBuilder.__wrap(ret);
    }
    /**
     * Creates and returns an instance of `LanguageDetectorBuilder`
     * with all built-in spoken languages.
     * @returns {LanguageDetectorBuilder}
     */
    static fromAllSpokenLanguages() {
        const ret = wasm.languagedetectorbuilder_fromAllSpokenLanguages();
        return LanguageDetectorBuilder.__wrap(ret);
    }
    /**
     * Creates and returns an instance of `LanguageDetectorBuilder`
     * with all built-in languages supporting the Arabic script.
     * @returns {LanguageDetectorBuilder}
     */
    static fromAllLanguagesWithArabicScript() {
        const ret = wasm.languagedetectorbuilder_fromAllLanguagesWithArabicScript();
        return LanguageDetectorBuilder.__wrap(ret);
    }
    /**
     * Creates and returns an instance of `LanguageDetectorBuilder`
     * with all built-in languages supporting the Cyrillic script.
     * @returns {LanguageDetectorBuilder}
     */
    static fromAllLanguagesWithCyrillicScript() {
        const ret = wasm.languagedetectorbuilder_fromAllLanguagesWithCyrillicScript();
        return LanguageDetectorBuilder.__wrap(ret);
    }
    /**
     * Creates and returns an instance of `LanguageDetectorBuilder`
     * with all built-in languages supporting the Devanagari script.
     * @returns {LanguageDetectorBuilder}
     */
    static fromAllLanguagesWithDevanagariScript() {
        const ret = wasm.languagedetectorbuilder_fromAllLanguagesWithDevanagariScript();
        return LanguageDetectorBuilder.__wrap(ret);
    }
    /**
     * Creates and returns an instance of `LanguageDetectorBuilder`
     * with all built-in languages supporting the Latin script.
     * @returns {LanguageDetectorBuilder}
     */
    static fromAllLanguagesWithLatinScript() {
        const ret = wasm.languagedetectorbuilder_fromAllLanguagesWithLatinScript();
        return LanguageDetectorBuilder.__wrap(ret);
    }
    /**
     * Creates and returns an instance of `LanguageDetectorBuilder`
     * with all built-in languages except those specified in `languages`.
     *
     * ⚠ Throws an error if less than two `languages` are used to build
     * the `LanguageDetector`.
     * @param {...any[]} languages
     * @returns {LanguageDetectorBuilder}
     */
    static fromAllLanguagesWithout(...languages) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArrayJsValueToWasm0(languages, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.languagedetectorbuilder_fromAllLanguagesWithout(retptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return LanguageDetectorBuilder.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Creates and returns an instance of `LanguageDetectorBuilder`
     * with the specified `languages`.
     *
     * ⚠ Throws an error if less than two `languages` are specified.
     * @param {...any[]} languages
     * @returns {LanguageDetectorBuilder}
     */
    static fromLanguages(...languages) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArrayJsValueToWasm0(languages, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.languagedetectorbuilder_fromLanguages(retptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return LanguageDetectorBuilder.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Creates and returns an instance of `LanguageDetectorBuilder`
     * with the languages specified by the respective ISO 639-1 codes.
     *
     * ⚠ Throws an error if less than two `iso_codes` are specified.
     * @param {...any[]} isoCodes
     * @returns {LanguageDetectorBuilder}
     */
    static fromISOCodes6391(...isoCodes) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArrayJsValueToWasm0(isoCodes, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.languagedetectorbuilder_fromISOCodes6391(retptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return LanguageDetectorBuilder.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Creates and returns an instance of `LanguageDetectorBuilder`
     * with the languages specified by the respective ISO 639-3 codes.
     *
     * ⚠ Throws an error if less than two `iso_codes` are specified.
     * @param {...any[]} isoCodes
     * @returns {LanguageDetectorBuilder}
     */
    static fromISOCodes6393(...isoCodes) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArrayJsValueToWasm0(isoCodes, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.languagedetectorbuilder_fromISOCodes6393(retptr, ptr0, len0);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return LanguageDetectorBuilder.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Sets the desired value for the minimum relative distance measure.
     *
     * By default, *Lingua* returns the most likely language for a given
     * input text. However, there are certain words that are spelled the
     * same in more than one language. The word *prologue*, for instance,
     * is both a valid English and French word. Lingua would output either
     * English or French which might be wrong in the given context.
     * For cases like that, it is possible to specify a minimum relative
     * distance that the logarithmized and summed up probabilities for
     * each possible language have to satisfy.
     *
     * Be aware that the distance between the language probabilities is
     * dependent on the length of the input text. The longer the input
     * text, the larger the distance between the languages. So if you
     * want to classify very short text phrases, do not set the minimum
     * relative distance too high. Otherwise you will get most results
     * returned as `undefined` which is the return value for cases
     * where language detection is not reliably possible.
     *
     * ⚠ Throws an error if `distance` is smaller than 0.0 or greater than 0.99.
     * @param {number} distance
     * @returns {LanguageDetectorBuilder}
     */
    withMinimumRelativeDistance(distance) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.languagedetectorbuilder_withMinimumRelativeDistance(retptr, this.__wbg_ptr, distance);
            var r0 = getDataViewMemory0().getInt32(retptr + 4 * 0, true);
            var r1 = getDataViewMemory0().getInt32(retptr + 4 * 1, true);
            var r2 = getDataViewMemory0().getInt32(retptr + 4 * 2, true);
            if (r2) {
                throw takeObject(r1);
            }
            return LanguageDetectorBuilder.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
     * Configures `LanguageDetectorBuilder` to preload all language models when creating
     * the instance of `LanguageDetector`.
     *
     * By default, *Lingua* uses lazy-loading to load only those language models
     * on demand which are considered relevant by the rule-based filter engine.
     * For web services, for instance, it is rather beneficial to preload all language
     * models into memory to avoid unexpected latency while waiting for the
     * service response. This method allows to switch between these two loading modes.
     * @returns {LanguageDetectorBuilder}
     */
    withPreloadedLanguageModels() {
        const ret = wasm.languagedetectorbuilder_withPreloadedLanguageModels(this.__wbg_ptr);
        return LanguageDetectorBuilder.__wrap(ret);
    }
    /**
     * Disables the high accuracy mode in order to save memory and increase performance.
     *
     * By default, *Lingua's* high detection accuracy comes at the cost of loading large
     * language models into memory which might not be feasible for systems running low on
     * resources.
     *
     * This method disables the high accuracy mode so that only a small subset of language
     * models is loaded into memory. The downside of this approach is that detection accuracy
     * for short texts consisting of less than 120 characters will drop significantly. However,
     * detection accuracy for texts which are longer than 120 characters will remain mostly
     * unaffected.
     * @returns {LanguageDetectorBuilder}
     */
    withLowAccuracyMode() {
        const ret = wasm.languagedetectorbuilder_withLowAccuracyMode(this.__wbg_ptr);
        return LanguageDetectorBuilder.__wrap(ret);
    }
    /**
     * Creates and returns the configured instance of `LanguageDetector`.
     * @returns {LanguageDetector}
     */
    build() {
        const ret = wasm.languagedetectorbuilder_build(this.__wbg_ptr);
        return LanguageDetector.__wrap(ret);
    }
}

const imports = {
    __wbindgen_placeholder__: {
        __wbindgen_string_get: function(arg0, arg1) {
            const obj = getObject(arg1);
            const ret = typeof(obj) === 'string' ? obj : undefined;
            var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbindgen_object_drop_ref: function(arg0) {
            takeObject(arg0);
        },
        __wbindgen_string_new: function(arg0, arg1) {
            const ret = getStringFromWasm0(arg0, arg1);
            return addHeapObject(ret);
        },
        __wbindgen_object_clone_ref: function(arg0) {
            const ret = getObject(arg0);
            return addHeapObject(ret);
        },
        __wbindgen_is_object: function(arg0) {
            const val = getObject(arg0);
            const ret = typeof(val) === 'object' && val !== null;
            return ret;
        },
        __wbindgen_error_new: function(arg0, arg1) {
            const ret = new Error(getStringFromWasm0(arg0, arg1));
            return addHeapObject(ret);
        },
        __wbindgen_number_new: function(arg0) {
            const ret = arg0;
            return addHeapObject(ret);
        },
        __wbindgen_bigint_from_u64: function(arg0) {
            const ret = BigInt.asUintN(64, arg0);
            return addHeapObject(ret);
        },
        __wbg_set_f975102236d3c502: function(arg0, arg1, arg2) {
            getObject(arg0)[takeObject(arg1)] = takeObject(arg2);
        },
        __wbg_crypto_1d1f22824a6a080c: function(arg0) {
            const ret = getObject(arg0).crypto;
            return addHeapObject(ret);
        },
        __wbg_process_4a72847cc503995b: function(arg0) {
            const ret = getObject(arg0).process;
            return addHeapObject(ret);
        },
        __wbg_versions_f686565e586dd935: function(arg0) {
            const ret = getObject(arg0).versions;
            return addHeapObject(ret);
        },
        __wbg_node_104a2ff8d6ea03a2: function(arg0) {
            const ret = getObject(arg0).node;
            return addHeapObject(ret);
        },
        __wbindgen_is_string: function(arg0) {
            const ret = typeof(getObject(arg0)) === 'string';
            return ret;
        },
        __wbg_require_cca90b1a94a0255b: function() { return handleError(function () {
            const ret = module.require;
            return addHeapObject(ret);
        }, arguments) },
        __wbg_msCrypto_eb05e62b530a1508: function(arg0) {
            const ret = getObject(arg0).msCrypto;
            return addHeapObject(ret);
        },
        __wbg_randomFillSync_5c9c955aa56b6049: function() { return handleError(function (arg0, arg1) {
            getObject(arg0).randomFillSync(takeObject(arg1));
        }, arguments) },
        __wbg_getRandomValues_3aa56aa6edec874c: function() { return handleError(function (arg0, arg1) {
            getObject(arg0).getRandomValues(getObject(arg1));
        }, arguments) },
        __wbg_new_034f913e7636e987: function() {
            const ret = new Array();
            return addHeapObject(ret);
        },
        __wbindgen_is_function: function(arg0) {
            const ret = typeof(getObject(arg0)) === 'function';
            return ret;
        },
        __wbg_newnoargs_1ede4bf2ebbaaf43: function(arg0, arg1) {
            const ret = new Function(getStringFromWasm0(arg0, arg1));
            return addHeapObject(ret);
        },
        __wbg_call_a9ef466721e824f2: function() { return handleError(function (arg0, arg1) {
            const ret = getObject(arg0).call(getObject(arg1));
            return addHeapObject(ret);
        }, arguments) },
        __wbg_new_e69b5f66fda8f13c: function() {
            const ret = new Object();
            return addHeapObject(ret);
        },
        __wbg_self_bf91bf94d9e04084: function() { return handleError(function () {
            const ret = self.self;
            return addHeapObject(ret);
        }, arguments) },
        __wbg_window_52dd9f07d03fd5f8: function() { return handleError(function () {
            const ret = window.window;
            return addHeapObject(ret);
        }, arguments) },
        __wbg_globalThis_05c129bf37fcf1be: function() { return handleError(function () {
            const ret = globalThis.globalThis;
            return addHeapObject(ret);
        }, arguments) },
        __wbg_global_3eca19bb09e9c484: function() { return handleError(function () {
            const ret = global.global;
            return addHeapObject(ret);
        }, arguments) },
        __wbindgen_is_undefined: function(arg0) {
            const ret = getObject(arg0) === undefined;
            return ret;
        },
        __wbg_set_425e70f7c64ac962: function(arg0, arg1, arg2) {
            getObject(arg0)[arg1 >>> 0] = takeObject(arg2);
        },
        __wbg_call_3bfa248576352471: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
            return addHeapObject(ret);
        }, arguments) },
        __wbg_buffer_ccaed51a635d8a2d: function(arg0) {
            const ret = getObject(arg0).buffer;
            return addHeapObject(ret);
        },
        __wbg_newwithbyteoffsetandlength_7e3eb787208af730: function(arg0, arg1, arg2) {
            const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
            return addHeapObject(ret);
        },
        __wbg_new_fec2611eb9180f95: function(arg0) {
            const ret = new Uint8Array(getObject(arg0));
            return addHeapObject(ret);
        },
        __wbg_set_ec2fcf81bc573fd9: function(arg0, arg1, arg2) {
            getObject(arg0).set(getObject(arg1), arg2 >>> 0);
        },
        __wbg_newwithlength_76462a666eca145f: function(arg0) {
            const ret = new Uint8Array(arg0 >>> 0);
            return addHeapObject(ret);
        },
        __wbg_subarray_975a06f9dbd16995: function(arg0, arg1, arg2) {
            const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
            return addHeapObject(ret);
        },
        __wbindgen_debug_string: function(arg0, arg1) {
            const ret = debugString(getObject(arg1));
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbindgen_throw: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbindgen_memory: function() {
            const ret = wasm.memory;
            return addHeapObject(ret);
        },
    },

};

const wasm_url = new URL('lingua_wasm_bg.wasm', import.meta.url);
let wasmCode = '';
switch (wasm_url.protocol) {
    case 'file:':
    wasmCode = await Deno.readFile(wasm_url);
    break
    case 'https:':
    case 'http:':
    wasmCode = await (await fetch(wasm_url)).arrayBuffer();
    break
    default:
    throw new Error(`Unsupported protocol: ${wasm_url.protocol}`);
}

const wasmInstance = (await WebAssembly.instantiate(wasmCode, imports)).instance;
const wasm = wasmInstance.exports;
export const __wasm = wasm;

