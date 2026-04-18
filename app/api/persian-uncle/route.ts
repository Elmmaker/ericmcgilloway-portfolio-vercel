import { kv } from "@vercel/kv";
import { NextRequest } from "next/server";

const KV_KEY = "persian-uncle-reviews";

type RowKey = "row1" | "row2" | "row3";
type RowData = { rating: number; notes: string };
type Reviews = Record<RowKey, RowData>;

const EMPTY_REVIEWS: Reviews = {
  row1: { rating: 0, notes: "" },
  row2: { rating: 0, notes: "" },
  row3: { rating: 0, notes: "" },
};

const VALID_ROWS: RowKey[] = ["row1", "row2", "row3"];

export async function GET() {
  try {
    const data = await kv.get<Reviews>(KV_KEY);
    return Response.json(data ?? EMPTY_REVIEWS);
  } catch (err) {
    console.error("KV GET error:", err);
    return Response.json(EMPTY_REVIEWS, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { row, rating, notes } = body as {
      row?: string;
      rating?: number;
      notes?: string;
    };

    // Validate row
    if (!row || !VALID_ROWS.includes(row as RowKey)) {
      return Response.json({ error: "Invalid row" }, { status: 400 });
    }

    // Validate rating (0-5 integer) and notes (string under 5000 chars)
    const cleanRating =
      typeof rating === "number" && rating >= 0 && rating <= 5
        ? Math.floor(rating)
        : 0;
    const cleanNotes =
      typeof notes === "string" ? notes.slice(0, 5000) : "";

    // Read current state, update one row, write back
    const current = (await kv.get<Reviews>(KV_KEY)) ?? EMPTY_REVIEWS;
    const updated: Reviews = {
      ...current,
      [row as RowKey]: { rating: cleanRating, notes: cleanNotes },
    };
    await kv.set(KV_KEY, updated);

    return Response.json(updated);
  } catch (err) {
    console.error("KV POST error:", err);
    return Response.json({ error: "Failed to save" }, { status: 500 });
  }
}
