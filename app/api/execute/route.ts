import executeCode from '@/lib/Execute';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { code, language } = await req.json();
    const executionResult = await executeCode(code, language);

    return NextResponse.json({ output: executionResult });
  } catch (error: any) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
