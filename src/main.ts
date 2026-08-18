import { parseClassSchedule } from "./scraper/scraper";

const TEMP_LINK = "https://plan.zs1mm.edu.pl/nauczycielezs1/plany/o26.html";

(async function main() {
    console.log(await parseClassSchedule(new URL(TEMP_LINK)));
})();
