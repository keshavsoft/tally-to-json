import { isPlainObject } from "../guards/index.js";
import validateType from "../validateType/index.js";
import validateArray from "../validateArray/index.js";
import validateObject from "../validateObject/index.js";

/**
 * Story: Value Dispatcher Phase
 * Dispatches an individual specification node to the appropriate validator based on its structure.
 */
const validateValue = (inValue, inPath = "$", inOptions = {}) => {
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

    if (typeof value === "string") {
        return validateType(value, path);
    }

    if (isPlainObject(value)) {
        return validateObject(value, path);
    }

    if (Array.isArray(value)) {
        return validateArray(value, path, options);
    }

    return [{
        path,
        value,
        isValid: false,
        message: "Invalid specification."
    }];
};

export { validateValue };
export default validateValue;
