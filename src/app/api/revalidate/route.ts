import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

/**
 * Drops the cached copy of the remote recipe source on demand, so a change
 * upstream can be pulled in without waiting for the hourly window.
 *
 * Disabled unless REVALIDATE_SECRET is set — an open cache-busting endpoint is
 * a free way to make a site slow.
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET
  if (!secret) {
    return NextResponse.json(
      { revalidated: false, reason: 'REVALIDATE_SECRET is not configured' },
      { status: 501 },
    )
  }

  if (request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json(
      { revalidated: false, reason: 'bad or missing token' },
      { status: 401 },
    )
  }

  // Next 16 wants an explicit lifetime alongside the tag: 'max' means the
  // cached copy is dropped rather than kept around for a grace window.
  revalidateTag('recipes', 'max')
  return NextResponse.json({ revalidated: true, tag: 'recipes' })
}
