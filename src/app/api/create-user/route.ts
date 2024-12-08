import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

const dbName = process.env.NEXT_PUBLIC_NODE_ENV === "development" ? "food-tracker" : "food-tracker-prod";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        if(!body?.name){
            return NextResponse.json({ error: "Please fill all the fields" }, { status: 400 });
        };

        const normalizedName = body.name.trim().toLowerCase();
        
        const client = await clientPromise;
        const db = client.db(dbName);
        const collection = db.collection("users");

        const existingUser = await collection.findOne({ name: normalizedName });
        if (existingUser) {
            return NextResponse.json({ error: "User with the same name already exists" }, { status: 409 });
        };

        await collection.insertOne({
            name: body.name,
            createdAt: new Date(),
        });
        return NextResponse.json({ message: "Data received successfully!" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};