import { NextResponse } from 'next/server';

export async function GET() {
  const host = process.env.NEXT_PUBLIC_SITE_URL || 'https://remote-launch.example.com';
  const body = `User-agent: *\nAllow: /\nSitemap: ${host}/sitemap.xml\n`;

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
