import {NextRequest, NextResponse} from "next/server";
import prisma, {Prisma} from "@/lib/prisma";

export interface HealthDataPatchRequest {
    data?: Prisma.InputJsonValue
}

export async function PATCH(
    req: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {
    const {id} = await params
    const body: HealthDataPatchRequest = await req.json()

    const healthData = await prisma.healthData.update({
        where: {id},
        data: body
    })
    return NextResponse.json({healthData})
}

export async function DELETE(
    req: NextRequest,
    {params}: { params: Promise<{ id: string }> }
) {
    const {id} = await params
    await prisma.healthData.delete({where: {id}})
    return NextResponse.json({})
}
