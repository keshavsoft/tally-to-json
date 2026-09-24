import { masters } from "tally-to-xml-tdl";
import cleanTallyResponse from "tally-clean-response";

const get = async (company, jsonId) => {
    const jsonToReturn = await masters.get(company, jsonId);
    const cleaned = cleanTallyResponse(jsonToReturn);

    return await cleaned;
};

export { get };