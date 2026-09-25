/**
 * Story: Shared Type Guards and Definitions
 * Canonical definitions for supported types, object checks, and spec guards across norm.
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
    typeSet as allowedTypes,
    isPlainObject,
    isTypeSpec,
    isArray
};

export default {
    typeSet,
    allowedTypes: typeSet,
    isPlainObject,
    isTypeSpec,
    isArray
};
