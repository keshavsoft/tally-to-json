import cleanTallyResponse from "tally-clean-response";
import { selectJson } from "select-json-by-json";

const createStageMethod = (fetchFn, defaultSelectJson) => {
    const asIs = async (...args) => {
        return await fetchFn(...args);
    };

    const cleaned = async (...args) => {
        const raw = await asIs(...args);
        return cleanTallyResponse(raw);
    };

    const selected = async (...args) => {
        const cln = await cleaned(...args);
        const lastArg = args[args.length - 1];
        const customSpec = (typeof lastArg === "object" && lastArg !== null && !Array.isArray(lastArg))
            ? lastArg
            : undefined;
        const schema = customSpec || defaultSelectJson;
        return schema ? selectJson(cln, schema) : cln;
    };

    // Default callable runner (cleaned)
    const runner = async (...args) => {
        return await cleaned(...args);
    };

    // Attach stage methods
    runner.asIs = asIs;
    runner.cleaned = cleaned;
    runner.selected = selected;

    return runner;
};

const createVoucherApi = (tdlVoucherGroup, defaultSelectJson) => {
    return {
        period: createStageMethod(tdlVoucherGroup.period, defaultSelectJson),
        all: createStageMethod(tdlVoucherGroup.all, defaultSelectJson)
    };
};

export { createStageMethod, createVoucherApi };
export default createVoucherApi;
