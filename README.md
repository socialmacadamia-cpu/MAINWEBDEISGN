# מקדמיה — אתר הסוכנות 🥜

אתר שיווקי בעברית מלאה (RTL) לסוכנות הקריאייטיב והסושיאל **מקדמיה**.
שני עמודים: דף בית (`index.html`) ועמוד קורס (`course.html`).

נבנה כאתר סטטי נקי — HTML + CSS + JS בלבד, בלי תלויות ובלי build. אפשר להעלות אותו כמו שהוא ל-GitHub Pages / Netlify / Vercel.

## מבנה הפרויקט

```
index.html          דף הבית
course.html         עמוד הקורס
css/main.css        כל העיצוב (design tokens בראש הקובץ)
js/config.js        ⭐ הגדרות תוכן — כאן מחליפים לינקים, מספרים, רילים ולוגואים
js/main.js          כל האנימציות והלוגיקה
assets/             מדיה: סרטון הירו, לוגו
design-reference/   מסמכי המפרט המקוריים מהעיצוב
```

## הרצה מקומית

לפתוח `index.html` בדפדפן, או להריץ שרת מקומי:

```bash
python3 -m http.server 8000
# ואז לגלוש ל: http://localhost:8000
```

## איך מחליפים דברים ⭐

### סרטון הירו
הסרטון קיים בשני פורמטים כדי לכסות את כל הדפדפנים, בתוספת תמונת poster:
- `assets/hero-nut.webm` (VP9, ~2MB) — קל יותר, מועדף ברוב הדפדפנים
- `assets/hero-nut.mp4` (H.264, ~6MB) — גיבוי (ספארי/iOS ישנים)
- `assets/hero-poster.jpg` — נראה מיד עד שהסרטון נטען

המקור היה 70MB ב-4K/HEVC; דחסתי ל-2560px H.264/VP9 בלי אובדן איכות מורגש.
להחלפה: לקודד את הסרטון החדש לשני הפורמטים (למשל עם ffmpeg — ראה למטה) ולהחליף את שני הקבצים.
נקודת העצירה (הפריים שבו הלוגואים באוויר) נשלטת ב-`js/config.js` → `heroFreezePct` (85% כברירת מחדל).

פקודות הקידוד ששימשו (מ-ffmpeg):
```bash
ffmpeg -i מקור.mp4 -vf scale=2560:-2 -c:v libx264 -crf 20 -preset slow -g 12 -pix_fmt yuv420p -an -movflags +faststart hero-nut.mp4
ffmpeg -i מקור.mp4 -vf scale=2560:-2 -c:v libvpx-vp9 -crf 27 -b:v 0 -g 12 -row-mt 1 -an hero-nut.webm
ffmpeg -ss 8.5 -i hero-nut.mp4 -frames:v 1 -q:v 3 hero-poster.jpg
```
(ה-`-g 12` חשוב — keyframe כל חצי שנייה כדי שהעצירה על הפריים תעבוד חלק.)

### מספר וואטסאפ
`js/config.js` → `whatsappNumber` בפורמט בינלאומי בלי + (למשל `972501234567`).
כל כפתורי הוואטסאפ בשני העמודים יתעדכנו אוטומטית.

### לינקים לרשתות
`js/config.js` → `instagramUrl` / `tiktokUrl` / `facebookUrl`.

### רילים (סקשן העבודות)
לשים את הקבצים ב-`assets/reels/` ולעדכן ב-`js/config.js`:

```js
reels: [
  { src: 'assets/reels/reel-1.mp4', client: 'שם הלקוח', views: '1.2M' },
  ...
]
```

הטלפונים הצפים והקרוסלה במובייל יתמלאו אוטומטית (ניגון ב-hover בדסקטופ, בלחיצה במובייל).

### לוגואי לקוחות (marquee)
לשים קבצי PNG/SVG שקופים ב-`assets/clients/` ולעדכן ב-`js/config.js`:

```js
clientLogos: [
  { src: 'assets/clients/logo-1.png', name: 'שם העסק' },
  ...
]
```

### מונים (7M+ / 500K+ / ...)
`js/config.js` → `counters`. כשיהיה מספר לקוחות אמיתי — לעדכן את `activeClients.value`.

### אייקוני השירותים
האייקונים הם SVG inline ב-`index.html` בסקשן `#services` (מסומנים בהערה). כשמגיעים האייקונים הייחודיים — להחליף את תגי ה-`<svg>`.

### תמונות שמעון
- דף בית, סקשן אודות: להחליף את ה-placeholder ב-`<img src="assets/shimon-1.jpg">` (יש הערה בקוד).
- עמוד קורס, הירו: אותו דבר עם `shimon-2.jpg`.

### חיבור הטופס
הטופס כרגע מציג הודעת הצלחה בלבד. לחיבור אמיתי (מייל/וובהוק) — לעדכן את ה-handler ב-`js/main.js` (מסומן `TODO`), למשל שליחת `fetch` ל-webhook של Make/Zapier או שירות כמו Formspree.

## מה עדיין placeholder (מסומן [סוגריים] באתר)

- רילים + שמות לקוחות + מספרי צפיות
- לוגואי לקוחות
- תמונות שמעון + ריל מוטמע
- עדויות לקוחות ובוגרים
- מספר לקוחות פעילים
- מספר וואטסאפ + יעד שליחת הטופס
- סילבוס הקורס, פורמט, מחיר, FAQ קורס
- פירוט סופי של החבילות

לפי המפרט: **לא ממציאים** מספרים, שמות, עדויות או מחירים.
