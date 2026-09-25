/**
 * Story: Type Guards and Type Definitions Phase
 * Validates specifications, object structures, arrays, and primitive data types.
 */

const typeSet = new Set([
    "string",
    "number",
    "boolean",
    "date",
    "array",
    "object"
]);

const isPlainObject = (inValue) => {
    const localValue = inValue !== null && typeof inValue === "object" && "inValue" in inValue
        ? inValue.inValue
        : inValue;

    return (
        localValue !== null &&
        typeof localValue === "object" &&
        !Array.isArray(localValue) &&
        !(localValue instanceof Date)
    );
};

const isTypeSpec = (inValue) => {
    const localValue = inValue !== null && typeof inValue === "object" && "inValue" in inValue
        ? inValue.inValue
        : inValue;

    return (
        typeof localValue === "string" &&
        typeSet.has(localValue.toLowerCase())
    );
};

const isArray = (inValue) => {
    const localValue = inValue !== null && typeof inValue === "object" && "inValue" in inValue
        ? inValue.inValue
        : inValue;

    return Array.isArray(localValue);
};

export {
    typeSet,
    isPlainObject,
    isTypeSpec,
    isArray
};

export default {
    typeSet,
    isPlainObject,
    isTypeSpec,
    isArray
};
