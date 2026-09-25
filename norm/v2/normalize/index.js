import { isPlainObject } from "./guards/index.js";
import normalizeValue from "./normalizeValue/index.js";
import forObject from "./forObject/index.js";

/**
 * Story: Public API Normalizer
 * Entry point for normalizing data structures (arrays, objects, or primitive values)
 * against a schema specification.
 */
const normalize = (inSource, inSpec) => {
    let source = inSource;
    let spec = inSpec;

    // Case 1: Called with single options object { inSource, inSpec }
    if (
        inSource !== null &&
        typeof inSource === "object" &&
        !Array.isArray(inSource) &&
        "inSource" in inSource &&
        "inSpec" in inSource
    ) {
        source = inSource.inSource;
        spec = inSource.inSpec;
    }

    // Story Branch 1: Source is an Array
    if (Array.isArray(source)) {
        return source.map((item) => normalizeValue(item, spec));
    }

    // Story Branch 2: Source is a Plain Object
    if (isPlainObject(source)) {
        return forObject(source, spec);
    }

    // Story Branch 3: Fallback / Scalar Value
    return normalizeValue(source, spec);
};

export { normalize };
export default normalize;
