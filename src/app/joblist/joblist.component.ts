import { Component, OnInit } from '@angular/core';
import { JobService } from '../service/jobservice.service';
import { Job } from '../models/job.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

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

  constructor(
    private jobService: JobService,
    private router: Router,
    private cookieService: CookieService
  ) {}

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
    const favorites = this.cookieService.get('favorites');
    if (favorites) {
      try {
        const favoriteArray = JSON.parse(favorites);
        return Array.isArray(favoriteArray)
          ? favoriteArray.includes(jobId)
          : false;
      } catch (e) {
        console.error('Error parsing favorites cookie:', e);
        return false;
      }
    }
    return false;
  }

  private setFavoriteStatus(jobId: number, status: boolean): void {
    const favorites = this.cookieService.get('favorites');
    let favoriteArray: number[] = [];
    if (favorites) {
      try {
        favoriteArray = JSON.parse(favorites);
        if (!Array.isArray(favoriteArray)) {
          favoriteArray = [];
        }
      } catch (e) {
        console.error('Error parsing favorites cookie:', e);
        favoriteArray = [];
      }
    }
    if (status) {
      if (!favoriteArray.includes(jobId)) {
        favoriteArray.push(jobId);
      }
    } else {
      favoriteArray = favoriteArray.filter((id: number) => id !== jobId);
    }
    this.cookieService.set('favorites', JSON.stringify(favoriteArray));
  }

  goToJobDetails(id: number): void {
    this.router.navigate(['/jobsDetails', id]);
  }
}
