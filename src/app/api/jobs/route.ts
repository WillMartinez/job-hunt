import { searchAllBoards, searchMuse, searchRemotive } from "@/lib/api/job-boards";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("query") || undefined;
  const location = searchParams.get("location") || undefined;
  const source = searchParams.get("source") || "all";
  const page = parseInt(searchParams.get("page") || "1", 10);

  try {
    const params = { query, location, page };

    const result =
      source === "remotive"
        ? await searchRemotive(params)
        : source === "muse"
          ? await searchMuse(params)
          : await searchAllBoards(params);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Job search error:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs", details: String(error) },
      { status: 500 }
    );
  }
}
