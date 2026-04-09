import { PrismaClient } from "@prisma/client";
import type { Rating } from "@prisma/client";
import { BaseRepository } from "./BaseRepository.js";

const prisma = new PrismaClient();

export class RatingRepository extends BaseRepository<Rating> {
  async findById(id: string): Promise<Rating | null> {
    return prisma.rating.findUnique({
      where: { id },
    });
  }

  async findByUserAndBook(
    userId: string,
    bookId: string
  ): Promise<Rating | null> {
    return prisma.rating.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    });
  }

  async findByBook(bookId: string): Promise<Rating[]> {
    return prisma.rating.findMany({
      where: { bookId },
    });
  }

  async create(data: {
    userId: string;
    bookId: string;
    stars: number;
    review?: string;
  }): Promise<Rating> {
    return prisma.rating.create({
      data,
    });
  }

  async update(
    id: string,
    data: Partial<Rating>
  ): Promise<Rating> {
    return prisma.rating.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.rating.delete({
      where: { id },
    });
  }
}