import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
})

export async function POST(req: Request) {
    const session = await auth()

    if (!session?.user?.id) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        )
    }

    const userId = session.user.id as string

    const { prompt } = await req.json()

    if (!prompt) {
        return NextResponse.json(
            { error: 'Prompt is required' },
            { status: 400 }
        )
    }

    const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
            {
                role: 'system',
                content: `You are a productivity assistant. 
        When given a goal, generate exactly 5 specific, 
        actionable todo items. Reply ONLY with a JSON array 
        of strings. No explanation. No markdown.
        Example: ["Todo 1", "Todo 2", "Todo 3"]`
            },
            { role: 'user', content: prompt }
        ],
    })

    const text = completion.choices[0].message.content || '[]'
    const titles: string[] = JSON.parse(text)

    await prisma.todo.createMany({
        data: titles.map(title => ({
            title,
            userId: userId
        }))
    })

    return NextResponse.json({ success: true, count: titles.length })
}