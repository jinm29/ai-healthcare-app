import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { LLMProvider } from '@/app/api/llm-providers/route';
import { encrypt } from '@/lib/encryption';
import { requireAuth } from '@/lib/api/auth-helpers';
import { handleApiError } from '@/lib/errors';

export interface LLMProviderPatchRequest {
  apiKey?: string;
}

export interface LLMProviderPatchResponse {
  llmProvider: LLMProvider;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth();
    const { id } = await params;
    const body: LLMProviderPatchRequest = await req.json();

    if (body.apiKey) {
      body.apiKey = encrypt(body.apiKey);
    }

    const llmProvider = await prisma.lLMProvider.update({
      where: { id },
      data: body,
    });

    return NextResponse.json<LLMProviderPatchResponse>({ llmProvider });
  } catch (error) {
    return handleApiError(error);
  }
}
