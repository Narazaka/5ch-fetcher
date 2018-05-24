import { fetch, Post, Posts, Thread } from "2ch-fetcher";
import * as cheerio from "cheerio";
import * as moment from "moment-timezone";

const dateAndIdStrRe = /^(\d+)\D+(\d+)\D+(\d+)\D+(\d+)\D+(\d+)\D+(\d+)\D+(\d+)/;

export async function fetch5chPosts(thread: Thread) {
    const posts = parseContent(await fetch(thread.readUrl));

    return new Posts(posts);
}

function parseContent(content: string) {
    const $ = cheerio.load(content);

    return $(".post").toArray().map((elem) => parsePost($(elem)));
}

function parsePost($elem: Cheerio) {
    const index = Number($elem.find(".number").text());
    const $nameElem = $elem.find(".name");
    const name = $nameElem.text();
    const href = $nameElem.find("a").attr("href");
    const email = href ? href.replace(/^mailto:/, "") : "";
    const result = dateAndIdStrRe.exec($elem.find(".date").text());
    if (!result) return undefined;
    const date = moment.tz(
        [
            Number(result[1]),
            Number(result[2]) - 1,
            Number(result[3]),
            Number(result[4]),
            Number(result[5]),
            Number(result[6]),
            Number(result[7]) * 10,
        ],
        "Asia/Tokyo",
    )
        .toDate();
    const id = $elem.find(".uid").text().replace(/^ID:/, "");
    const body = decode($elem.find(".message .escaped").html() as string);

    return new Post({index, name, email, date, id, body});
}

function decode(str: string) {
    return str.replace(/&#x([^;]+);/g, (_, part) => String.fromCharCode(parseInt(part, 16)));
}
