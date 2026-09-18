/* ===================================================================
   מקדמיה — הגדרות תוכן
   כאן מרוכז כל מה שמתחלף: מספרים, לינקים, רילים, לוגואים.
   עדכון כאן מתעדכן אוטומטית בשני העמודים.
   =================================================================== */

window.SITE_CONFIG = {
  // מספר וואטסאפ בפורמט בינלאומי בלי + (למשל: '972501234567').
  // כל עוד ריק — כפתורי הוואטסאפ מפנים לטופס.
  whatsappNumber: '',

  // לינקים לרשתות
  instagramUrl: 'https://www.instagram.com/macadamia.il',
  tiktokUrl: '',
  facebookUrl: '',

  // הירו: באיזה אחוז מאורך הסרטון לעצור (הפריים שבו הלוגואים באוויר)
  heroFreezePct: 85,

  // מונים — הערכים הסופיים. null = עדיין placeholder
  counters: {
    views: { value: 7, suffix: 'M+', label: 'הצפיות שפיצחנו' },
    likes: { value: 500, suffix: 'K+', label: 'לייקים שאספנו' },
    comments: { value: 20, suffix: 'K+', label: 'תגובות שקיבלו העסקים שלנו' },
    activeClients: { value: null, suffix: '', label: 'לקוחות פעילים' } // [X] עד שיהיה מספר אמיתי
  },

  // רילים לסקשן העבודות. כשיש קבצים אמיתיים:
  // { src: 'assets/reels/reel-1.mp4', client: 'שם הלקוח', views: '1.2M' }
  // כל עוד src ריק — מוצג placeholder מסומן.
  reels: [
    { src: '', client: '', views: '' },
    { src: '', client: '', views: '' },
    { src: '', client: '', views: '' },
    { src: '', client: '', views: '' },
    { src: '', client: '', views: '' },
    { src: '', client: '', views: '' }
  ],

  // לוגואי לקוחות ל-marquee. כשיש קבצים:
  // { src: 'assets/clients/logo-1.png', name: 'שם העסק' }
  clientLogos: []
};
