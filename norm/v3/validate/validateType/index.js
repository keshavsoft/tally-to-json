import { allowedTypes } from "../guards/index.js";

/**
 * Story: Type Token Validation Phase
 * Validates whether a string token matches an allowed schema data type.
 */
const validateType = (inValue, inPath = "$") => {
    let value = inValue;
    let path = inPath;

    if (
        inValue !== null &&
        typeof inValue === "object" &&
        !Array.isArray(inValue) &&
        "inValue" in inValue
    ) {
        value = inValue.inValue;
        path = inValue.inPath ?? inPath;
    }

    const normalizedType = typeof value === "string" ? value.toLowerCase() : "";
    const isValid = allowedTypes.has(normalizedType);

    return [{
        path,
        value,
        isValid,
        message: isValid
            ? "Valid type."
            : `Unsupported type "${value}".`
    }];
};

export { validateType };
export default validateType;
