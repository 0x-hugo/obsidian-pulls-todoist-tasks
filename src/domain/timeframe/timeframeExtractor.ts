import { moment, Notice } from "obsidian";

export const CONSTANTS_SEGMENTS: any = {
    templatedSegmentStart: "%% TCT_TEMPLATED_START 1999-12-01 00:00 %%",
    templatedSegmentEnd: "%% TCT_TEMPLATED_END 2022-04-28 23:59 %%",
};

export const CONSTANTS_REGEX: any = {
    regexStartCompiled: new RegExp(
        `(${CONSTANTS_SEGMENTS.templatedSegmentStart.slice(0, 22)})` +
        "+( \\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2} )+" +
        `(${CONSTANTS_SEGMENTS.templatedSegmentStart.slice(0, 2)})`,
        "g"
    ),
    regexEndCompiled: new RegExp(
        `(${CONSTANTS_SEGMENTS.templatedSegmentEnd.slice(0, 20)})` +
        "+( \\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2} )+" +
        `(${CONSTANTS_SEGMENTS.templatedSegmentEnd.slice(0, 2)})`,
        "g"
    ),
};

function extractTimeRangeFromFile(fileContent: string): any {
    const startString: string[] = fileContent.match(CONSTANTS_REGEX.regexStartCompiled);
    const endString: string[] = fileContent.match(CONSTANTS_REGEX.regexEndCompiled);

    let datetimeRegex = /(\d{4}-\d{2}-\d{2} \d{2}:\d{2})/;
    const startDateString = startString[0].match(datetimeRegex);
    const endDateString = endString[0].match(datetimeRegex);

    let currentTimeObj = new Date();
    let startTimeObj = new Date(startDateString[0]);
    let endTimeObj = new Date(endDateString[0]);

    const taskStartInServerTime =
        startTimeObj.getTime() + currentTimeObj.getTimezoneOffset() * 60 * 1000;
    const timeStartFormattedDate: string = moment(taskStartInServerTime).format(
        "YYYY-MM-DD"
    );
    const timeStartFormattedTime: string = moment(taskStartInServerTime).format(
        "HH:mm"
    );

    const taskEndInServerTime =
        endTimeObj.getTime() + currentTimeObj.getTimezoneOffset() * 60 * 1000;
    const timeEndFormattedDate: string =
        moment(taskEndInServerTime).format("YYYY-MM-DD");
    const timeEndFormattedTime: string = moment(taskEndInServerTime).format("HH:mm");

    if (
        timeStartFormattedDate === "Invalid date" ||
        timeEndFormattedDate === "Invalid date"
    ) {
        return null;
    }

    const result = {
        timeStartFormattedDate,
        timeStartFormattedTime,
        timeEndFormattedDate,
        timeEndFormattedTime,
        startString,
        endString,
    }

    console.log("found firesult", result);

    return result;
}

function hasFileParams(fileContent: string) {
    const startString = fileContent.match(CONSTANTS_REGEX.regexStartCompiled);
    const endString = fileContent.match(CONSTANTS_REGEX.regexEndCompiled);

    if (startString === null || endString === null) {
        new Notice(
            `Keyword segment not found in current file. You are using templated segments. ` +
            `\nPlease follow this format: \n${CONSTANTS_SEGMENTS.templatedSegmentStart} \n${CONSTANTS_SEGMENTS.templatedSegmentEnd}`,
            10000
        );
        return false;
    }

    return true;
}

export {
    extractTimeRangeFromFile,
    hasFileParams,
};
