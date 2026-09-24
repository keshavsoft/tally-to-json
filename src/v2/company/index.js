
import { company } from "tally-to-xml-tdl";
import cleanTallyResponse from "tally-clean-response";

const startFunc = async (showLog = false) => {
    const jsonToReturn = await company();
    const cleaned = cleanTallyResponse(jsonToReturn);

    return await cleaned;
};

export default startFunc;