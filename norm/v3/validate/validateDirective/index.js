/**
 * Story: Directive Validation Phase
 * Validates schema structural directives such as $type.
 */
const allowedDirectives = new Set(["array", "object"]);

const validateDirective = (inValue, inPath = "$") => {
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

    const normalized = typeof value === "string" ? value.toLowerCase() : "";
    const isValid = allowedDirectives.has(normalized);

    return [{
        path,
        value,
        isValid,
        message: isValid
            ? "Valid $type directive."
            : `Unsupported $type directive "${value}". Allowed directives: ${Array.from(allowedDirectives).join(", ")}.`
    }];
};

export { validateDirective, allowedDirectives };
export default validateDirective;
