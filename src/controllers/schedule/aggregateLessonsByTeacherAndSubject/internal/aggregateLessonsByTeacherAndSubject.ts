import { getHrefsWithClassNames, parseClassSchedule } from "../../../../lib/scraper";

import { LessonDataType, type LessonSchedule } from "../../../../lib/scraper/types";

import type { ClassTeacherSubjectHours, SubjectHourCount, TeacherSubjectHours } from "../types";

export async function aggregateLessonsByTeacherAndSubject(schedulesUrl: URL, hrefRegex: RegExp, scheduleBaseURL: string): Promise<ClassTeacherSubjectHours> {

    const hrefsWithClassNames = await getHrefsWithClassNames(schedulesUrl, hrefRegex, "a[href]");

    const result: ClassTeacherSubjectHours = {};

    for (const { href, className } of hrefsWithClassNames) {

        const schedule = await parseClassSchedule(new URL(href, scheduleBaseURL));

        const aggregatedClassSchedule = aggregateSingleClassLessonsByTeacherAndSubject(schedule);

        result[className] = aggregatedClassSchedule;
    }

    return result;
}

function aggregateSingleClassLessonsByTeacherAndSubject(schedule: LessonSchedule): TeacherSubjectHours {

    const teacherSubjectHours: TeacherSubjectHours = {
        teachers: {},
        uncategorized: {}
    };

    for (const day of schedule) {

        for (const hour of day) {

            if (hour === null) {
                continue;
            }

            for (const lesson of hour) {

                if (lesson.type == LessonDataType.Unparsed) {
                    const uncategorizedLesson = getOrInsertComputed(teacherSubjectHours.uncategorized, lesson.data, () => ({ count: 0 }));
                    uncategorizedLesson.count++;
                    continue;
                }

                const subjects: SubjectHourCount = getOrInsertComputed(teacherSubjectHours.teachers, lesson.teacher, () => ({}));
                subjects[lesson.subject] = (subjects[lesson.subject] ?? 0) + 1;
            }
        }
    }

    return teacherSubjectHours;
}

function getOrInsertComputed<V>(records: Record<string, V>, key: string, callback: () => V): V {

    const existing = records[key];

    if (existing !== undefined) {
        return existing;
    }

    const value = callback();
    records[key] = value;

    return value;
}
