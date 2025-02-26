# Password Manager

A secure password manager application built with Next.js, Material-UI, and MongoDB.

## Features

- User registration and authentication
- Securely store and manage passwords
- Password visibility toggle
- Password generator tool
- Responsive Material-UI interface
- Ukrainian language support

## Getting Started

1. Clone the repository
2. Install dependencies
3. Create MongoDB Atlas account and get connection string
4. Create `.env.local` file with the following variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secret key for JWT authentication
5. Start the development server

## Деплой на Render

### Підготовка

1. Створіть акаунт на [Render](https://render.com)
2. Підключіть ваш GitHub репозиторій
3. Створіть базу даних MongoDB:
   - Використовуйте MongoDB Atlas або
   - Створіть окремий сервіс MongoDB на Render

### Налаштування Web Service

1. На Render перейдіть в Dashboard
2. Натисніть "New +" > "Web Service"
3. Виберіть ваш репозиторій
4. Налаштуйте:
   - Name: password-manager (або інша назва)
   - Environment: Node
   - Build Command: `npm run render-build`
   - Start Command: `npm start`

### Змінні оточення

В налаштуваннях сервісу додайте:
- `MONGODB_URI`: URI для підключення до MongoDB
- `JWT_SECRET`: Секретний ключ для JWT токенів
- `NODE_ENV`: production

### Автоматичний деплой

1. Налаштуйте автоматичний деплой:
   - Branch: main
   - Auto-Deploy: Yes

2. Для ручного деплою:
   - Перейдіть в Manual Deploy
   - Натисніть "Deploy latest commit"

### Моніторинг

- Логи доступні в розділі Logs
- Метрики в розділі Metrics
- Статус в розділі Events

## Розробка

...

contributors:
- [@tkachandrei94](https://github.com/tkachandrei94)
- [@JuliaKORNIEIEVA](https://github.com/JuliaKORNIEIEVA)
- [@Emma-em0609](https://github.com/Emma-em0609)

## Налаштування MongoDB Atlas

1. Створіть обліковий запис на [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Створіть новий кластер
3. У налаштуваннях мережі (Network Access):
   - Додайте IP адресу Render (0.0.0.0/0 для тестування)
4. У налаштуваннях бази даних (Database Access):
   - Створіть нового користувача
   - Запам'ятайте username та password
5. Отримайте URI для підключення:
   - Натисніть "Connect" на кластері
   - Виберіть "Connect your application"
   - Скопіюйте URI
6. Додайте URI в змінні оточення на Render:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/password-manager?retryWrites=true&w=majority
   ```

## Development

```bash
npm install
npm run dev
```


