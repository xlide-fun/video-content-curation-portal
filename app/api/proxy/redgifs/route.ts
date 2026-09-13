import { NextRequest, NextResponse } from 'next/server';
import { searchRedgifs, getRedgifsById, getRedgifsTrending } from '@/lib/fetchers/redgifs';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action') || 'search';
  const query = searchParams.get('q') || '';
  const page = Number(searchParams.get('page') || 1);
  const count = Number(searchParams.get('count') || 30);
  const id = searchParams.get('id');

  try {
    if (action === 'id' && id) {
      const video = await getRedgifsById(id);
      return NextResponse.json(video || { error: 'not found' }, { status: video ? 200 : 404 });
    }
    if (action === 'trending') {
      const result = await getRedgifsTrending(count, page);
      return NextResponse.json(result);
    }
    const result = await searchRedgifs(query, page, count);
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 502 });
  }
}
