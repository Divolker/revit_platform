from rest_framework import serializers
from .models import Project, ProjectFile

class ProjectFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectFile
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    files = ProjectFileSerializer(many=True, read_only=True)
    
    class Meta:
        model = Project
        fields = ['id', 'title', 'description', 'thumbnail', 'status', 'created_at', 'updated_at']
        read_only_fields = ['author']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if representation['thumbnail']:
            request = self.context.get('request')
            if request is not None:
                representation['thumbnail'] = request.build_absolute_uri(representation['thumbnail'])
        return representation
