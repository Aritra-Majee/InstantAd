import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get("firebase_token")?.value;

    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // If token exists, allow
    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/profile/:path*","/creative-ai-tools/:path*"],
};