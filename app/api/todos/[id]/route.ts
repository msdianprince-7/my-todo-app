import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const { id } = await params

  await prisma.todo.delete({
    where: {
      id: Number(id),
      userId: session.user.id
    }
  })

  return NextResponse.json({ message: 'Todo deleted' })
}