import {NextResponse} from "next/server";
import {hash} from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const {username, password} = await request.json();
        if (!username || !password) {
            return NextResponse.json({message: "Username and password are required"}, {status: 400});
        }

        // Hash the password
        const hashedPassword = await hash(password, 10);

        // Save the user to the database
        await prisma.user.create({data: {username, password: hashedPassword}})

        return NextResponse.json({message: "success"}, {status: 201});
    } catch (e) {
        console.error(e);
        return NextResponse.json({message: "An error occurred"}, {status: 400});
    }
}
