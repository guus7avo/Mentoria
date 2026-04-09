import { PrismaClient } from "@prisma/client";
import type { UserBook, BookStatus } from "@prisma/client";
import { BaseRepository } from "./BaseRepository.js";

const prisma = new PrismaClient();

export class UserBookRepository extends BaseRepository<UserBook> {
  async findById(id: string): Promise<UserBook | null> {
    return prisma.userBook.findUnique({
      where: { id },
    });
  }

  async findByUserId(
    userId: string,
    filters?: { status?: BookStatus }
  ): Promise<UserBook[]> {
    return prisma.userBook.findMany({
      where: {
        userId,
        ...(filters?.status && { status: filters.status }),
      },
      orderBy: {
        addedAt: "desc",
      },
    });
  }

  async findByUserAndBook(
    userId: string,
    bookId: string
  ): Promise<UserBook | null> {
    return prisma.userBook.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    });
  }

  async create(data: {
    userId: string;
    bookId: string;
    status?: BookStatus;
  }): Promise<UserBook> {
    return prisma.userBook.create({
      data,
    });
  }

  async update(
    id: string,
    data: Partial<UserBook>
  ): Promise<UserBook> {
    return prisma.userBook.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.userBook.delete({
      where: { id },
    });
  }

  async countByStatus(userId: string): Promise<{
    wantToRead: number;
    inProgress: number;
    completed: number;
  }> {
    const [wantToRead, inProgress, completed] = await Promise.all([
      prisma.userBook.count({
        where: { userId, status: "WANT_TO_READ" },
      }),
      prisma.userBook.count({
        where: { userId, status: "IN_PROGRESS" },
      }),
      prisma.userBook.count({
        where: { userId, status: "COMPLETED" },
      }),
    ]);

    return {
      wantToRead,
      inProgress,
      completed,
    };
  }
}