import { company } from "tally-xml-tdl";
import cleanTallyResponse from "tally-clean-response";

const startFunc = async (showLog = false) => {
    const jsonToReturn = await company.all();
    const cleaned = cleanTallyResponse(jsonToReturn);

    return await cleaned;
};

export default startFunc;
