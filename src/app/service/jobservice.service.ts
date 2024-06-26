import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DetailedJob, Job } from '../models/job.model';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private baseUrl = '/jobs';

  constructor(private http: HttpClient) {}

  getJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(this.baseUrl);
  }

  getJobById(id: number): Observable<DetailedJob> {
    return this.http.get<DetailedJob>(`${this.baseUrl}/${id}`);
  }

  updateJob(job: Job): Observable<Job> {
    return this.http.put<Job>(`${this.baseUrl}/${job.id}`, job);
  }
}
