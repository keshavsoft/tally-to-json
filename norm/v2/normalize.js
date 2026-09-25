const typeSet = new Set([
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
    !Array.isArray(value) &&
    !(value instanceof Date)
);

const isTypeSpec = (value) => (
    typeof value === "string" &&
    typeSet.has(value.toLowerCase())
);

const normalizeScalar = (value, type) => {
    if (value === null || value === undefined) {
        return value;
    }

    switch (type) {
        case "string":
            return String(value);

        case "number": {
            const number = Number(value);
            return Number.isNaN(number) ? value : number;
        }

        case "boolean":
            if (typeof value === "boolean") {
                return value;
            }

            if (value === "true" || value === "1" || value === 1) {
                return true;
            }

            if (value === "false" || value === "0" || value === 0) {
                return false;
            }

            return value;

        case "date": {
            if (value instanceof Date) {
                return value;
            }

            const date = new Date(value);
            return Number.isNaN(date.getTime()) ? value : date;
        }

        default:
            return value;
    }
};

const normalizeValue = (value, spec) => {
    /*
     * Simple specification:
     *
     * "number"
     * "string"
     * "array"
     */
    if (isTypeSpec(spec)) {
        const type = spec.toLowerCase();

        if (type === "array") {
            return Array.isArray(value)
                ? value
                : value == null
                    ? value
                    : [value];
        }

        if (type === "object") {
            return value;
        }

        return normalizeScalar(value, type);
    }

    /*
     * Object specification.
     */
    if (isPlainObject(spec)) {
        const type = spec.$type;

        /*
         * $type tells us what the current value itself must become.
         */
        if (type === "array") {
            const localArray = Array.isArray(value)
                ? value
                : value == null
                    ? value
                    : [value];

            if (localArray == null) {
                return localArray;
            }

            /*
             * Remove $type and use the remaining object
             * as the specification for every array item.
             */
            const itemSpec = Object.fromEntries(
                Object.entries(spec).filter(([key]) => key !== "$type")
            );

            return localArray.map((item) =>
                normalizeValue(item, itemSpec)
            );
        }

        /*
         * Normal object specification.
         */
        if (Array.isArray(value)) {
            return value.map((item) =>
                normalizeObject(item, spec)
            );
        }

        if (!isPlainObject(value)) {
            return value;
        }

        return normalizeObject(value, spec);
    }

    return value;
};

const normalizeObject = (source, spec) => {
    const result = { ...source };

    Object.entries(spec).forEach(([key, valueSpec]) => {
        if (key === "$type") {
            return;
        }

        if (!Object.prototype.hasOwnProperty.call(source, key)) {
            return;
        }

        result[key] = normalizeValue(source[key], valueSpec);
    });

    return result;
};

const normalize = (source, spec) => {
    if (Array.isArray(source)) {
        return source.map((item) =>
            normalizeValue(item, spec)
        );
    }

    if (isPlainObject(source)) {
        return normalizeObject(source, spec);
    }

    return normalizeValue(source, spec);
};

export default normalize;