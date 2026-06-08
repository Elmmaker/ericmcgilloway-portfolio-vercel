import { kv } from "@vercel/kv";
import { NextRequest } from "next/server";

const KV_KEY = "great-american-story-reviews";

type SlotKey =
  | "slot1" | "slot2" | "slot3" | "slot4"
  | "slot5" | "slot6" | "slot7" | "slot8"
  | "slot9" | "slot10"
  | "slot11" | "slot12" | "slot13" | "slot14" | "slot15"
  | "slot16" | "slot17"
  | "slot18" | "slot19" | "slot20" | "slot21" | "slot22";
type SlotData = { rating: number; notes: string };
type Reviews = Record<SlotKey, SlotData>;

const VALID_SLOTS: SlotKey[] = [
  "slot1", "slot2", "slot3", "slot4",
  "slot5", "slot6", "slot7", "slot8",
  "slot9", "slot10",
  "slot11", "slot12", "slot13", "slot14", "slot15",
  "slot16", "slot17",
  "slot18", "slot19", "slot20", "slot21", "slot22",
];

const EMPTY_REVIEWS: Reviews = VALID_SLOTS.reduce((acc, k) => {
  acc[k] = { rating: 0, notes: "" };
  return acc;
}, {} as Reviews);

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
    const { slot, rating, notes } = body as {
      slot?: string;
      rating?: number;
      notes?: string;
    };

    if (!slot || !VALID_SLOTS.includes(slot as SlotKey)) {
      return Response.json({ error: "Invalid slot" }, { status: 400 });
    }

    const cleanRating =
      typeof rating === "number" && rating >= 0 && rating <= 5
        ? Math.floor(rating)
        : 0;
    const cleanNotes =
      typeof notes === "string" ? notes.slice(0, 5000) : "";

    const current = (await kv.get<Reviews>(KV_KEY)) ?? EMPTY_REVIEWS;
    const updated: Reviews = {
      ...current,
      [slot as SlotKey]: { rating: cleanRating, notes: cleanNotes },
    };
    await kv.set(KV_KEY, updated);

    return Response.json(updated);
  } catch (err) {
    console.error("KV POST error:", err);
    return Response.json({ error: "Failed to save" }, { status: 500 });
  }
}
