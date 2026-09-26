import cleanTallyResponse from "tally-clean-response";
import { selectJson } from "select-json-by-json";
import { renameJsonKeys } from "rename-json-keys";
import normalize from "normalize-json-by-json";

const resolveSpecs = (arg2, arg3, arg4) => {
    if (
        arg2 &&
        typeof arg2 === "object" &&
        !Array.isArray(arg2) &&
        ("selectJson" in arg2 || "renameJson" in arg2 || "normalizeJson" in arg2 ||
         "select" in arg2 || "rename" in arg2 || "normalize" in arg2)
    ) {
        return {
            selectSpec: arg2.selectJson ?? arg2.select,
            renameSpec: arg2.renameJson ?? arg2.rename,
            normalizeSpec: arg2.normalizeJson ?? arg2.normalize
        };
    }
    return {
        selectSpec: arg2,
        renameSpec: arg3,
        normalizeSpec: arg4
    };
};

const extractArgsAndSpec = (args) => {
    const lastArg = args[args.length - 1];
    if (typeof lastArg === "object" && lastArg !== null && !Array.isArray(lastArg)) {
        return {
            fetchArgs: args.slice(0, -1),
            customSpec: lastArg
        };
    }
    return {
        fetchArgs: args,
        customSpec: undefined
    };
};

const createStageMethod = (fetchFn, ...specArgs) => {
    const { selectSpec, renameSpec, normalizeSpec } = resolveSpecs(...specArgs);

    const asIs = async (...args) => {
        const { fetchArgs } = extractArgsAndSpec(args);
        return await fetchFn(...fetchArgs);
    };

    const cleaned = async (...args) => {
        const { fetchArgs } = extractArgsAndSpec(args);
        const raw = await asIs(...fetchArgs);
        return cleanTallyResponse(raw);
    };

    const selected = async (...args) => {
        const { fetchArgs, customSpec } = extractArgsAndSpec(args);
        const cln = await cleaned(...fetchArgs);
        const schema = customSpec || selectSpec;
        return schema ? selectJson(cln, schema) : cln;
    };

    const renamed = async (...args) => {
        const { fetchArgs, customSpec } = extractArgsAndSpec(args);
        const sel = await selected(...fetchArgs);
        const schema = customSpec || renameSpec;
        return schema ? renameJsonKeys(sel, schema) : sel;
    };

    const normalized = async (...args) => {
        const { fetchArgs, customSpec } = extractArgsAndSpec(args);
        const ren = await renamed(...fetchArgs);
        const schema = customSpec || normalizeSpec;
        return schema ? normalize(ren, schema) : ren;
    };

    // Default callable runner (cleaned)
    const runner = async (...args) => {
        return await cleaned(...args);
    };

    // Attach stage methods
    runner.asIs = asIs;
    runner.cleaned = cleaned;
    runner.selected = selected;
    runner.renamed = renamed;
    runner.rename = renamed;
    runner.normalized = normalized;
    runner.normalize = normalized;

    return runner;
};

const createVoucherApi = (tdlVoucherGroup, ...specs) => {
    return {
        period: createStageMethod(tdlVoucherGroup.period, ...specs),
        all: createStageMethod(tdlVoucherGroup.all, ...specs)
    };
};

export { createStageMethod, createVoucherApi };
export default createVoucherApi;
