import prisma, {Prisma} from "@/lib/prisma";
import {NextRequest, NextResponse} from "next/server";

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

export interface HealthDataCreateRequest {
    id?: string;
    type: string;
    data: Prisma.InputJsonValue;
}

export interface HealthDataListResponse {
    healthDataList: HealthData[]
}

export interface HealthDataCreateResponse extends HealthData {
    id: string;
}

export async function POST(
    req: NextRequest
) {
    const data: HealthDataCreateRequest = await req.json()
    const healthData = await prisma.healthData.create({
        data
    })
    return NextResponse.json<HealthDataCreateResponse>(healthData)
}

export async function GET() {
    const healthDataList = await prisma.healthData.findMany({
        orderBy: {createdAt: 'asc'}
    })
    return NextResponse.json<HealthDataListResponse>({
        healthDataList: healthDataList
    })

}
