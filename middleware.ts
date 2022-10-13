import type { NextRequest } from "next/server";
import { NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  if (req.method == "OPTIONS") {
    return NextResponse.rewrite("", {
      status: 204,
      headers: {
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
        "Access-Control-Allow-Headers": req.headers.get(
          "Access-Control-Request-Headers"
        ),
        Vary: "Access-Control-Request-Headers",
        "Content-Length": "0",
      },
    });
  }
}
