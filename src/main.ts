import { parseClassSchedule } from "./scraper/scraper";
import { LessonDataType, LessonSchedule, UnparsedLessonData } from "./scraper/scraper.types";

const TEMP_LINK = "https://plan.zs1mm.edu.pl/nauczycielezs1/plany/o26.html";

(async function main() {
    const schedule = await parseClassSchedule(new URL(TEMP_LINK));
    const { uncategorized, teachers } = aggregateLessonCountsByTeacherAndSubject(schedule);

    console.log('uncategorized: ', uncategorized);
    console.log('teachers: ');
    for (const [teacher, subjects] of teachers.entries()) {
        for (const [subject, hours] of subjects.subjects.entries()) {
            console.log(teacher, subject, hours);
        }
    }
})();

type TeacherSubjectHours = {
    teachers: Map<string, {
        subjects: Map<string, {
            hourCount: number;
        }>;
    }>;

    uncategorized: UnparsedLessonData[];
};

function aggregateLessonCountsByTeacherAndSubject(schedule: LessonSchedule): TeacherSubjectHours {
    const teacherSubjectHours: TeacherSubjectHours = {
        teachers: new Map(),
        uncategorized: []
    };

    for (const day of schedule) {

        for (const hour of day) {

            if (hour === null) {
                continue;
            }

            for (const lesson of hour) {

                if (lesson.type == LessonDataType.Unparsed) {
                    teacherSubjectHours.uncategorized.push(lesson);
                    continue;
                }

                const subjects = getOrInsertComputed(teacherSubjectHours.teachers, lesson.teacher, () => ({ subjects: new Map() })).subjects;
                const subject = getOrInsertComputed(subjects, lesson.subject, () => ({ hourCount: 0 }));

                subject.hourCount++;
            }
        }
    }

    return teacherSubjectHours;
}

function getOrInsertComputed<K, V>(map: Map<K, V>, key: K, callback: () => V): V {

    const existing = map.get(key);

    if (existing !== undefined) {
        return existing;
    }

    const value = callback();
    map.set(key, value);

    return value;
}
