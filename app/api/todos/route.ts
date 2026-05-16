import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const todos = await prisma.todo.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  })

  return NextResponse.json(todos)
}

export async function POST(req: Request) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const { title } = await req.json()

  if (!title) {
    return NextResponse.json(
      { error: 'Title is required' },
      { status: 400 }
    )
  }

  const todo = await prisma.todo.create({
    data: {
      title,
      userId: session.user.id
    }
  })

  return NextResponse.json(todo, { status: 201 })
}