import createPipeline from "./createPipeline.js";

/**
 * Story: Programmatic API Builder
 * Dynamically traverses upstream TDL definitions and assembles the 4-stage pipeline
 * across all vouchers, masters, and company functions.
 */
const buildApi = ({ tdl, schemas = {} }) => {
    const stages = {
        asIs: {},
        cleaned: {},
        selected: {},
        normalized: {}
    };

    // 1. Build Company API
    let companyApi;
    if (typeof tdl.company === "function") {
        companyApi = createPipeline({
            fetchFn: tdl.company,
            selectJson: schemas?.company?.select,
            normalizeJson: schemas?.company?.normalize
        });

        stages.asIs.company = companyApi.asIs;
        stages.cleaned.company = companyApi.cleaned;
        stages.selected.company = companyApi.selected;
        stages.normalized.company = companyApi.normalized;
    }

    // 2. Build Vouchers API
    const vouchersApi = {
        asIs: {},
        cleaned: {},
        selected: {},
        normalized: {}
    };
    stages.asIs.vouchers = vouchersApi.asIs;
    stages.cleaned.vouchers = vouchersApi.cleaned;
    stages.selected.vouchers = vouchersApi.selected;
    stages.normalized.vouchers = vouchersApi.normalized;

    if (tdl.vouchers && typeof tdl.vouchers === "object") {
        Object.entries(tdl.vouchers).forEach(([voucherName, voucherGroup]) => {
            const voucherSchema = schemas?.vouchers?.[voucherName] || {};
            const entityApi = {
                asIs: {},
                cleaned: {},
                selected: {},
                normalized: {}
            };

            Object.entries(voucherGroup).forEach(([methodName, methodFn]) => {
                if (typeof methodFn === "function") {
                    const pipeline = createPipeline({
                        fetchFn: methodFn,
                        selectJson: voucherSchema.select,
                        normalizeJson: voucherSchema.normalize
                    });

                    // Direct callable with method attached steps: vouchers.purchases.period.asIs
                    entityApi[methodName] = pipeline;

                    // Entity stage namespace: vouchers.purchases.asIs.period
                    entityApi.asIs[methodName] = pipeline.asIs;
                    entityApi.cleaned[methodName] = pipeline.cleaned;
                    entityApi.selected[methodName] = pipeline.selected;
                    entityApi.normalized[methodName] = pipeline.normalized;
                }
            });

            vouchersApi[voucherName] = entityApi;
            vouchersApi.asIs[voucherName] = entityApi.asIs;
            vouchersApi.cleaned[voucherName] = entityApi.cleaned;
            vouchersApi.selected[voucherName] = entityApi.selected;
            vouchersApi.normalized[voucherName] = entityApi.normalized;
        });
    }

    // 3. Build Masters API
    const mastersApi = {
        asIs: {},
        cleaned: {},
        selected: {},
        normalized: {}
    };
    stages.asIs.masters = mastersApi.asIs;
    stages.cleaned.masters = mastersApi.cleaned;
    stages.selected.masters = mastersApi.selected;
    stages.normalized.masters = mastersApi.normalized;

    if (tdl.masters && typeof tdl.masters === "object") {
        Object.entries(tdl.masters).forEach(([key, val]) => {
            if (typeof val === "function") {
                const masterSchema = schemas?.masters?.[key] || {};
                const pipeline = createPipeline({
                    fetchFn: val,
                    selectJson: masterSchema.select,
                    normalizeJson: masterSchema.normalize
                });

                mastersApi[key] = pipeline;
                mastersApi.asIs[key] = pipeline.asIs;
                mastersApi.cleaned[key] = pipeline.cleaned;
                mastersApi.selected[key] = pipeline.selected;
                mastersApi.normalized[key] = pipeline.normalized;
            } else if (typeof val === "object" && val !== null) {
                // For sub-entities like masters.uom, masters.stockItems
                const subEntitySchema = schemas?.masters?.[key] || {};
                const subEntityApi = {
                    asIs: {},
                    cleaned: {},
                    selected: {},
                    normalized: {}
                };

                Object.entries(val).forEach(([methodName, methodFn]) => {
                    if (typeof methodFn === "function") {
                        const pipeline = createPipeline({
                            fetchFn: methodFn,
                            selectJson: subEntitySchema.select,
                            normalizeJson: subEntitySchema.normalize
                        });

                        subEntityApi[methodName] = pipeline;
                        subEntityApi.asIs[methodName] = pipeline.asIs;
                        subEntityApi.cleaned[methodName] = pipeline.cleaned;
                        subEntityApi.selected[methodName] = pipeline.selected;
                        subEntityApi.normalized[methodName] = pipeline.normalized;
                    }
                });

                mastersApi[key] = subEntityApi;
                mastersApi.asIs[key] = subEntityApi.asIs;
                mastersApi.cleaned[key] = subEntityApi.cleaned;
                mastersApi.selected[key] = subEntityApi.selected;
                mastersApi.normalized[key] = subEntityApi.normalized;
            }
        });
    }

    return {
        company: companyApi,
        vouchers: vouchersApi,
        masters: mastersApi,
        asIs: stages.asIs,
        cleaned: stages.cleaned,
        selected: stages.selected,
        normalized: stages.normalized
    };
};

export { buildApi };
export default buildApi;
