# Запуск проекта через Docker
Данный проект запускается полностью в контейнерах с помощью **Docker Compose** и включает три сервиса:
* PostgreSQL
* Backend (NestJS)
* Frontend (Vue)

## Быстрый запуск
В корне проекта выполните:

```bash
docker compose up --build
```

После успешного запуска будут доступны:

* Frontend: [http://localhost:5173](http://localhost:5173)
* Backend API: [http://localhost:3000/api](http://localhost:3000/api)
* PostgreSQL: localhost:5432
---

## Инициализация базы данных

Все SQL-скрипты из директории: backend/infra/postgres/ - автоматически выполняются при первом запуске контейнера PostgreSQL.

Переменная окружения SEED_TARGET_ITEMS - колличество генерируемых записей для заполнения бд.
backend/.env/

Текущее колличество заполнения SEED_TARGET_ITEMS = 100 000
