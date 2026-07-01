import { NextRequest, NextResponse } from 'next/server';
import prisma, { Prisma } from '@/lib/prisma';
import { HealthData } from '@/app/api/health-data/route';
import { assertResourceOwner, requireAuth } from '@/lib/api/auth-helpers';
import { handleApiError } from '@/lib/errors';
import { cacheService } from '@/lib/redis';

export interface HealthDataPatchRequest {
  data?: Prisma.InputJsonValue;
}

export interface HealthDataGetResponse {
  healthData: HealthData;
}

type HealthDataRecord = Prisma.HealthDataGetPayload<{
  select: {
    id: true;
    type: true;
    data: true;
    metadata: true;
    status: true;
    fileType: true;
    filePath: true;
    createdAt: true;
    updatedAt: true;
    authorId: true;
  };
}>;

async function fetchHealthDataRecord(id: string): Promise<HealthDataRecord> {
  return prisma.healthData.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      type: true,
      data: true,
      metadata: true,
      status: true,
      fileType: true,
      filePath: true,
      createdAt: true,
      updatedAt: true,
      authorId: true,
    },
  });
}

function toPublicHealthData(record: HealthDataRecord): HealthData {
  const { authorId: _authorId, ...healthData } = record;
  void _authorId;
  return healthData;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const record = await cacheService.getOrSet(
      `health-data:${id}`,
      () => fetchHealthDataRecord(id),
      { ttlSeconds: 300 },
    );

    assertResourceOwner(record.authorId, session.user.id);
    return NextResponse.json<HealthDataGetResponse>({ healthData: toPublicHealthData(record) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const body: HealthDataPatchRequest = await req.json();

    const existing = await prisma.healthData.findUniqueOrThrow({ where: { id } });
    assertResourceOwner(existing.authorId, session.user.id);

    const healthData = await prisma.healthData.update({
      where: { id },
      data: body,
    });

    await cacheService.delete(`health-data:${id}`);
    return NextResponse.json({ healthData });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const existing = await prisma.healthData.findUniqueOrThrow({ where: { id } });
    assertResourceOwner(existing.authorId, session.user.id);

    await prisma.healthData.delete({ where: { id } });
    await cacheService.delete(`health-data:${id}`);
    return NextResponse.json({});
  } catch (error) {
    return handleApiError(error);
  }
}
