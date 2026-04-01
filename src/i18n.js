import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

let resources = {
  kk: {
    translation: {
      "navbar": {
        "movies": "Фильмдер",
        "anime": "Аниме",
        "login": "Кіру",
        "logout": "Шығу",
        "login_google": "Google арқылы кіру",
        "login_email": "Email / Тіркелу",
        "user_placeholder": "Пайдаланушы"
      },
      "home": {
        "banner_title": "АСПАН МЕН ЖЕР <1 /> <2>АРАСЫНДА</2> — ТЕК МЕН <3 /> ҒАНА АСҚАҚПЫН",
        "watch_movies": "Фильмдерді көру",
        "watch_anime": "Аниме көру",
        "popular_movies": "Танымал фильмдер",
        "latest_anime": "Соңғы аниме",
        "all": "Барлығы",
        "demo_mode": "Демо режимі қосулы."
      },
      "movies": {
        "title": "ФИЛЬМДЕР",
        "search": "Фильмдерді іздеу...",
        "all_genres": "Барлық жанрлар",
        "year": "Жыл",
        "prev": "Алдыңғы",
        "next": "Келесі",
        "demo_alert": "Демо режимі: Фильм деректері қазір симуляцияланған. Нақты деректер үшін TMDB_API_KEY қосыңыз.",
        "fetch_error": "Фильмдерді жүктеу сәтсіз аяқталды."
      },
      "anime": {
        "title": "АНИМЕ",
        "search": "Аниме іздеу...",
        "all_genres": "Барлық жанрлар",
        "not_found": "Іздеуге немесе жанрға сәйкес аниме табылмады.",
        "page": "Бет",
        "prev": "Алдыңғы",
        "next": "Келесі"
      },
      "details": {
        "not_found": "Мазмұн табылмады.",
        "demo_mode": "Демо режимі",
        "in_favorites": "Таңдаулыларда",
        "add_to_favorites": "Таңдаулыларға қосу",
        "in_watch_later": "Кейін көру тізімінде",
        "add_to_watch_later": "Кейін көру",
        "watch_now": "ҚАЗІР КӨРУ",
        "episode": "БӨЛІМ",
        "no_trailer": "Трейлер қолжетімсіз.",
        "min": "мин"
      },
      "favorites": {
        "title": "СІЗДІҢ ТАҢДАУЛЫЛАРЫҢЫЗ",
        "login_prompt": "Таңдаулыларды көру үшін жүйеге кіріңіз",
        "go_home": "Басты бетке",
        "empty": "Сіз әлі ештеңе қоспадыңыз.",
        "explore": "Мазмұнды зерттеу",
        "movie": "Фильм",
        "anime": "Аниме"
      },
      "filter": {
        "title": "Сұрыптау",
        "rating": "Рейтинг бойынша",
        "newest": "Жаңалар бірінші",
        "oldest": "Ескілер бірінші",
        "popularity": "Танымалдылық бойынша"
      },
      "anime_filter": {
        "favorites": "Танымал",
        "likes": "Үздік",
        "newest": "Жаңалары",
        "oldest": "Ескілері"
      },
      "reviews": {
        "title": "ПІКІРЛЕР",
        "rating": "Бағалау",
        "placeholder": "Өз ойыңызбен бөлісіңіз...",
        "send": "Жіберу",
        "anonymous": "Аноним"
      },
      "profile": {
        "history": "Қарау тарихы",
        "watch_later": "Кейін көру",
        "favorites": "Таңдаулылар",
        "my_reviews": "Менің пікірлерім",
        "profile": "Профиль",
        "login_required": "Авторизациядан өтіңіз",
        "go_home": "Басты бетке",
        "empty": "Тізім бос",
        "movie_link": "Фильмге / Анимеге",
        "change_photo": "Суретті өзгерту",
        "delete_review": "Пікірді жою",
        "movie": "ФИЛЬМ",
        "anime": "АНИМЕ",
        "logout_btn": "Шығу",
        "user_placeholder": "Пайдаланушы",
        "clear_history": "Тарихты тазарту",
        "confirm_clear_history": "Қарау тарихын толығымен жоясыз ба?",
        "invalid_file_type": "Тек сурет файлдарын жүктеуге болады (PNG, JPG, WEBP)",
        "file_too_large": "Файл өлшемі 2MB аспауы керек"
      }
    }
  },
  ru: {
    translation: {
      "navbar": {
        "movies": "Фильмы",
        "anime": "Аниме",
        "login": "Войти",
        "logout": "Выйти",
        "login_google": "Войти через Google",
        "login_email": "Email / Регистрация",
        "user_placeholder": "Пользователь"
      },
      "home": {
        "banner_title": "МЕЖДУ НЕБОМ И ЗЕМЛЕЙ <1 /> <2>ИЗ ДОСТОЙНЫХ</2> — ТОЛЬКО ЛИШЬ Я",
        "watch_movies": "Смотреть фильмы",
        "watch_anime": "Смотреть аниме",
        "popular_movies": "Популярные фильмы",
        "latest_anime": "Последние аниме",
        "all": "Все",
        "demo_mode": "Демо режим включен."
      },
      "movies": {
        "title": "ФИЛЬМЫ",
        "search": "Поиск фильмов...",
        "all_genres": "Все жанры",
        "year": "Год",
        "prev": "Назад",
        "next": "Вперед",
        "demo_alert": "Демо режим: данные фильмов симулированы. Добавьте TMDB_API_KEY для реальных данных.",
        "fetch_error": "Ошибка загрузки фильмов."
      },
      "anime": {
        "title": "АНИМЕ",
        "search": "Поиск аниме...",
        "all_genres": "Все жанры",
        "not_found": "Не найдено аниме по вашему запросу.",
        "page": "Страница",
        "prev": "Назад",
        "next": "Вперед"
      },
      "details": {
        "not_found": "Контент не найден.",
        "demo_mode": "Демо режим",
        "in_favorites": "В избранном",
        "add_to_favorites": "Добавить в избранное",
        "in_watch_later": "В списке ожидания",
        "add_to_watch_later": "Посмотреть позже",
        "watch_now": "СМОТРЕТЬ СЕЙЧАС",
        "episode": "СЕРИЯ",
        "no_trailer": "Трейлер недоступен.",
        "min": "мин"
      },
      "favorites": {
        "title": "ВАШЕ ИЗБРАННОЕ",
        "login_prompt": "Войдите, чтобы увидеть избранное",
        "go_home": "На главную",
        "empty": "Вы еще ничего не добавили.",
        "explore": "Исследовать контент",
        "movie": "Фильм",
        "anime": "Аниме"
      },
      "filter": {
        "title": "Сортировка",
        "rating": "По рейтингу",
        "newest": "Сначала новые",
        "oldest": "Сначала старые",
        "popularity": "По популярности"
      },
      "anime_filter": {
        "favorites": "Популярные",
        "likes": "Топ",
        "newest": "Сначала новые",
        "oldest": "Сначала старые"
      },
      "reviews": {
        "title": "ОТЗЫВЫ",
        "rating": "Оценка",
        "placeholder": "Поделитесь вашим мнением...",
        "send": "Отправить",
        "anonymous": "Аноним"
      },
      "profile": {
        "history": "История",
        "watch_later": "Посмотреть позже",
        "favorites": "Избранное",
        "my_reviews": "Мои отзывы",
        "profile": "Профиль",
        "login_required": "Авторизуйтесь",
        "go_home": "На главную",
        "empty": "Список пуст",
        "movie_link": "К фильму / Аниме",
        "change_photo": "Изменить фото",
        "delete_review": "Удалить отзыв",
        "movie": "ФИЛЬМ",
        "anime": "АНИМЕ",
        "logout_btn": "Выйти",
        "user_placeholder": "Пользователь",
        "clear_history": "Очистить историю",
        "confirm_clear_history": "Удалить всю историю просмотров?",
        "invalid_file_type": "Допускаются только изображения (PNG, JPG, WEBP)",
        "file_too_large": "Файл превышает 2MB"
      }
    }
  },
  en: {
    translation: {
      "navbar": {
        "movies": "Movies",
        "anime": "Anime",
        "login": "Login",
        "logout": "Logout",
        "login_google": "Sign in with Google",
        "login_email": "Email / Sign up",
        "user_placeholder": "User"
      },
      "home": {
        "banner_title": "THROUGHOUT HEAVEN AND EARTH <1 /> <2>I ALONE</2> AM THE HONORED ONE",
        "watch_movies": "Watch Movies",
        "watch_anime": "Watch Anime",
        "popular_movies": "Popular Movies",
        "latest_anime": "Latest Anime",
        "all": "All",
        "demo_mode": "Demo mode is enabled."
      },
      "movies": {
        "title": "MOVIES",
        "search": "Search movies...",
        "all_genres": "All Genres",
        "year": "Year",
        "prev": "Prev",
        "next": "Next",
        "demo_alert": "Demo mode: Movie data is currently simulated. Add TMDB_API_KEY for real data.",
        "fetch_error": "Failed to load movies."
      },
      "anime": {
        "title": "ANIME",
        "search": "Search anime...",
        "all_genres": "All Genres",
        "not_found": "No anime found matching your search or genre.",
        "page": "Page",
        "prev": "Prev",
        "next": "Next"
      },
      "details": {
        "not_found": "Content not found.",
        "demo_mode": "Demo Mode",
        "in_favorites": "In Favorites",
        "add_to_favorites": "Add to Favorites",
        "in_watch_later": "In Watch Later",
        "add_to_watch_later": "Watch Later",
        "watch_now": "WATCH NOW",
        "episode": "EPISODE",
        "no_trailer": "Trailer unavailable.",
        "min": "min"
      },
      "favorites": {
        "title": "YOUR FAVORITES",
        "login_prompt": "Please login to view favorites",
        "go_home": "Go Home",
        "empty": "You haven't added anything yet.",
        "explore": "Explore Content",
        "movie": "Movie",
        "anime": "Anime"
      },
      "filter": {
        "title": "Sort by",
        "rating": "By Rating",
        "newest": "Newest First",
        "oldest": "Oldest First",
        "popularity": "By Popularity"
      },
      "anime_filter": {
        "favorites": "Favorites",
        "likes": "Top Rated",
        "newest": "Newest First",
        "oldest": "Oldest First"
      },
      "reviews": {
        "title": "REVIEWS",
        "rating": "Rating",
        "placeholder": "Share your thoughts...",
        "send": "Send",
        "anonymous": "Anonymous"
      },
      "profile": {
        "history": "Watch History",
        "watch_later": "Watch Later",
        "favorites": "Favorites",
        "my_reviews": "My Reviews",
        "profile": "Profile",
        "login_required": "Please login",
        "go_home": "Go Home",
        "empty": "List is empty",
        "movie_link": "To Movie / Anime",
        "change_photo": "Change photo",
        "delete_review": "Delete review",
        "movie": "MOVIE",
        "anime": "ANIME",
        "logout_btn": "Logout",
        "user_placeholder": "User",
        "clear_history": "Clear History",
        "confirm_clear_history": "Delete all viewing history?",
        "invalid_file_type": "Only image files are allowed (PNG, JPG, WEBP)",
        "file_too_large": "File size exceeds 2MB limit"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: "kk",
    fallbackLng: "kk",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
