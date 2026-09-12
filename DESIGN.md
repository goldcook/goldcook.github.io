# Design Direction

The site is a warm 16-bit RPG save file about entering working life while continuing to learn and live well.

## Six non-negotiable principles

1. The page should feel like a personal game world, not a developer dashboard or technical resume.
2. Pixel styling comes from hard borders, stepped motion, simple shapes, map language, and game UI. It should not reduce readability.
3. Use warm outdoor colors: sky blue, grass green, sunset coral, cream paper, and deep navy.
4. Navigation follows a game loop: opening screen, world map, independent scenes, and a persistent return-to-map action.
5. Motion and audio are optional enhancements. The page remains understandable with reduced motion, muted audio, or JavaScript unavailable.
6. Future features extend the world without crowding the opening screen: new public material becomes a map location, while optional profile links stay hidden until populated.

## Navigation model

- The opening screen introduces Goldcook and leads to the world map.
- The world map is the primary directory; top navigation does not duplicate every destination.
- Work town, learning camp, life village, thinking tower, note house, and letter post are parallel map locations with a persistent return-to-map control.
- The background story is a special archive entered from the map frame, not a peer destination.
- The public background story exposes only short stage summaries; detailed personal memories stay outside the published build.
- Map nodes and roads are generated from `content.js`, so new locations do not require hardcoded SVG edits.
- Timeline branches are generated from the public life-stage data and can grow without rewriting the page skeleton.
- Desktop scenes fit inside one viewport without vertical scrolling; mobile keeps a natural document flow.

## Content boundaries

- Do not display employer, team, title, private diary entries, private photos, or social feeds.
- Gmail is the only contact channel and is shown directly in the mailbox section.
- The note house contains manually reviewed public text or links to posts published elsewhere. It must never ingest private diary content automatically.
- Optional social links live in `socialLinks` and remain absent from the interface while the collection is empty.
- The floating player contains three original procedural BGM loops; copyrighted melodies are never copied, adapted, or hosted.
- Repeatable content lives in `content.js`. Personal copy is curated manually; the three public QQ Music links are synchronized weekly from the designated public playlist.
