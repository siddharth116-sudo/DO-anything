# Daily 5 Words

A beginner-friendly vocabulary web app built with HTML, CSS, and Vanilla JavaScript.

## 1) Architecture and Logic (Simple Explanation)

The app has 4 files:

- `index.html`: the structure (title, date, word cards, review section)
- `style.css`: the design (clean cards, colors, responsive layout)
- `script.js`: the behavior (pick today’s 5 words, save learned words)
- `words.json`: the word database

How it works:

1. On page load, JavaScript gets today's date (example: `2026-02-27`).
2. It loads all words from `words.json`.
3. It uses a date-based seed to choose exactly 5 unique words for the day.
4. The same date always gives the same 5 words.
5. When date changes, the selected 5 words also change automatically.
6. If user clicks **Mark as Learned**, that word is saved in LocalStorage.
7. Learned words are shown in the review panel.

---

## 2) Run the app

Open `index.html` in a browser.

> Note: Some browsers block loading local JSON via `file://` for security. This project includes a fallback copy of words in `script.js` so it still works when opened directly.

---

## 3) How to add new words

Open `words.json` and add objects in this format:

```json
{
  "word": "Example",
  "meaning": "easy meaning",
  "example": "This is an example sentence.",
  "pronunciation": "ig-zam-pul"
}
```

Tips:
- Keep meanings simple.
- Keep sentences short.
- Avoid duplicate `word` values.

---

## 4) Future upgrade ideas

### Notifications
- Add browser notifications (Web Notifications API) to remind users daily.

### AI features
- Use AI to generate easy quizzes from learned words.
- Use AI to suggest similar words or synonyms.

### Backend upgrade
- Save progress on a real database so users can keep data across devices.
- Add login so each user has personal learning history.

