from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    name=models.CharField(max_length=100)
    user=models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='categories'
    )

    def __str__(self):
        return self.name
    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"
    
class Tag(models.Model):
    name=models.CharField(max_length=50)
    user=models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='tags'
    )
    def __str__(self):
        return self.name

class Task(models.Model):
    STATUS_CHOICES=[
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]

    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]

    title=models.CharField(max_length=200)
    description=models.TextField(blank=True)
    status=models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )

    priority=models.CharField(
        max_length=10,
        choices=PRIORITY_CHOICES,
        default='medium'
    )

    due_date=models.DateField(null=True, blank=True)
    created_at=models.DateTimeField(auto_now_add=True)

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='tasks'
    )

    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='tasks'
    )

    tags = models.ManyToManyField(
        Tag,
        blank=True,
        related_name='tasks'
    )

    def __str__(self):
        return self.title
    
class TaskComment(models.Model):
    task=models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        related_name='comments'
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='task_comments'
    )
    text=models.TextField()
    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Comment by {self.user.username} on {self.task.title}'

