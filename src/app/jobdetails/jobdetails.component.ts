import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobService } from '../service/jobservice.service';
import { DetailedJob } from '../models/job.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-jobdetails',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jobdetails.component.html',
  styleUrl: './jobdetails.component.css',
})
export class JobdetailsComponent {
  jobs: DetailedJob | undefined;
  jobDescriptionText: string = '';
  jobDescriptionHTML: string = '';
  descriptionSections: { title: string; content: string }[] = [];

  constructor(
    private route: ActivatedRoute,
    private jobService: JobService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const jobIdString = this.route.snapshot.paramMap.get('id');
    const jobId = jobIdString !== null ? parseInt(jobIdString, 10) : null;

    if (jobId !== null) {
      this.jobService.getJobById(jobId).subscribe({
        next: (data: DetailedJob) => {
          this.jobs = data;
          console.log(this.jobs);
          this.parseDescription(this.jobs.description);
          this.jobDescriptionHTML = this.jobs?.description ?? '';
        },
        error: (err: any) => {
          console.error('Failed to fetch job details:', err);
        },
      });
    }
  }

  parseDescription(html: string): void {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const sections: { title: string; content: string }[] = [];

    let currentTitle = 'Description';
    let currentContent = '';

    doc.body.childNodes.forEach((node) => {
      if (node.nodeName === 'H2') {
        if (currentContent.trim().length > 0) {
          sections.push({ title: currentTitle, content: currentContent });
        }
        currentTitle = (node as HTMLElement).innerText || '';
        currentContent = '';
      } else {
        if (node instanceof Element) {
          currentContent += node.outerHTML || '';
        }
      }
    });

    if (currentContent.trim().length > 0) {
      sections.push({ title: currentTitle, content: currentContent });
    }

    console.log(sections);
    this.descriptionSections = sections;
  }

  goBack(): void {
    this.router.navigate(['/jobs']);
  }
}
