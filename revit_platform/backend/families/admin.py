from django.contrib import admin
from .models import Family, FamilyCategory

@admin.register(FamilyCategory)
class FamilyCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'parent')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)

@admin.register(Family)
class FamilyAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'revit_version', 'downloads', 'created_at')
    list_filter = ('category', 'revit_version', 'created_at')
    search_fields = ('title', 'description')
    readonly_fields = ('downloads', 'created_at', 'updated_at')
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('title', 'description', 'category', 'preview_image')
        }),
        ('Файл', {
            'fields': ('file_url', 'file_size', 'revit_version')
        }),
        ('Дополнительно', {
            'fields': ('source_url', 'downloads', 'author', 'created_at', 'updated_at')
        }),
    ) 