var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const _2ch_fetcher_1 = require("2ch-fetcher");
const cheerio = require("cheerio");
const moment = require("moment-timezone");
const dateAndIdStrRe = /^(\d+)\D+(\d+)\D+(\d+)\D+(\d+)\D+(\d+)\D+(\d+)\D+(\d+)/;
function fetch5chPosts(thread) {
    return __awaiter(this, void 0, void 0, function* () {
        const posts = parseContent(yield _2ch_fetcher_1.fetch(thread.readUrl));
        return new _2ch_fetcher_1.Posts(posts);
    });
}
exports.fetch5chPosts = fetch5chPosts;
function parseContent(content) {
    const $ = cheerio.load(content);
    return $(".post").toArray().map((elem) => parsePost($(elem)));
}
function parsePost($elem) {
    const index = Number($elem.find(".number").text());
    const $nameElem = $elem.find(".name");
    const name = $nameElem.text();
    const href = $nameElem.find("a").attr("href");
    const email = href ? href.replace(/^mailto:/, "") : "";
    const result = dateAndIdStrRe.exec($elem.find(".date").text());
    if (!result)
        return undefined;
    const date = moment.tz([
        Number(result[1]),
        Number(result[2]) - 1,
        Number(result[3]),
        Number(result[4]),
        Number(result[5]),
        Number(result[6]),
        Number(result[7]) * 10,
    ], "Asia/Tokyo")
        .toDate();
    const id = $elem.find(".uid").text().replace(/^ID:/, "");
    const body = decode($elem.find(".message .escaped").html());
    return new _2ch_fetcher_1.Post({ index, name, email, date, id, body });
}
function decode(str) {
    return str.replace(/&#x([^;]+);/g, (_, part) => String.fromCharCode(parseInt(part, 16)));
}
//# sourceMappingURL=fetch5chPosts.js.map