import { readFile, writeFile } from "node:fs/promises";

const playlistId = process.env.QQ_PLAYLIST_ID?.trim();
if (!playlistId || !/^\d+$/.test(playlistId)) {
  throw new Error("QQ_PLAYLIST_ID is missing or invalid");
}
const endpoint = new URL("https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg");
endpoint.search = new URLSearchParams({
  type: "1",
  json: "1",
  utf8: "1",
  onlysong: "0",
  disstid: playlistId,
  format: "json",
  g_tk: "5381",
  loginUin: "0",
  hostUin: "0",
  inCharset: "utf8",
  outCharset: "utf-8",
  notice: "0",
  platform: "yqq.json",
  needNewCode: "0",
}).toString();

const response = await fetch(endpoint, {
  headers: {
    "user-agent": "Mozilla/5.0 (compatible; GoldcookHomepageSync/1.0)",
    referer: "https://y.qq.com/",
  },
  signal: AbortSignal.timeout(15_000),
});

if (!response.ok) throw new Error(`QQ Music returned HTTP ${response.status}`);

const payload = await response.json();
const sourceTracks = payload?.cdlist?.[0]?.songlist;
if (!Array.isArray(sourceTracks) || sourceTracks.length < 3) {
  throw new Error("QQ Music playlist response did not contain at least three tracks");
}

const tracks = sourceTracks.slice(0, 3).map((track) => {
  const title = track.songname?.trim();
  const artist = track.singer?.map((singer) => singer.name?.trim()).filter(Boolean).join(" / ");
  const songMid = track.songmid?.trim();
  if (!title || !artist || !songMid || !/^[A-Za-z0-9]+$/.test(songMid)) {
    throw new Error("QQ Music returned an invalid track record");
  }
  return { title, artist, url: `https://y.qq.com/n/ryqq/songDetail/${songMid}` };
});

const contentPath = new URL("../content.js", import.meta.url);
const content = await readFile(contentPath, "utf8");
const startMarker = "  // QQ_MUSIC_SYNC_START";
const endMarker = "  // QQ_MUSIC_SYNC_END";
const start = content.indexOf(startMarker);
const end = content.indexOf(endMarker);
if (start === -1 || end === -1 || end <= start) throw new Error("QQ Music sync markers are missing or invalid");

const lines = tracks.map((track) => `    { title: ${JSON.stringify(track.title)}, artist: ${JSON.stringify(track.artist)}, url: ${JSON.stringify(track.url)} },`).join("\n");
const replacement = `${startMarker}\n  recentTracks: [\n${lines}\n  ],\n`;
const updated = `${content.slice(0, start)}${replacement}${content.slice(end)}`;

if (updated !== content) {
  await writeFile(contentPath, updated);
  console.log(`Updated homepage with ${tracks.length} tracks from the configured QQ Music playlist.`);
} else {
  console.log("QQ Music tracks are already up to date.");
}
