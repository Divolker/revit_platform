import json
import django
import os
import sys

# Настраиваем Django
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from families.models import Family, FamilyCategory
from django.contrib.auth import get_user_model

def import_data():
    User = get_user_model()
    admin_user = User.objects.filter(is_superuser=True).first()

    print("Начинаем импорт данных...")

    # Импорт категорий
    with open('parsed_data/categories.json', 'r', encoding='utf-8') as f:
        categories_data = json.load(f)

    categories_map = {}
    for cat_data in categories_data:
        category, created = FamilyCategory.objects.get_or_create(
            name=cat_data['name'],
            slug=cat_data['slug']
        )
        categories_map[cat_data['id']] = category
        print(f"{'Создана' if created else 'Обновлена'} категория: {category.name}")

    # Импорт семейств
    with open('parsed_data/families.json', 'r', encoding='utf-8') as f:
        families_data = json.load(f)

    for fam_data in families_data:
        family, created = Family.objects.get_or_create(
            title=fam_data['title'],
            defaults={
                'description': fam_data['description'],
                'category': categories_map[fam_data['category_id']],
                'file_url': fam_data['file_url'],
                'source_url': fam_data['preview_url'],
                'revit_version': fam_data['revit_version'],
                'file_size': fam_data['file_size'],
                'author': admin_user
            }
        )
        print(f"{'Создано' if created else 'Обновлено'} семейство: {family.title}")

    print("\nИмпорт завершен!")
    print(f"Всего категорий: {FamilyCategory.objects.count()}")
    print(f"Всего семейств: {Family.objects.count()}")

if __name__ == '__main__':
    import_data() 