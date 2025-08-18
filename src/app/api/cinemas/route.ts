// src/app/api/bookings/route.ts
import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({ message: "Bookings API working" });
}

export async function POST(req: Request) {
    const data = await req.json();
    return NextResponse.json({ message: "Booking created", data });
}
