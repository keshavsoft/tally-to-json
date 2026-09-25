import { isPlainObject, isTypeSpec } from "../guards/index.js";
import forScalar from "../forScalar/index.js";
import forArray from "../forArray/index.js";
import forObject from "../forObject/index.js";

/**
 * Story: Value Dispatcher Phase
 * Evaluates the specification type and dispatches to scalar, array, or object normalizers.
 */
const normalizeValue = (inValue, inSpec) => {
    let value = inValue;
    let spec = inSpec;

    if (
        inValue !== null &&
        typeof inValue === "object" &&
        !Array.isArray(inValue) &&
        "inValue" in inValue &&
        "inSpec" in inValue
    ) {
        value = inValue.inValue;
        spec = inValue.inSpec;
    }

    // Story Branch 1: Simple Type Specification ("string", "number", "boolean", "date", "array", "object")
    if (isTypeSpec(spec)) {
        const type = spec.toLowerCase();

        if (type === "array") {
            return forArray(value, "array");
        }

        if (type === "object") {
            return value;
        }

        return forScalar(value, type);
    }

    // Story Branch 2: Object Specification
    if (isPlainObject(spec)) {
        // Sub-story 2A: $type specifies the current container must be an array
        if (spec.$type === "array") {
            return forArray(value, spec);
        }

        // Sub-story 2B: Value is an Array of Objects to be normalized against spec
        if (Array.isArray(value)) {
            return value.map((item) => forObject(item, spec));
        }

        // Sub-story 2C: Non-plain object value with plain object spec
        if (!isPlainObject(value)) {
            return value;
        }

        // Sub-story 2D: Normal Plain Object
        return forObject(value, spec);
    }

    return value;
};

export { normalizeValue };
export default normalizeValue;
