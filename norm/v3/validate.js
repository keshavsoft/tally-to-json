const allowedTypes = new Set([
    "string",
    "number",
    "boolean",
    "date",
    "array",
    "object"
]);

const isPlainObject = (value) => (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
);

const validateSpec = (spec, path = "$") => {
    const results = [];

    if (!isPlainObject(spec)) {
        return [{
            path,
            value: spec,
            isValid: false,
            message: "Specification must be an object."
        }];
    }

    Object.entries(spec).forEach(([key, value]) => {
        const currentPath = `${path}.${key}`;

        if (typeof value === "string") {
            const normalizedType = value.toLowerCase();

            results.push({
                path: currentPath,
                value,
                isValid: allowedTypes.has(normalizedType),
                message: allowedTypes.has(normalizedType)
                    ? "Valid type."
                    : `Unsupported type "${value}".`
            });

            return;
        }

        if (Array.isArray(value)) {
            if (value.length > 1) {
                results.push({
                    path: currentPath,
                    value,
                    isValid: false,
                    message: "Array specification can contain at most one item specification."
                });

                return;
            }

            results.push({
                path: currentPath,
                value,
                isValid: true,
                message: "Valid array specification."
            });

            if (value.length === 1) {
                results.push(...validateSpecValue(
                    value[0],
                    `${currentPath}[0]`
                ));
            }

            return;
        }

        if (isPlainObject(value)) {
            results.push({
                path: currentPath,
                value,
                isValid: true,
                message: "Valid object specification."
            });

            results.push(...validateSpec(value, currentPath));
            return;
        }

        results.push({
            path: currentPath,
            value,
            isValid: false,
            message: "Specification value must be a supported type, object, or array specification."
        });
    });

    return results;
};

const validateSpecValue = (value, path) => {
    if (typeof value === "string") {
        const normalizedType = value.toLowerCase();

        return [{
            path,
            value,
            isValid: allowedTypes.has(normalizedType),
            message: allowedTypes.has(normalizedType)
                ? "Valid type."
                : `Unsupported type "${value}".`
        }];
    }

    if (isPlainObject(value)) {
        return validateSpec(value, path);
    }

    if (Array.isArray(value)) {
        return [{
            path,
            value,
            isValid: false,
            message: "Nested array specifications are not supported in V1."
        }];
    }

    return [{
        path,
        value,
        isValid: false,
        message: "Invalid specification."
    }];
};

const validate = (spec) => validateSpec(spec);

export default validate;
