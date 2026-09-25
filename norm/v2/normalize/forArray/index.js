import normalizeValue from "../normalizeValue/index.js";

/**
 * Story: Array Normalization Phase
 * Wraps values into arrays when requested and maps each element through item-level specification.
 */
const forArray = (inValue, inSpec) => {
    let value = inValue;
    let spec = inSpec;

    if (
        inValue !== null &&
        typeof inValue === "object" &&
        !Array.isArray(inValue) &&
        "inValue" in inValue
    ) {
        value = inValue.inValue;
        spec = inValue.inSpec;
    }

    const localArray = Array.isArray(value)
        ? value
        : value == null
            ? value
            : [value];

    if (localArray == null) {
        return localArray;
    }

    // If no spec or spec is just "array", return wrapped array
    if (!spec || spec === "array") {
        return localArray;
    }

    // Remove $type to obtain specification for array items
    const itemSpec = Object.fromEntries(
        Object.entries(spec).filter(([key]) => key !== "$type")
    );

    // If no item specifications left, return the array items as-is
    if (Object.keys(itemSpec).length === 0) {
        return localArray;
    }

    return localArray.map((item) => normalizeValue(item, itemSpec));
};

export { forArray, forArray as normalizeArray };
export default forArray;
