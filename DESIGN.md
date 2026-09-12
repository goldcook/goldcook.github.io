# Design Direction

The site is a warm 16-bit RPG save file about entering working life while continuing to learn and live well.

## Five non-negotiable principles

1. The page should feel like a personal game world, not a developer dashboard or technical resume.
2. Pixel styling comes from hard borders, stepped motion, simple shapes, map language, and game UI. It should not reduce readability.
3. Use warm outdoor colors: sky blue, grass green, sunset coral, cream paper, and deep navy.
4. Navigation follows a game loop: opening screen, world map, independent scenes, and a persistent return-to-map action.
5. Motion and audio are optional enhancements. The page remains understandable with reduced motion, muted audio, or JavaScript unavailable.

## Navigation model

- The opening screen introduces Goldcook and leads to the world map.
- The world map is the primary directory; top navigation does not duplicate every destination.
- Work, growth, life, reflection, and mailbox are parallel map locations with a persistent return-to-map control.
- Map roads visually terminate at every destination, with bridges wherever routes cross the river.
- Desktop scenes fit inside one viewport without vertical scrolling; mobile keeps a natural document flow.

## Content boundaries

- Do not display employer, team, title, private diary entries, private photos, or social feeds.
- Gmail is the only contact channel and is shown directly in the mailbox section.
- The floating player contains three original procedural BGM loops; copyrighted melodies are never copied, adapted, or hosted.
- Repeatable content lives in `content.js` and should be curated rather than automatically synchronized.
