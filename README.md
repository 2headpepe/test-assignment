# Withdraw Page — тестовое задание

## Запуск

```bash
npm install
npm run dev
npm test
```

## Auth

В моке токен захардкожен в `lib/api/client.ts`.

В продакшене: токен будет в **httpOnly cookie**.

## Тесты

3 unit-теста:
1. Happy path - после сабмита появляется экран успеха
2. 409 - показывается alert, форма сохраняет значения
3. Double submit - кнопка задизейблена, второй клик игнорируется