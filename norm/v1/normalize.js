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
    if (isTypeSpec(spec)) {
        const type = spec.toLowerCase();

        if (type === "array") {
            if (Array.isArray(value)) {
                return value;
            }

            if (value === undefined || value === null) {
                return value;
            }

            return [value];
        }

        if (type === "object") {
            return value;
        }

        return normalizeScalar(value, type);
    }

    if (Array.isArray(spec)) {
        if (!Array.isArray(value)) {
            return value;
        }

        const itemSpec = spec[0];

        if (itemSpec === undefined) {
            return value;
        }

        return value.map((item) => normalizeValue(item, itemSpec));
    }

    if (isPlainObject(spec)) {
        if (Array.isArray(value)) {
            return value.map((item) => normalizeObject(item, spec));
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

    Object.keys(spec).forEach((key) => {
        if (!Object.prototype.hasOwnProperty.call(source, key)) {
            return;
        }

        result[key] = normalizeValue(source[key], spec[key]);
    });

    return result;
};

const normalize = (source, spec) => {
    if (Array.isArray(source)) {
        return source.map((item) => normalizeValue(item, spec));
    }

    if (isPlainObject(source)) {
        return normalizeObject(source, spec);
    }

    return normalizeValue(source, spec);
};

export default normalize;
