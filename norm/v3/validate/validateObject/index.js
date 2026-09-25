import { isPlainObject } from "../guards/index.js";
import validateDirective from "../validateDirective/index.js";
import validateValue from "../validateValue/index.js";

/**
 * Story: Object Specification Validation Phase
 * Iterates through object keys, validates directives like $type, and verifies property schema definitions.
 */
const validateObject = (inSpec, inPath = "$") => {
    let spec = inSpec;
    let path = inPath;

    if (
        inSpec !== null &&
        typeof inSpec === "object" &&
        !Array.isArray(inSpec) &&
        "inSpec" in inSpec
    ) {
        spec = inSpec.inSpec;
        path = inSpec.inPath ?? inPath;
    }

    if (!isPlainObject(spec)) {
        return [{
            path,
            value: spec,
            isValid: false,
            message: "Specification must be an object."
        }];
    }

    const results = [];

    Object.entries(spec).forEach(([key, value]) => {
        const currentPath = `${path}.${key}`;

        // Branch 1: $type Directive
        if (key === "$type") {
            results.push(...validateDirective(value, currentPath));
            return;
        }

        // Branch 2: String Type
        if (typeof value === "string") {
            results.push(...validateValue(value, currentPath));
            return;
        }

        // Branch 3: Array Specification
        if (Array.isArray(value)) {
            results.push(...validateValue(value, currentPath));
            return;
        }

        // Branch 4: Nested Object Specification
        if (isPlainObject(value)) {
            results.push({
                path: currentPath,
                value,
                isValid: true,
                message: "Valid object specification."
            });

            results.push(...validateObject(value, currentPath));
            return;
        }

        // Branch 5: Unsupported specification value
        results.push({
            path: currentPath,
            value,
            isValid: false,
            message: "Specification value must be a supported type, object, or array specification."
        });
    });

    return results;
};

export { validateObject };
export default validateObject;
