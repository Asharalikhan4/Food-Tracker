import { NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';

const dbName = process.env.NEXT_PUBLIC_NODE_ENV === "development" ? "food-tracker" : "food-tracker-prod";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        if (!body?.date || !body?.totalTiffins || !body?.selectedUsers) {
            return NextResponse.json({ error: "Please fill all the fields" }, { status: 400 });
        };
        // const receivedDate = new Date(body?.date);
        const today = new Date();

        // Normalize today's date to remove time part
        today.setHours(0, 0, 0, 0);

        // Check if the received date is greater than today
        // if (receivedDate > today) {
        //     console.log(receivedDate, today);
        //     return NextResponse.json({ error: "Please enter correct date" }, { status: 400 });
        // }
        const client = await clientPromise;
        const db = client.db(dbName);
        const collection = db.collection("history");

        const result = await collection.insertOne({
            date: body.date,
            totalTiffins: body.totalTiffins,
            selectedUsers: body.selectedUsers,
            createdAt: new Date(),
        });

        return NextResponse.json({ message: "Data received successfully!", id: result.insertedId });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};