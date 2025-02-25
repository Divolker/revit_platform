# Revit Platform

Платформа для работы с Revit-семействами и проектами.

## Функциональность

- Управление категориями
- Работа с проектами
- Управление Revit-семействами
- Блог
- Система аутентификации

## Технологии

- Python 3.11
- Django
- Django REST Framework
- JWT для аутентификации

## Установка и запуск

1. Клонируйте репозиторий:
```bash
git clone https://github.com/your-username/revit_platform.git
cd revit_platform
```

2. Создайте виртуальное окружение и активируйте его:
```bash
python -m venv venv
source venv/bin/activate  # для Linux/Mac
venv\Scripts\activate     # для Windows
```

3. Установите зависимости:
```bash
pip install -r requirements.txt
```

4. Примените миграции:
```bash
python manage.py migrate
```

5. Запустите сервер разработки:
```bash
python manage.py runserver
```

## Структура проекта

- `backend/` - основной код Django-приложения
  - `config/` - настройки проекта
  - `categories/` - приложение для работы с категориями
  - `projects/` - приложение для работы с проектами
  - `revit_families/` - приложение для работы с семействами
  - `blog/` - блог
  - `accounts/` - пользовательские аккаунты

## API Endpoints

- `/api/auth/` - аутентификация
- `/categories/` - работа с категориями
- `/projects/` - работа с проектами
- `/revit-families/` - работа с семействами
- `/blog/` - блог
- `/accounts/` - управление аккаунтами 