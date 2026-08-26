import * as cheerio from 'cheerio';
import type { Element } from 'domhandler';

import { LessonData, LessonDataType, LessonSchedule, ParsedLessonData, UnparsedLessonData } from "../types.js";

import { fetchHTML } from './fetchHTML.js';

export async function parseClassSchedule(scheduleUrl: URL): Promise<LessonSchedule> {

    const html = await fetchHTML(scheduleUrl);
    const $: cheerio.CheerioAPI = cheerio.load(html);

    const DAYS_IN_SCHEDULE = 5;
    const schedule: LessonSchedule = Array.from({ length: DAYS_IN_SCHEDULE }, () => []);

    // skip the first row, which contains only meta data
    const rows = $('table[class="tabela"] tr').not(':first');

    for (const row of rows) {

        for (let dayIndex = 0; dayIndex < DAYS_IN_SCHEDULE; ++dayIndex) {

            const cell = $(row).find('td[class="l"]').eq(dayIndex);

            const lesson = parseLessonCell($, cell);
            schedule[dayIndex]?.push(lesson);
        }
    }

    return schedule;
}

function parseLessonCell($: cheerio.CheerioAPI, cell: cheerio.Cheerio<Element>): LessonData[] | null {

    if ($(cell).text().replace(/\u00a0/g, '').trim() === '') {
        return null;
    }

    const result: LessonData[] = [];

    const spans = $(cell).children('span:not([class])');
    const lessons = spans.length > 0 ? spans : $(cell);

    for (const lesson of lessons) {
        const subjectItems = $(lesson).children('[class="p"]');
        const teacherItems = $(lesson).children('[class="n"]');
        const classroomItems = $(lesson).children('[class="s"]');

        if (subjectItems.length == 1
            && teacherItems.length == 1
            && classroomItems.length == 1) {

            const parsedLesson: ParsedLessonData = {
                type: LessonDataType.Parsed,

                subject: $(subjectItems).text(),
                classroom: $(classroomItems).text(),
                teacher: $(teacherItems).text()
            };

            result.push(parsedLesson);
            continue;
        }

        const unparsedLesson: UnparsedLessonData = {
            type: LessonDataType.Unparsed,

            data: $(lesson).text()
        };
        result.push(unparsedLesson);
    }

    return result;
}
