import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

const dbName = process.env.NEXT_PUBLIC_NODE_ENV === "development" ? "food-tracker" : "food-tracker-prod";

export async function GET() {
    try {
        // trigger deployment
        const client = await clientPromise;
        const db = client.db(dbName);
        const collection = db.collection("history");
        const entities = await collection.find({}).toArray();
        return NextResponse.json({ message: "Fetch successful!", data: entities });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};