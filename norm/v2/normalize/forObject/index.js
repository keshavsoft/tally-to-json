import normalizeValue from "../normalizeValue/index.js";

/**
 * Story: Object Normalization Phase
 * Iterates through specification keys, projecting and normalizing matching properties from the source object.
 */
const forObject = (inSource, inSpec) => {
    let source = inSource;
    let spec = inSpec;

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

    if (source === null || typeof source !== "object") {
        return source;
    }

    const result = { ...source };

    Object.entries(spec).forEach(([key, valueSpec]) => {
        if (key === "$type") {
            return;
        }

        if (!Object.prototype.hasOwnProperty.call(source, key)) {
            return;
        }

        result[key] = normalizeValue(source[key], valueSpec);
    });

    return result;
};

export { forObject, forObject as normalizeObject };
export default forObject;
