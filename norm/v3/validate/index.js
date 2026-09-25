import validateObject from "./validateObject/index.js";

/**
 * Story: Public API Validator
 * Validates a schema specification, returning an array of validation results for each node.
 */
const validate = (inSpec) => {
    let spec = inSpec;

    if (
        inSpec !== null &&
        typeof inSpec === "object" &&
        !Array.isArray(inSpec) &&
        "inSpec" in inSpec
    ) {
        spec = inSpec.inSpec;
    }

    return validateObject(spec, "$");
};

const isValid = (inSpec) => {
    const results = validate(inSpec);
    return results.every((item) => item.isValid);
};

validate.isValid = isValid;

export {
    validate,
    isValid
};

export default validate;
