import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { decrypt } from '@/lib/encryption';
import { currentDeploymentEnv } from '@/lib/current-deployment-env';
import { requireAuth } from '@/lib/api/auth-helpers';
import { handleApiError } from '@/lib/errors';
import { cacheService } from '@/lib/redis';
import { logger } from '@/lib/logger';

export interface LLMProviderModel {
  id: string;
  name: string;
}

export interface LLMProviderModelListResponse {
  llmProviderModels: LLMProviderModel[];
}

async function fetchProviderModels(providerId: string, llmProvider: {
  apiKey: string;
  apiURL: string | null;
  providerId: string;
}): Promise<LLMProviderModel[]> {
  let apiKey: string;
  try {
    apiKey = decrypt(llmProvider.apiKey);
  } catch {
    apiKey = '';
  }

  if (providerId === 'openai') {
    if (currentDeploymentEnv === 'cloud') apiKey = process.env.OPENAI_API_KEY as string;
    const results: LLMProviderModel[] = [];
    const openAI = new OpenAI({ apiKey, baseURL: llmProvider.apiURL ?? undefined });
    const modelsPage = await openAI.models.list();
    for await (const models of modelsPage.iterPages()) {
      results.push(
        ...models.data
          .filter((model) => {
            if (currentDeploymentEnv === 'cloud') {
              return ['gpt-4o', 'o3-mini'].includes(model.id);
            }
            return !model.id.startsWith('ft:');
          })
          .map((model) => ({ id: model.id, name: model.id })),
      );
    }
    return results;
  }

  if (providerId === 'anthropic') {
    if (currentDeploymentEnv === 'cloud') apiKey = process.env.ANTHROPIC_API_KEY as string;
    const results: LLMProviderModel[] = [];
    const anthropic = new Anthropic({ apiKey, baseURL: llmProvider.apiURL ?? undefined });
    const modelsPage = await anthropic.models.list();
    for await (const models of modelsPage.iterPages()) {
      results.push(
        ...models.data
          .filter((model) => {
            if (currentDeploymentEnv === 'cloud') {
              return model.id.startsWith('claude-3-5') || model.id.startsWith('claude-3-7');
            }
            return true;
          })
          .map((model) => ({ id: model.id, name: model.id })),
      );
    }
    return results;
  }

  if (providerId === 'google') {
    if (currentDeploymentEnv === 'cloud') apiKey = process.env.GOOGLE_API_KEY as string;
    const url = new URL('https://generativelanguage.googleapis.com/v1beta/models');
    url.searchParams.append('key', apiKey);
    url.searchParams.append('pageSize', '1000');
    const response = await fetch(url.toString());
    const { models } = await response.json();
    return models
      .filter(({ displayName }: { displayName: string }) => {
        if (currentDeploymentEnv === 'cloud') {
          return displayName === 'Gemini 2.0 Flash';
        }
        return true;
      })
      .map(({ name, displayName }: { name: string; displayName: string }) => ({
        id: name,
        name: displayName,
      }));
  }

  if (providerId === 'ollama') {
    const apiURL = llmProvider.apiURL;
    const response = await fetch(`${apiURL}/api/tags`);
    const { models } = await response.json();
    return models.map(({ model, name }: { name: string; model: string }) => ({
      id: model,
      name,
    }));
  }

  return [];
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth();
    const { id } = await params;

    const llmProvider = await prisma.lLMProvider.findUniqueOrThrow({ where: { id } });

    const llmProviderModels = await cacheService.getOrSet(
      `llm-provider-models:${id}`,
      () => fetchProviderModels(llmProvider.providerId, llmProvider),
      { ttlSeconds: 600 },
    );

    if (llmProviderModels.length === 0) {
      return NextResponse.json({ error: 'Not implemented' }, { status: 403 });
    }

    return NextResponse.json<LLMProviderModelListResponse>({ llmProviderModels });
  } catch (error) {
    logger.error('Failed to list LLM provider models', {
      message: error instanceof Error ? error.message : 'Unknown error',
    });
    return handleApiError(error);
  }
}
