import * as cheerio from "cheerio";

import { fetchHTML } from "./fetchHTML";
import type { HrefWithClassName } from "../types";

export async function getHrefsWithClassNames(url: URL, hrefRegex: RegExp, itemSelector: string): Promise<HrefWithClassName[]> {

    const html = await fetchHTML(url);
    const $ = cheerio.load(html);

    const matchingItems = $(itemSelector)
        .filter((_, el) => hrefRegex.test($(el).attr('href') ?? ""));

    const hrefsWithClassNames = matchingItems.map((_, el) => {
        const elem = $(el);
        return {
            href: elem.attr('href') ?? "",
            className: elem.text()
        }
    }).get();

    return hrefsWithClassNames;
}
