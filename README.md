# NDT Cert Study

NDT certification exam-prep app. Expo / React Native / TypeScript, local-first with Zustand + AsyncStorage. The first module is ASNT UT Level II (Conventional), bundling a 355-question bank. The architecture is built to add further certification modules (PAUT, CSWIP, API) as the bank grows.

## Status

Phase 1, text questions only. The question bank is a DRAFT pending technical review (every keyed answer is provisional until verified). Diagrams and Supabase cloud sync are not in this phase.

## Run it

```bash
cd ndt-cert-study
npm install
npx expo install   # aligns native deps to the Expo SDK
npx expo start
```

Then press `i` for the iOS simulator, or scan the QR code with Expo Go on a phone. Android works the same (`a`).

If `npm install` resolves odd versions, delete `node_modules` and `package-lock.json` and run `npx expo install` to let Expo pick SDK-matched versions.

## What works

- Shelf home that opens straight into the one owned module
- Mastery map: a tile per topic block with a readiness percentage, plus Practice all, Mock exam, and Saved
- Practice mode: one question at a time, immediate feedback, explanation first, then per-distractor rationale; the correct answer and your wrong pick both stay visible
- Exam mode: timed, no feedback until the end, then a per-topic score breakdown
- Imperial / metric toggle on the dual-unit questions
- Bookmark (star) and report (flag) on every question
- Progress and a simple Leitner box per question; practice serves weak questions first
- All state persists locally between launches

## Architecture

```
app/
  _layout.tsx          Stack navigator (Expo Router)
  index.tsx            shelf / home
  module/[id].tsx      mastery map
  session.tsx          practice + exam (one screen, mode param)
  results.tsx          exam score + per-topic breakdown
  bookmarks.tsx        saved questions review
components/             OptionButton, FeedbackBlock, TopicTile, ProgressBar, UnitToggle
lib/
  types.ts             question schema types
  theme.ts             Steel & Amber tokens + block labels
  bank.ts              loads assets/bank.json, selectors, unit-variant resolver
  store.ts             Zustand store (persist), readiness + weak-first helpers
assets/
  bank.json            the 355-question bank (single source of truth)
```

## Updating questions

Replace `assets/bank.json` with a new export from the question-bank generator. The schema is fixed: each question has either `content` (unit-neutral) or `variants.imperial` / `variants.metric` (dual-unit), and `answer` is the 0-based index of the correct option.

## Next phases (not built yet)

- Diagram questions (A-scans, calibration blocks, beam paths): add an image field renderer; the schema already reserves `diagram`.
- Calc workspace screen (pinned diagram + formula drawer) for calculation and diagram questions.
- Supabase cloud sync for cross-device progress.
- Dark mode.
- The PAUT bank as a second module on the shelf, which also turns the shelf into the storefront for locked modules.

## Theme

Steel & Amber, light only for now. Tokens live in `lib/theme.ts`; change them there to reskin.
