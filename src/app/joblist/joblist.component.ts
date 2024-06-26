import { Component, OnInit } from '@angular/core';
import { JobService } from '../service/jobservice.service';
import { Job } from '../models/job.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './joblist.component.html',
  styleUrls: ['./joblist.component.css'],
})
export class JobListComponent implements OnInit {
  jobs: Job[] = [];
  showFavorites: boolean = false;
  filteredJobs: Job[] = [];

  constructor(private jobService: JobService, private router: Router) {}

  ngOnInit(): void {
    this.jobService.getJobs().subscribe({
      next: (data: Job[]) => {
        this.jobs = data.map((job) => ({
          ...job,
          favorite: this.getFavoriteStatus(job.id),
        }));
        this.filteredJobs = [...this.jobs];
      },
      error: (err: any) => {
        console.error('Failed to fetch jobs:', err);
      },
    });
  }

  toggleFavorite(job: Job): void {
    job.favorite = !job.favorite;
    this.setFavoriteStatus(job.id, job.favorite);
    if (this.showFavorites) {
      this.filteredJobs = this.jobs.filter((j) => j.favorite);
    }
  }

  showAllJobs(): void {
    this.showFavorites = false;
    this.filteredJobs = [...this.jobs];
  }

  showFavoriteJobs(): void {
    this.showFavorites = true;
    this.filteredJobs = this.jobs.filter((job) => job.favorite);
  }

  private getFavoriteStatus(jobId: number): boolean {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    return favorites.includes(jobId);
  }

  private setFavoriteStatus(jobId: number, status: boolean): void {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (status) {
      favorites.push(jobId);
    } else {
      favorites = favorites.filter((id: number) => id !== jobId);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }

  goToJobDetails(id: number): void {
    this.router.navigate(['/jobsDetails', id]);
  }
}
