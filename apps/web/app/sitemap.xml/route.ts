import { NextResponse } from 'next/server';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://remote-launch.example.com';

async function fetchJobSlugs() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/v1/jobs`);
    if (!res.ok) return [];
    const json = await res.json();
    // Assuming API returns { data: jobs[] }
    const jobs = json.data || [];
    return jobs.map((j: any) => ({ loc: `/jobs/${j.slug}`, lastmod: j.updatedAt || j.createdAt }));
  } catch (e) {
    return [];
  }
}

export async function GET() {
  const staticPaths = [
    { loc: '/', changefreq: 'daily', priority: 1.0 },
    { loc: '/jobs', changefreq: 'hourly', priority: 0.9 },
    { loc: '/companies', changefreq: 'weekly', priority: 0.7 },
    { loc: '/auth/login', changefreq: 'monthly', priority: 0.3 },
    { loc: '/auth/signup', changefreq: 'monthly', priority: 0.3 },
  ];

  const jobPaths = await fetchJobSlugs();

  const urls = staticPaths.concat(jobPaths.map((p: any) => ({ loc: p.loc, lastmod: p.lastmod })));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls
      .map((u: any) => {
        return `
      <url>
        <loc>${SITE_URL}${u.loc}</loc>
        ${u.lastmod ? `<lastmod>${new Date(u.lastmod).toISOString()}</lastmod>` : ''}
      </url>`;
      })
      .join('')}
  </urlset>`;

  return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=86400' } });
}
