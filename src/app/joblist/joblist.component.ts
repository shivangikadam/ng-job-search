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
        this.jobs = data;
        this.filteredJobs = [...this.jobs];
      },
      error: (err: any) => {
        console.error('Failed to fetch jobs:', err);
      },
    });
  }

  showAllJobs() {
    this.showFavorites = false;
    this.filteredJobs = [...this.jobs];
  }

  showFavoriteJobs() {
    this.showFavorites = true;
    this.filteredJobs = this.jobs.filter((job) => job.favorite);
  }

  toggleFavorite(job: Job) {
    job.favorite = !job.favorite;
    if (this.showFavorites) {
      this.filteredJobs = this.jobs.filter((j) => j.favorite);
    }
  }

  goToJobDetails(id: number): void {
    this.router.navigate(['/jobsDetails', id]);
  }
}
