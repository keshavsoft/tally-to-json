import validateValue from "../validateValue/index.js";

/**
 * Story: Array Specification Validation Phase
 * Validates array spec representations and enforces the single-item spec constraint.
 */
const validateArray = (inValue, inPath = "$", inOptions = {}) => {
    let value = inValue;
    let path = inPath;
    let options = inOptions;

    if (
        inValue !== null &&
        typeof inValue === "object" &&
        !Array.isArray(inValue) &&
        "inValue" in inValue
    ) {
        value = inValue.inValue;
        path = inValue.inPath ?? inPath;
        options = inValue.inOptions ?? inOptions;
    }

    const results = [];

    if (!Array.isArray(value)) {
        return [{
            path,
            value,
            isValid: false,
            message: "Expected an array specification."
        }];
    }

    if (options.isNested) {
        return [{
            path,
            value,
            isValid: false,
            message: "Nested array specifications are not supported."
        }];
    }

    if (value.length > 1) {
        return [{
            path,
            value,
            isValid: false,
            message: "Array specification can contain at most one item specification."
        }];
    }

    results.push({
        path,
        value,
        isValid: true,
        message: "Valid array specification."
    });

    if (value.length === 1) {
        results.push(...validateValue(value[0], `${path}[0]`, { isNested: true }));
    }

    return results;
};

export { validateArray };
export default validateArray;
