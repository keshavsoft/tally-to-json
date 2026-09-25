import cleanTallyResponse from "tally-clean-response";
import select from "select-json-by-json";
import norm from "../../../norm/v3/index.js";

/**
 * Story: 4-Step Pipeline Runner
 * Wraps an upstream TDL fetch function with:
 *  1. asIs: Raw JSON from Tally XML
 *  2. cleaned: Strips XML wrappers and trims whitespace
 *  3. selected: Projects specified fields from schema
 *  4. normalized: Applies structural array types and scalar coercions
 */
const createPipeline = ({ fetchFn, selectJson, normalizeJson } = {}) => {
    if (typeof fetchFn !== "function") {
        throw new TypeError("createPipeline requires a fetchFn function");
    }

    // Step 1: Raw response from Tally
    const asIs = async (...args) => {
        return await fetchFn(...args);
    };

    // Step 2: Clean response
    const cleaned = async (...args) => {
        const raw = await asIs(...args);
        return cleanTallyResponse(raw);
    };

    // Step 3: Select specified properties
    const selected = async (...args) => {
        const cln = await cleaned(...args);
        return selectJson ? select(cln, selectJson) : cln;
    };

    // Step 4: Normalize data structures & types
    const normalized = async (...args) => {
        const sel = await selected(...args);
        return normalizeJson ? norm(sel, normalizeJson) : sel;
    };

    // Default entry: full pipeline to normalized output
    const runner = async (...args) => {
        return await normalized(...args);
    };

    // Attach step functions
    runner.asIs = asIs;
    runner.cleaned = cleaned;
    runner.selected = selected;
    runner.normalized = normalized;

    // Execute all steps in a single network trip
    runner.steps = async (...args) => {
        const raw = await asIs(...args);
        const cln = cleanTallyResponse(raw);
        const sel = selectJson ? select(cln, selectJson) : cln;
        const nrm = normalizeJson ? norm(sel, normalizeJson) : sel;

        return {
            asIs: raw,
            cleaned: cln,
            selected: sel,
            normalized: nrm
        };
    };

    return runner;
};

export { createPipeline };
export default createPipeline;
