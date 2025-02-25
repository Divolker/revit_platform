from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from django.conf import settings

User = get_user_model()

class Project(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Черновик'),
        ('in_progress', 'В разработке'),
        ('completed', 'Завершен'),
        ('archived', 'В архиве'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    thumbnail = models.ImageField(upload_to='project_thumbnails/', null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects')

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class ProjectFile(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='files')
    file = models.FileField(upload_to='project_files/')
    file_type = models.CharField(max_length=50)  # например, 'revit', 'pdf', etc.
    uploaded_at = models.DateTimeField(auto_now_add=True)
