export type Subject = {
    name: string;
    amountInWeek: number;
};

export type Teacher = {
    name: string;
    subjects: Subject[];
};

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
