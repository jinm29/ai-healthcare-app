import prisma, {Prisma} from "@/lib/prisma";
import {NextResponse} from "next/server";

export interface HealthData extends Prisma.HealthDataGetPayload<{
    select: {
        id: true,
        type: true,
        data: true,
        createdAt: true,
        updatedAt: true
    }
}> {
    id: string
}

export interface HealthDataListResponse {
    healthDataList: HealthData[]
}

export async function GET() {
    const healthDataList = await prisma.healthData.findMany({})
    return NextResponse.json<HealthDataListResponse>({
        healthDataList: healthDataList
    })

}
