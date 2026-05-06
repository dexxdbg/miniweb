/**
 * Track queries. Run `npm run music:sync` to fetch metadata
 * (title, artist, cover, 30s preview) from the iTunes Search API.
 *
 * Each entry can be either:
 *   - "track artist"            → quick search
 *   - { query, tag?, featured?, url? } → for badges / pinning / overriding link
 */
export type MusicQuery =
  | string
  | {
      query: string;
      tag?: string;
      featured?: boolean;
      /** override the external url returned by iTunes */
      url?: string;
      /** local MP3 in public/ (e.g. "/audio/song.mp3") — overrides the 30s preview */
      file?: string;
    };

export const musicQueries: MusicQuery[] = [
  { query: "sewerslvt MAKE-ME-SAD", url: "https://www.youtube.com/watch?v=qqMxcydQmxI&pp=ygULbWFrZS1tZS1zYWQ%3D", file: "/mms.flac", featured: true },
  { query: "the caretaker c2 misplaced in time",  url:"https://www.youtube.com/watch?v=odaoC959Xj4&pp=ygUUYzIgbWlzcGxhY2VkIGluIHRpbWU%3D", file: "/c2.flac"},
];
