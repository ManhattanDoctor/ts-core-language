# @ts-core/language

Мощная TypeScript библиотека для интернационализации (i18n) и управления мультиязычностью в приложениях.

[![Version](https://img.shields.io/npm/v/@ts-core/language.svg)](https://www.npmjs.com/package/@ts-core/language)
[![License](https://img.shields.io/npm/l/@ts-core/language.svg)](https://github.com/ManhattanDoctor/ts-core-language/blob/main/LICENSE)

## Возможности

- 🌍 **Мультиязычность** - полная поддержка множества языков и локалей
- 🔄 **Гибкая загрузка** - файлы, URL, предзагрузка или кастомные загрузчики
- 📦 **Мульти-проекты** - изоляция переводов для разных частей приложения
- 🔗 **Ссылки между переводами** - переиспользование переводов через алиасы
- 💪 **TypeScript** - полная типизация и поддержка дженериков
- ⚡ **Кэширование** - автоматическая оптимизация производительности
- 📝 **MessageFormat** - поддержка плюрализации и параметризации через ICU стандарт
- 🎯 **События** - отслеживание ошибок и событий через RxJS Observable
- 🧹 **Управление памятью** - правильная очистка ресурсов через паттерн Destroyable
- 📚 **Модульная архитектура** - ESM и CommonJS поддержка

## Установка

```bash
npm install @ts-core/language
```

```bash
yarn add @ts-core/language
```

```bash
pnpm add @ts-core/language
```

## Быстрый старт

### Базовое использование

```typescript
import { LanguageProjects, LanguageFileLoader } from '@ts-core/language';

// Создаем загрузчик для файлов переводов
const loader = new LanguageFileLoader('./i18n');

// Создаем менеджер проектов
const languages = new LanguageProjects(loader);

// Загружаем переводы
await languages.load({
    path: './locales',
    projects: ['main'],
    locales: ['ru', 'en'],
    prefixes: ['common', 'errors']
});

// Используем переводы
console.log(languages.translate('common.hello')); // "Привет" или "Hello"
console.log(languages.translate('errors.notFound')); // "Не найдено" или "Not Found"
```

### С параметрами

```typescript
// Файл перевода (ru.json):
{
    "greeting": "Привет, {name}!",
    "items": "У вас {count, plural, =0 {нет товаров} one {# товар} few {# товара} other {# товаров}}"
}

// Использование:
languages.translate('greeting', { name: 'Иван' });
// "Привет, Иван!"

languages.translate('items', { count: 0 });
// "У вас нет товаров"

languages.translate('items', { count: 1 });
// "У вас 1 товар"

languages.translate('items', { count: 5 });
// "У вас 5 товаров"
```

### Ссылки между переводами

```typescript
// Файл перевода:
{
    "common": {
        "yes": "Да",
        "no": "Нет"
    },
    "confirm": {
        "accept": "⇛common.yes",  // Ссылка на другой перевод
        "decline": "⇛common.no"
    }
}

// Использование:
languages.translate('confirm.accept'); // "Да"
languages.translate('confirm.decline'); // "Нет"
```

## Архитектура

Библиотека построена на многоуровневой архитектуре:

```
┌─────────────────────────────────────┐
│      LanguageProjects               │  ← Управление множественными проектами
│  (фасад для приложения)             │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      LanguageProject                │  ← Управление локалями одного проекта
│  (проект с несколькими языками)     │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│    LanguageTranslator               │  ← Логика переводов и кэширования
│  (кэш, валидация, ссылки)           │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│     LanguageLocale                  │  ← Контейнер переводов для локали
│  (MessageFormat компиляция)         │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   ILanguageLoader (стратегии)       │  ← Загрузка данных переводов
│  • FileLoader                       │
│  • UrlLoader                        │
│  • PreloadLoader                    │
│  • ProxyLoader                      │
└─────────────────────────────────────┘
```

## API Документация

### LanguageProjects

Главный класс для управления переводами в приложении.

```typescript
class LanguageProjects {
    constructor(loader: ILanguageLoader);

    // Загрузка переводов
    async load(params: {
        path: string;
        projects: string[];
        locales: string[];
        prefixes?: string[];
    }): Promise<void>;

    // Перевод ключа
    translate<T>(key: string, params?: T, project?: string, locale?: string): string;

    // Компиляция без кэша
    compile<T>(key: string, params?: T, project?: string, locale?: string): string;

    // Проверка наличия перевода
    isHasTranslation(key: string, project?: string, locale?: string): boolean;

    // Получить все переводы (с обработанными ссылками)
    getRawTranslated<T>(project?: string, locale?: string): T;

    // Получить сырые переводы (без обработки ссылок)
    getRawTranslation<T>(project?: string, locale?: string): T;

    // Доступ к конкретному проекту
    getProject(name: string): LanguageProject;

    // Установить/получить текущий язык
    set locale(value: string);
    get locale(): string;

    // Очистка ресурсов
    destroy(): void;
}
```

**Пример:**

```typescript
const languages = new LanguageProjects(loader);

await languages.load({
    path: './locales',
    projects: ['app', 'admin'],
    locales: ['ru', 'en'],
    prefixes: ['common', 'errors', 'validation']
});

// Переводы из проекта по умолчанию
languages.translate('common.save');

// Переводы из конкретного проекта
languages.translate('title', {}, 'admin');

// Переводы на конкретном языке
languages.translate('greeting', { name: 'User' }, 'app', 'en');

// Смена языка глобально
languages.locale = 'en';
```

### LanguageProject

Управляет переводами для одного проекта с множественными локалями.

```typescript
class LanguageProject {
    constructor(name: string, loadRawFunction: LanguageLoadTranslationRawFunction);

    // Загрузка локалей
    async load(path: string, locales: string[], prefixes: string[]): Promise<void>;

    // Методы перевода (делегируют в LanguageTranslator)
    translate<T>(key: string, params?: T, locale?: string): string;
    compile<T>(key: string, params?: T, locale?: string): string;
    isHasTranslation(key: string, isOnlyIfNotEmpty?: boolean, locale?: string): boolean;

    // Доступ к переводам
    getRawTranslated<T>(locale?: string): T;
    getRawTranslation<T>(locale?: string): T;

    // Свойства
    get name(): string;

    destroy(): void;
}
```

### LanguageTranslator

Выполняет переводы с кэшированием и обработкой ссылок.

```typescript
class LanguageTranslator implements ILanguageTranslator {
    static DEFAULT_LINK_SYMBOL = '⇛';

    constructor(linkSymbol?: string, locale?: LanguageLocale);

    // Перевод с кэшированием
    translate<T>(key: string, params?: T): string;

    // Компиляция без кэша
    compile<T>(key: string, params?: T): string;

    // Проверка наличия перевода
    isHasTranslation(key: string, isOnlyIfNotEmpty?: boolean): boolean;

    // Обработка ссылок
    isLink(key: string): boolean;
    getLinkKey(item: string): string | null;

    // Доступ к переводам
    getRawTranslated<T>(): T;
    getRawTranslation<T>(): T;

    // События (RxJS Observable)
    get events(): Observable<ObservableData<LanguageTranslatorEvent, ExtendedError>>;

    // Локаль
    set locale(value: LanguageLocale);
    get locale(): LanguageLocale;

    destroy(): void;
}
```

**События:**

```typescript
enum LanguageTranslatorEvent {
    KEY_INVALID = 'KEY_INVALID',          // Ключ не является строкой
    KEY_UNDEFINED = 'KEY_UNDEFINED',      // Ключ не определен
    KEY_NOT_FOUND = 'KEY_NOT_FOUND',      // Перевод не найден
    LOCALE_UNDEFINED = 'LOCALE_UNDEFINED' // Локаль не установлена
}
```

**Пример подписки на события:**

```typescript
const translator = new LanguageTranslator();
translator.locale = locale;

translator.events.subscribe(event => {
    console.error(`Translation error: ${event.type}`, event.data);
});

translator.translate('nonexistent.key');
// Выведет событие KEY_NOT_FOUND
```

### LanguageLocale

Контейнер переводов для конкретной локали с компиляцией MessageFormat.

```typescript
class LanguageLocale {
    constructor(locale: string, rawTranslation: any);

    // Компиляция и перевод
    compile<T>(key: string, params?: T): string;
    translate<T>(key: string, params?: T): string;

    // Проверка наличия
    isHasTranslation(key: string, isOnlyIfNotEmpty?: boolean): boolean;

    // История (кэш)
    addToHistory(key: string, value: string): void;
    getFromHistory(key: string): string | null;
    clearHistory(): void;

    // Доступ к данным
    get rawTranslation(): any;
    get locale(): string;
}
```

### Загрузчики (Loaders)

#### LanguageFileLoader

Загружает переводы из файлов с использованием Axios.

```typescript
class LanguageFileLoader extends LanguageLoader {
    constructor(axios: AxiosInstance);

    protected async loadLocale(
        path: string,
        project: string,
        locale: string,
        prefixes: string[]
    ): Promise<any>;
}
```

**Пример:**

```typescript
import axios from 'axios';
import { LanguageFileLoader } from '@ts-core/language';

const loader = new LanguageFileLoader(axios);

// Загрузит файлы:
// - ./locales/main/ru/common.json
// - ./locales/main/ru/errors.json
await languages.load({
    path: './locales',
    projects: ['main'],
    locales: ['ru'],
    prefixes: ['common', 'errors']
});
```

#### LanguageUrlLoader

Загружает переводы по HTTP/HTTPS.

```typescript
class LanguageUrlLoader extends LanguageFileLoader {
    // Наследует всю функциональность от LanguageFileLoader
    // Автоматически работает с URL
}
```

**Пример:**

```typescript
const loader = new LanguageUrlLoader(axios);

await languages.load({
    path: 'https://api.example.com/i18n',
    projects: ['app'],
    locales: ['ru', 'en'],
    prefixes: ['main']
});

// Загрузит:
// - https://api.example.com/i18n/app/ru/main.json
// - https://api.example.com/i18n/app/en/main.json
```

#### LanguagePreloadLoader

Использует предзагруженные данные (без HTTP запросов).

```typescript
class LanguagePreloadLoader extends LanguageLoader {
    constructor(data: Map<string, any>);

    protected loadLocale(
        path: string,
        project: string,
        locale: string,
        prefixes: string[]
    ): Promise<any>;
}
```

**Пример:**

```typescript
const preloadedData = new Map([
    ['app_ru_common', { hello: 'Привет' }],
    ['app_en_common', { hello: 'Hello' }]
]);

const loader = new LanguagePreloadLoader(preloadedData);

await languages.load({
    path: '',
    projects: ['app'],
    locales: ['ru', 'en'],
    prefixes: ['common']
});
```

#### LanguageProxyLoader

Обертка для кастомной функции загрузки.

```typescript
class LanguageProxyLoader extends LanguageLoader {
    constructor(loadFunction: (
        path: string,
        project: string,
        locale: string,
        prefixes: string[]
    ) => Promise<any>);
}
```

**Пример:**

```typescript
const customLoader = async (path, project, locale, prefixes) => {
    // Ваша кастомная логика
    const data = await fetch(`/api/translations/${project}/${locale}`);
    return data.json();
};

const loader = new LanguageProxyLoader(customLoader);
```

#### Кастомный загрузчик

Создайте свой загрузчик, наследуясь от `LanguageLoader`:

```typescript
import { LanguageLoader } from '@ts-core/language';

class DatabaseLoader extends LanguageLoader {
    constructor(private db: Database) {
        super();
    }

    protected async loadLocale(
        path: string,
        project: string,
        locale: string,
        prefixes: string[]
    ): Promise<any> {
        const translations = {};

        for (const prefix of prefixes) {
            const data = await this.db.query(
                'SELECT * FROM translations WHERE project = ? AND locale = ? AND prefix = ?',
                [project, locale, prefix]
            );
            translations[prefix] = data;
        }

        return translations;
    }
}
```

### LanguageUtil

Утилиты для работы с переводами.

```typescript
class LanguageUtil {
    // Добавить элементы к объекту переводов
    static addItems(target: any, source: any, prefix?: string): void;
}
```

**Пример:**

```typescript
import { LanguageUtil } from '@ts-core/language';

const target = { common: { hello: 'Hi' } };
const source = { goodbye: 'Bye' };

LanguageUtil.addItems(target, source, 'common');
// Результат: { common: { hello: 'Hi', goodbye: 'Bye' } }
```

## Примеры использования

### React приложение

```typescript
import React, { createContext, useContext, useEffect, useState } from 'react';
import { LanguageProjects, LanguageFileLoader } from '@ts-core/language';
import axios from 'axios';

// Создаем контекст
const LanguageContext = createContext<LanguageProjects | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [languages, setLanguages] = useState<LanguageProjects | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            const loader = new LanguageFileLoader(axios);
            const lang = new LanguageProjects(loader);

            await lang.load({
                path: '/locales',
                projects: ['app'],
                locales: ['ru', 'en'],
                prefixes: ['common', 'pages']
            });

            lang.locale = localStorage.getItem('locale') || 'ru';

            setLanguages(lang);
            setLoading(false);
        };

        init();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <LanguageContext.Provider value={languages}>
            {children}
        </LanguageContext.Provider>
    );
};

// Хук для использования переводов
export const useTranslation = () => {
    const languages = useContext(LanguageContext);

    const t = (key: string, params?: any) => {
        return languages?.translate(key, params) || key;
    };

    const changeLanguage = (locale: string) => {
        if (languages) {
            languages.locale = locale;
            localStorage.setItem('locale', locale);
            // Форсируем ре-рендер
            window.location.reload();
        }
    };

    return { t, changeLanguage, locale: languages?.locale };
};

// Использование в компонентах
const MyComponent = () => {
    const { t, changeLanguage, locale } = useTranslation();

    return (
        <div>
            <h1>{t('pages.home.title')}</h1>
            <p>{t('common.welcome', { name: 'User' })}</p>

            <button onClick={() => changeLanguage(locale === 'ru' ? 'en' : 'ru')}>
                {locale === 'ru' ? 'EN' : 'RU'}
            </button>
        </div>
    );
};
```

### Node.js / Express приложение

```typescript
import express from 'express';
import { LanguageProjects, LanguageFileLoader } from '@ts-core/language';
import axios from 'axios';

const app = express();
const loader = new LanguageFileLoader(axios);
const languages = new LanguageProjects(loader);

// Инициализация при старте
async function initLanguages() {
    await languages.load({
        path: './server/locales',
        projects: ['api', 'emails'],
        locales: ['ru', 'en', 'de'],
        prefixes: ['errors', 'messages']
    });
}

// Middleware для определения языка
app.use((req, res, next) => {
    const locale = req.headers['accept-language']?.split(',')[0] || 'en';
    req.locale = locale;
    next();
});

// Использование в роутах
app.get('/api/user/:id', async (req, res) => {
    const user = await getUserById(req.params.id);

    if (!user) {
        return res.status(404).json({
            error: languages.translate('errors.userNotFound', {}, 'api', req.locale)
        });
    }

    res.json(user);
});

// Отправка email с переводами
async function sendWelcomeEmail(user: User) {
    const subject = languages.translate('emails.welcome.subject', { name: user.name }, 'emails', user.locale);
    const body = languages.translate('emails.welcome.body', { name: user.name }, 'emails', user.locale);

    await sendEmail(user.email, subject, body);
}

initLanguages().then(() => {
    app.listen(3000, () => console.log('Server started'));
});
```

### Обработка ошибок

```typescript
import { LanguageTranslator, LanguageTranslatorEvent } from '@ts-core/language';

const translator = new LanguageTranslator();

// Подписка на события
translator.events.subscribe(event => {
    switch (event.type) {
        case LanguageTranslatorEvent.KEY_NOT_FOUND:
            console.warn(`Translation missing: ${event.data.details.key}`);
            // Отправить в систему мониторинга
            analytics.track('translation_missing', event.data.details);
            break;

        case LanguageTranslatorEvent.KEY_INVALID:
            console.error(`Invalid translation key:`, event.data);
            break;

        case LanguageTranslatorEvent.LOCALE_UNDEFINED:
            console.error(`Locale not set`);
            break;
    }
});
```

### Динамическая загрузка языков

```typescript
const languages = new LanguageProjects(loader);

// Загрузить начальный язык
await languages.load({
    path: '/locales',
    projects: ['app'],
    locales: ['ru'],
    prefixes: ['common']
});

// Функция для добавления нового языка
async function addLanguage(locale: string) {
    await languages.load({
        path: '/locales',
        projects: ['app'],
        locales: [locale],
        prefixes: ['common']
    });

    languages.locale = locale;
}

// Использование
document.getElementById('langBtn').addEventListener('click', async () => {
    await addLanguage('de');
    renderApp(); // Перерисовать приложение
});
```

### Множественные проекты

```typescript
// Структура файлов:
// /locales
//   /website
//     /ru
//       common.json
//       pages.json
//     /en
//       common.json
//       pages.json
//   /admin
//     /ru
//       dashboard.json
//       users.json
//     /en
//       dashboard.json
//       users.json

const languages = new LanguageProjects(loader);

await languages.load({
    path: '/locales',
    projects: ['website', 'admin'],
    locales: ['ru', 'en'],
    prefixes: ['common', 'pages', 'dashboard', 'users']
});

// Переводы для сайта
languages.translate('pages.home.title', {}, 'website');

// Переводы для админ-панели
languages.translate('dashboard.stats', {}, 'admin');

// Общие переводы
languages.translate('common.save', {}, 'website');
languages.translate('common.save', {}, 'admin');
```

## Структура файлов переводов

### Рекомендуемая структура

```
/locales
  /{project}
    /{locale}
      {prefix}.json
```

**Пример:**

```
/locales
  /app
    /ru
      common.json
      errors.json
      validation.json
    /en
      common.json
      errors.json
      validation.json
  /admin
    /ru
      dashboard.json
    /en
      dashboard.json
```

### Формат файлов переводов

```json
{
  "common": {
    "yes": "Да",
    "no": "Нет",
    "save": "Сохранить",
    "cancel": "Отмена"
  },
  "greeting": "Привет, {name}!",
  "items": {
    "count": "У вас {count, plural, =0 {нет товаров} one {# товар} few {# товара} other {# товаров}}"
  },
  "links": {
    "accept": "⇛common.yes",
    "reject": "⇛common.no"
  }
}
```

### MessageFormat синтаксис

Библиотека использует [@messageformat/core](https://messageformat.github.io/messageformat/) для форматирования сообщений.

**Параметры:**

```json
{
  "hello": "Hello, {name}!"
}
```

```typescript
translate('hello', { name: 'John' }); // "Hello, John!"
```

**Плюрализация:**

```json
{
  "items": "{count, plural, =0 {no items} one {# item} other {# items}}"
}
```

```typescript
translate('items', { count: 0 }); // "no items"
translate('items', { count: 1 }); // "1 item"
translate('items', { count: 5 }); // "5 items"
```

**Выбор (select):**

```json
{
  "gender": "{gender, select, male {Он} female {Она} other {Они}}"
}
```

```typescript
translate('gender', { gender: 'male' }); // "Он"
translate('gender', { gender: 'female' }); // "Она"
```

**Комбинации:**

```json
{
  "liked": "{name} {count, plural, =0 {не лайкнул} one {лайкнул # пост} other {лайкнул # постов}}"
}
```

## Производительность

### Кэширование

Библиотека автоматически кэширует скомпилированные переводы:

```typescript
// Первый вызов - компиляция MessageFormat
translator.translate('hello', { name: 'John' }); // ~1-2ms

// Последующие вызовы - из кэша
translator.translate('hello', { name: 'John' }); // ~0.01ms
```

### Очистка кэша

```typescript
locale.clearHistory(); // Очистить кэш конкретной локали
```

### Оптимизации

1. **Предзагрузка** - используйте `LanguagePreloadLoader` для статических данных
2. **Ленивая загрузка** - загружайте только нужные проекты и локали
3. **Минификация** - минифицируйте JSON файлы переводов

## Разработка

### Требования

- Node.js >= 14
- TypeScript >= 3.x

### Установка зависимостей

```bash
npm install
```

### Сборка

```bash
npm run build
```

Создает:
- `cjs/` - CommonJS модули
- `esm/` - ES модули
- `*.d.ts` - TypeScript декларации

### Публикация

```bash
# Patch версия (3.0.38 → 3.0.39)
make publish-patch

# Minor версия (3.0.38 → 3.1.0)
make publish-minor

# Major версия (3.0.38 → 4.0.0)
make publish-major
```

## Зависимости

### Runtime

- `@ts-core/common` - Базовые утилиты и интерфейсы
- `@messageformat/core` - ICU MessageFormat компилятор
- `axios` - HTTP клиент (опционально, только для File/Url загрузчиков)
- `lodash` - Утилиты для работы с объектами
- `rxjs` - Реактивное программирование для событий

### Development

- `typescript` - TypeScript компилятор
- `gulp-npm-module-publisher` - Сборка и публикация

## Лицензия

ISC

## Автор

Renat Gubaev (renat.gubaev@gmail.com)

## Ссылки

- [GitHub](https://github.com/ManhattanDoctor/ts-core-language)
- [npm](https://www.npmjs.com/package/@ts-core/language)
- [Issues](https://github.com/ManhattanDoctor/ts-core-language/issues)

## Связанные проекты

- [@ts-core/common](https://github.com/ManhattanDoctor/ts-core-common) - Базовые утилиты

---

**Сделано с ❤️ для TypeScript сообщества**
