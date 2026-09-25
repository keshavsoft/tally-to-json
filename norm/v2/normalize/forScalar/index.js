/**
 * Story: Scalar Transformation Phase
 * Normalizes primitive scalar values (string, number, boolean, date) according to type specification.
 */
const forScalar = (inValue, inType) => {
    let value = inValue;
    let type = inType;

    if (
        inValue !== null &&
        typeof inValue === "object" &&
        !Array.isArray(inValue) &&
        "inValue" in inValue &&
        "inType" in inValue
    ) {
        value = inValue.inValue;
        type = inValue.inType;
    }

    if (value === null || value === undefined) {
        return value;
    }

    const localType = typeof type === "string" ? type.toLowerCase() : type;

    switch (localType) {
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

export { forScalar, forScalar as normalizeScalar };
export default forScalar;
