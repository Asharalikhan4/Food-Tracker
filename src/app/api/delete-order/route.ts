import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';

const dbName = process.env.NEXT_PUBLIC_NODE_ENV === "development" ? "food-tracker" : "food-tracker-prod";

export const DELETE = async (request: Request) => {
    try {
        const body = await request.json();
        if (!body?.id) {
            return NextResponse.json({ error: "Please provide the ID" }, { status: 400 });
        }
        const client = await clientPromise;
        const db = client?.db(dbName);
        const collection = db?.collection("history");

        const result = await collection.deleteOne({ _id: body?.id });

        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "No data found with the provided ID" }, { status: 404 });
        }

        return NextResponse.json({ message: "Data deleted successfully!" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};