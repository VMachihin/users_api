````md
# User Service API

REST API для управления пользователями.

Реализованы:

- регистрация пользователя
- авторизация пользователя
- получение пользователя по ID
- получение списка пользователей
- блокировка пользователя

## Стек

- Node.js
- Express
- TypeScript
- Prisma ORM
- SQLite
- JWT
- bcrypt
- Zod

## Установка и запуск

1. Клонировать репозиторий:

2. Установить зависимости:

```bash
npm install
```

3. Создать файл `.env` со следующими переменными:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="supersecretkey"
```

4. Сгенерировать Prisma Client:

```bash
npx prisma generate
```

5. Выполнить миграции:

```bash
npx prisma migrate dev --name init
```

6. Запустить проект:

```bash
npm run dev
```

Сервер будет доступен по адресу:

```text
http://localhost:3000
```

## Структура проекта

```txt
src/
  app.ts
  server.ts
  controllers/
  routes/
  middlewares/
  schemas/
  lib/
  types/
prisma/
  schema.prisma
  migrations/
```

## Модель пользователя

Пользователь содержит следующие поля:

- `fullName` — ФИО
- `birthDate` — дата рождения
- `email` — уникальный email
- `passwordHash` — хэш пароля
- `role` — `admin` или `user`
- `isActive` — активен пользователь или нет

## Авторизация

Авторизация реализована через JWT.

После успешного логина сервер возвращает токен:

```json
{
	"token": "..."
}
```

Для доступа к защищённым endpoint необходимо передавать токен в заголовке:

```text
Authorization: Bearer <token>
```

## Endpoint

### 1. Регистрация пользователя

```http
POST /auth/register
```

Тело запроса:

```json
{
	"fullName": "Ivan Ivanov",
	"birthDate": "2000-01-15T00:00:00.000Z",
	"email": "ivan@example.com",
	"password": "123456",
	"role": "user"
}
```

### 2. Авторизация пользователя

```http
POST /auth/login
```

Тело запроса:

```json
{
	"email": "ivan@example.com",
	"password": "123456"
}
```

### 3. Получение пользователя по ID

```http
GET /users/:id
```

Доступ:

- администратор
- сам пользователь

### 4. Получение списка пользователей

```http
GET /users
```

Доступ:

- только администратор

### 5. Блокировка пользователя

```http
PATCH /users/:id/block
```

Доступ:

- администратор
- сам пользователь

## Правила доступа

- `admin` может получать любого пользователя
- `admin` может получать список всех пользователей
- `admin` может блокировать любого пользователя
- `user` может получать только свои данные
- `user` может заблокировать только самого себя
- заблокированный пользователь не может авторизоваться

## Примеры запросов

### Регистрация

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Ivan Ivanov",
    "birthDate": "2000-01-15T00:00:00.000Z",
    "email": "ivan@example.com",
    "password": "123456",
    "role": "user"
  }'
```

### Логин

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ivan@example.com",
    "password": "123456"
  }'
```

### Получение списка пользователей

```bash
curl http://localhost:3000/users \
  -H "Authorization: Bearer <token>"
```

### Получение пользователя по ID

```bash
curl http://localhost:3000/users/1 \
  -H "Authorization: Bearer <token>"
```

### Блокировка пользователя

```bash
curl -X PATCH http://localhost:3000/users/1/block \
  -H "Authorization: Bearer <token>"
```

## Валидация

В проекте используется `Zod` для валидации входных данных.

Проверяется:

- корректность email
- обязательность полей
- минимальная длина пароля
- допустимые значения роли

## Дополнительно

- пароль в базе хранится только в виде хэша
- `email` уникален
- `passwordHash` не возвращается в API-ответах

```

```
````
