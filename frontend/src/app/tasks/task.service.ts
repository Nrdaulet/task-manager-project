import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  created_at: string;
  category: number | null;
  tags: number[];
}

export interface TasksResponse {
  full_tasks: Task[];
}

export interface Comment {
  id: number;
  task: number;
  user: number;
  text: string;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<TasksResponse> {
    return this.http.get<TasksResponse>(`${this.apiUrl}/tasks/`);
  }

  getTask(id: number): Observable<{ task: Task }> {
    return this.http.get<{ task: Task }>(`${this.apiUrl}/tasks/${id}/`);
  }

  createTask(task: Partial<Task>): Observable<{ task: Task }> {
    return this.http.post<{ task: Task }>(`${this.apiUrl}/tasks/`, task);
  }

  updateTask(id: number, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/tasks/${id}/`, task);
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tasks/${id}/`);
  }

  getComments(taskId: number): Observable<{ comments: Comment[] }> {
    return this.http.get<{ comments: Comment[] }>(`${this.apiUrl}/tasks/${taskId}/comments/`);
  }

  addComment(taskId: number, text: string): Observable<{ comment: Comment }> {
    return this.http.post<{ comment: Comment }>(`${this.apiUrl}/tasks/${taskId}/comments/`, { text });
  }

  deleteComment(taskId: number, commentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tasks/${taskId}/comments/${commentId}/`);
  }
}
