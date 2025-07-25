import express from 'express';
import Job from '../models/job.model.js';
import { fetchAndSaveRemoteOKJobs } from '../utils/remoteokScraper.js';
const router = express.Router();

const mockJobs = [
    {
    id: 1,
    title: 'Frontend Developer',
    company: 'Google',
    location: 'Remote',
    description: 'Work on modern UI using React and TypeScript.',
    applied: false,
  },
  {
    id: 2,
    title: 'React.js Engineer',
    company: 'Amazon',
    location: 'India',
    description: 'Build scalable UI for e-commerce platform.',
    applied: false,
  },
]

// GET /jobs - fetch all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 })
    res.json(jobs)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs'})
  }
})

// GET /jobs/applied - Fetch only applied jobs
router.get('/applied', async (req, res) => {
  try {
    const appliedJobs = await Job.find({ applied: true});
    res.json(appliedJobs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch applied Jobs"})
  }
})

// POST /jobs - create a new job (optional for now)
router.post('/', async (req, res) => {
  console.log('Received body:', req.body);
  const { title, company, location, description } = req.body;
  try {
    const newJob = new Job({ title, company, location, description })
    await newJob.save();
    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create job' });
  }
})

// POST /jobs/apply - mark a job as applied
router.post('/apply', async (req, res) => {
    const { jobId } = req.body;

    try {
      const job = await Job.findById(jobId);
      if(!job) return res.status(404).json({ error: "job not found" });

      job.applied = true;
      await job.save()

      res.json({ message: "Marked as applied", job });

    } catch (error) {
      res.status(500).json({ error: "Failed to apply to job" })
    }
})

router.get('/scrape/remoteok', async (req, res) => {
  const total = await fetchAndSaveRemoteOKJobs();
  res.json({ message: `✅ Scraped ${total} new jobs.` })
})

export default router;