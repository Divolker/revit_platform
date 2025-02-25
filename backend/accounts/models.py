from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    ROLES = (
        ('CLIENT', 'Заказчик'),
        ('CONTRACTOR', 'Исполнитель'),
        ('ADMIN', 'Администратор'),
    )
    
    role = models.CharField(
        _('Роль'),
        max_length=20, 
        choices=ROLES, 
        default='CLIENT'
    )
    company = models.CharField(
        _('Компания'),
        max_length=100, 
        blank=True
    )
    phone = models.CharField(
        _('Телефон'),
        max_length=15, 
        blank=True
    )
    avatar = models.ImageField(
        _('Аватар'),
        upload_to='avatars/', 
        null=True, 
        blank=True
    )
    bio = models.TextField(
        _('О себе'),
        blank=True
    )
    website = models.URLField(
        _('Веб-сайт'),
        max_length=200, 
        blank=True
    )
    created_at = models.DateTimeField(
        _('Дата регистрации'),
        auto_now_add=True
    )
    updated_at = models.DateTimeField(
        _('Последнее обновление'),
        auto_now=True
    )

    class Meta:
        verbose_name = _('Пользователь')
        verbose_name_plural = _('Пользователи')
        ordering = ['-date_joined']

    def __str__(self):
        return f"{self.get_full_name()} ({self.get_role_display()})"

# Create your models here.
