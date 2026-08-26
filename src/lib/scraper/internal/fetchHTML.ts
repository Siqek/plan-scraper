export async function fetchHTML(url: URL): Promise<string> {

    try {
        const res = await fetch(url);
        const html = await res.text();
        return html;

    } catch (e) {
        console.error(e);
    }

    return "";
}
