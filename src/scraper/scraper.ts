import * as cheerio from 'cheerio';
import type { Element } from 'domhandler';

import { LessonData, LessonDataType, ParsedLessonData, UnparsedLessonData } from "./types.js";

/**
 * class -> teachers
 *      each teacher -> subjects
 *          subject -> amount of lessons
 */

/**
 * class id -> class url -> schedule (html) -> scrape -> [cache?] -> return
 */


const TEMP_LINK: string = "https://plan.zs1mm.edu.pl/nauczycielezs1/plany/o26.html";

async function fetchHTML(url: URL): Promise<string> {

    try {
        const res = await fetch(url);
        const html = await res.text();
        return html;

    } catch (e) {
        console.error(e);
    }

    return "";
}

async function parseClassSchedule(scheduleUrl: URL): Promise<(LessonData[] | null)[][]> {

    const html = await fetchHTML(scheduleUrl);
    const $: cheerio.CheerioAPI = cheerio.load(html);

    const result: (LessonData[] | null)[][] = [];

    // extract all schedule rows and skip the first row that contains only meta data
    const rows = $('table[class="tabela"] tr').not('tr:first');

    for (const row of rows) {

        // extract all lesson cells
        const cells = $(row).find('td[class="l"]');

        const lessons: (LessonData[] | null)[] = [];

        for (const cell of cells) {

            const lesson = parseLessonCell($, cell);

            if (lesson === null) {
                lessons.push(null);
                continue;
            }

            lessons.push(lesson);
        }

        result.push(lessons);
    }

    return result;
}

function parseLessonCell($: cheerio.CheerioAPI, cell: Element): LessonData[] | null {

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

(async function main() {
    console.log(await parseClassSchedule(new URL(TEMP_LINK)));
})();
