import * as tdl from "tally-to-xml-tdl";
import buildApi from "./pipeline/buildApi.js";
import schemas from "./schemas/index.js";

const api = buildApi({ tdl, schemas });

export const company = api.company;
export const vouchers = api.vouchers;
export const masters = api.masters;

// Stage Trees
export const asIs = api.asIs;
export const cleaned = api.cleaned;
export const selected = api.selected;
export const normalized = api.normalized;

export { buildApi, schemas };
export default company;
