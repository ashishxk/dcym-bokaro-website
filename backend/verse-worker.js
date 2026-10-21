/* Verse proxy for DCYM Bokaro Parish (Cloudflare Worker, free plan).
   Browsers cannot read another website directly, so this small server-side function reads the latest
   "Today's Promise" entry from jesuscalls.org, pulls out the Bible verse and its reference, and returns
   them as JSON that the parish website can use. If anything fails, the website falls back to its own daily verse.
   Please keep the credit and link to Jesus Calls on the website, and consider asking Jesus Calls for permission. */
const LIST = "https://www.jesuscalls.org/today-promise";
const UA = { "User-Agent": "DCYM-Bokaro-Parish-website (verse of the day)" };
const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", ldquo: "“", rdquo: "”", lsquo: "‘", rsquo: "’", hellip: "…", ndash: "–", mdash: "—" };
const decode = s => s.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n)).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16))).replace(/&([a-z]+);/gi, (m, n) => ENT[n.toLowerCase()] || m);
const toText = html => decode(html.replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
/* Finds a Bible reference followed shortly by a quoted verse, e.g. 'Ruth 2:12, which says, “May the Lord ...”' */
const REF = "((?:[1-3]|I{1,3})\\s?[A-Z][a-z]+(?:\\s(?:of\\s)?[A-Z][a-z]+)?|[A-Z][a-z]+(?:\\s(?:of\\s)?[A-Z][a-z]+)?)\\s(\\d{1,3}:\\d{1,3}(?:[-–]\\d{1,3})?)";
export function parseVerse(text) {
  const re = new RegExp(REF + "[^“\"”]{0,90}[“\"]([^”\"]{12,500})[”\"]", "g");
  let m;
  while ((m = re.exec(text))) { return { ref: m[1] + " " + m[2], text: m[3].trim() }; }
  return null;
}
export default {
  async fetch(request) {
    const headers = { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json; charset=utf-8", "Cache-Control": "public, max-age=1800" };
    try {
      const list = await (await fetch(LIST, { headers: UA, cf: { cacheTtl: 1800 } })).text();
      const link = list.match(/href="(https:\/\/www\.jesuscalls\.org\/today-promise\/[^"#?]+)"/);
      if (!link) throw new Error("no entry found");
      const page = await (await fetch(link[1], { headers: UA, cf: { cacheTtl: 1800 } })).text();
      const title = decode((page.match(/<title>([^<]*)<\/title>/i) || [, ""])[1]).trim();
      const verse = parseVerse(toText(page));
      if (!verse) throw new Error("no verse found");
      return new Response(JSON.stringify({ ...verse, title, url: link[1], source: "Jesus Calls, Today’s Promise", fetched: new Date().toISOString() }), { headers });
    } catch (e) {
      return new Response(JSON.stringify({ error: String(e.message || e) }), { status: 502, headers });
    }
  }
};
