export enum LessonDataType {
    Parsed = "Parsed",
    Unparsed = "Unparsed",
};

export type ParsedLessonData = {
    type: LessonDataType.Parsed;

    subject: string;
    classroom: string;
    teacher: string;
};

export type UnparsedLessonData = {
    type: LessonDataType.Unparsed

    data: string;
};

export type LessonData = ParsedLessonData | UnparsedLessonData;

export type LessonSlot = LessonData[] | null;
export type LessonDay = LessonSlot[];
export type LessonSchedule = LessonDay[];
