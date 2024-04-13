import { NextRequest, NextResponse } from "next/server";

// Google: Nextjs 13 get query params 
export async function GET(request: NextRequest, response: NextResponse) {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const fileName = searchParams.get('audio')
    // console.log('url:', fileName)
    // console.log('check url:', `${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${fileName}`)
    return await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${fileName}`)
}