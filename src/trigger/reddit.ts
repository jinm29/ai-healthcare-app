import {schedules, task, wait} from '@trigger.dev/sdk/v3'
import prisma from "@/lib/prisma";
import assistantModes from '../../prisma/data/assistant-mode.json'
import {ChatOpenAI} from "@langchain/openai";
import {ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate} from "@langchain/core/prompts";

interface NewPostInput {
    postId: string;
}

interface CommentOnPostInput {
    postId: string;
    assistantModeId: string;
}

async function getAccessToken(): Promise<string> {
    const clientId = process.env.REDDIT_CLIENT_ID as string
    const clientSecret = process.env.REDDIT_CLIENT_SECRET as string

    const username = process.env.REDDIT_ADMIN_USERNAME as string
    const password = process.env.REDDIT_ADMIN_PASSWORD as string

    const redditAccessToken = await prisma.redditAccessToken.findFirst({
        where: {username: username, expiresAt: {gt: new Date(Date.now() + 10 * 60 * 1000)}}
    })
    if (redditAccessToken) return redditAccessToken.accessToken

    const searchParams = new URLSearchParams({grant_type: 'password', username, password})
    const response = await fetch(`https://www.reddit.com/api/v1/access_token?${searchParams.toString()}`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    })
    const {
        access_token: accessToken,
        token_type: tokenType,
        expires_in: expiresIn,
        scope,
    } = await response.json()

    // Save the access token to the database
    await prisma.redditAccessToken.create({
        data: {
            username,
            accessToken,
            tokenType,
            expiresIn,
            scope,
            expiresAt: new Date(Date.now() + expiresIn * 1000),
        }
    })

    return accessToken
}

async function createPostComment({postId, content, accessToken}: {
    postId: string,
    content: string,
    accessToken: string
}) {
    // Comment on the post
    const commentResponse = await fetch(`https://oauth.reddit.com/api/comment`, {
        method: 'POST',
        body: new URLSearchParams({
            api_type: 'json',
            thing_id: `t3_${postId}`,
            text: content.toString(),
        }),
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    })

    const {json} = await commentResponse.json()
    const {data, errors} = json

    // Handle errors
    if (errors) {
        const headers = commentResponse.headers
        const xRateLimitReset = headers.get('x-ratelimit-reset')
        if (xRateLimitReset) {
            const waitUntil = Number(xRateLimitReset)
            if (waitUntil > 0) {
                await wait.for({seconds: waitUntil})
                throw new Error('Rate Limit Exceeded')
            }
        }
    }

    // Save the comment to the database
    const {things} = data
    const [comment] = things
    const {data: commentData} = comment
    const {id: commentId, created_utc} = commentData

    await prisma.redditPostComment.create({
        data: {
            postId: postId,
            commentId: commentId,
            content: content.toString(),
            createdAt: new Date(created_utc * 1000),
            updatedAt: new Date(created_utc * 1000),
        }
    })

    return commentResponse
}

export const newPostScheduler = schedules.task({
    id: 'new-post-scheduler',
    cron: '*/5 * * * *',
    async run() {
        const subreddit = process.env.REDDIT_SUBREDDIT as string

        // Query New Posts from subreddit
        const postResponse = await fetch(`https://oauth.reddit.com/r/${subreddit}/new`, {
            headers: {
                'Authorization': `Bearer ${await getAccessToken()}`,
            }
        })
        const {data} = await postResponse.json()
        const {children} = data

        for (const child of children) {
            const {id, title, selftext: selfText, created_utc} = child.data
            const redditPost = await prisma.redditPost.findUnique({where: {postId: id.toString()}});
            if (redditPost) continue

            // Save the post to the database
            await prisma.redditPost.create({
                data: {
                    postId: id.toString(),
                    title: title.toString(),
                    content: selfText.toString(),
                    createdAt: new Date(created_utc * 1000),
                    updatedAt: new Date(created_utc * 1000),
                }
            })

            // Trigger the commentOnPost task
            await newPost.trigger({postId: id})
        }
    }
})

export const newPost = task({
    id: 'new-post',
    async run(input: NewPostInput) {
        const redditPost = await prisma.redditPost.findUniqueOrThrow({where: {postId: input.postId}})

        // Pick the assistant modes from the database
        console.log(redditPost)

        // Get the post from Reddit API
        for (const {name, description} of assistantModes) {
            const assistantMode = await prisma.assistantMode.findFirst({where: {name, description}})
            if (assistantMode) {
                await commentOnPost.trigger({
                    postId: input.postId,
                    assistantModeId: assistantMode.id
                })
            }
        }
    }
})

export const commentOnPost = task({
    id: 'comment-on-post',
    queue: {
        name: 'comment-on-post-queue',
        concurrencyLimit: 1,
    },
    async run(input: CommentOnPostInput) {
        const assistantMode = await prisma.assistantMode.findUniqueOrThrow({where: {id: input.assistantModeId}})
        const redditPost = await prisma.redditPost.findUniqueOrThrow({where: {postId: input.postId}})

        // Generate the comment
        const llm = new ChatOpenAI({model: 'o3-mini'}).withConfig({
            runName: 'reddit-comment',
        })
        const prompt = ChatPromptTemplate.fromMessages([
            SystemMessagePromptTemplate.fromTemplate(assistantMode.systemPrompt),
            HumanMessagePromptTemplate.fromTemplate('{question}'),
        ])
        const response = await prompt.pipe(llm).invoke({question: redditPost.content})
        await createPostComment({
            postId: input.postId,
            content: response.content.toString(),
            accessToken: await getAccessToken()
        })
    }
})