import { Request, Response } from "express";

import { aggregateLessonsByTeacherAndSubject as impl } from "./internal/aggregateLessonsByTeacherAndSubject";

const HREF_REGEX: RegExp = /plany\/o\d+\.html/;
const SCHEDULES_URL: URL = new URL("https://plan.zs1mm.edu.pl/nauczycielezs1/lista.html");
const SCHEDULE_BASE_URL = "https://plan.zs1mm.edu.pl/nauczycielezs1/";

export default async function aggregateLessonsByTeacherAndSubject(req: Request, res: Response) {
    res.json(await impl(SCHEDULES_URL, HREF_REGEX, SCHEDULE_BASE_URL));
}
