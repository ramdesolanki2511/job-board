import axios from 'axios';
import * as cheerio from 'cheerio';
import Job from '../models/job.model.js';

export async function fetchAndSaveRemoteOKJobs() {
    try {
        const { data } = await axios.get('https://remoteok.com/remote-dev-jobs', {
           headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Accept-Language': 'en-US,en;q=0.9',
            },
            maxRedirects: 1, 
        });
        const $ = cheerio.load(data)
        const jobs = [];

        $('tr.job').each((i, elem) => {
            const job = {
                title: $(elem).find('.company_and_position h2').text().trim(),
                company: $(elem).find('.company_and_position h3').text().trim(),
                location: $(elem).find('.location').text().trim() || 'Remote',
                tags: $(elem).find('.tags span').map((i, el) => $(el).text()).get(),
                url: 'https://remoteok.com' + $(elem).attr('data-href'),
                applied: false,
            };
            if (job.title) jobs.push(job)
        })

        // Save new jobs if they don't already exist
        for(let job of jobs) {
            const exists = await Job.findOne({ url: job.url });
            if(!exists) {
                await Job.create(job)
            }
        }
        return jobs.length;

    } catch (error) {
        console.error("Scrapper error:", error.message)
    }
}