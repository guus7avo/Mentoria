import { PrismaClient } from "@prisma/client";
import type { Book } from "@prisma/client";
import { BaseRepository } from "./BaseRepository.js";

const prisma = new PrismaClient();

type BookInput = {
  title: string;
  author: string;
  isbn?: string;
  externalId?: string;
  externalSource?: string;
  coverImageUrl?: string;
  synopsis?: string;
  totalPages?: number;
};

export class BookRepository extends BaseRepository<Book> {
  async findById(id: string): Promise<Book | null> {
    return prisma.book.findUnique({
      where: { id },
    });
  }

  async findByIsbn(isbn: string): Promise<Book | null> {
    return prisma.book.findFirst({
      where: { isbn },
    });
  }

  async findByExternalId(
    source: string,
    id: string
  ): Promise<Book | null> {
    return prisma.book.findFirst({
      where: {
        externalSource: source,
        externalId: id,
      },
    });
  }

  async search(query: string): Promise<Book[]> {
    return prisma.book.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { author: { contains: query, mode: "insensitive" } },
        ],
      },
    });
  }

  async create(data: BookInput): Promise<Book> {
    return prisma.book.create({
      data,
    });
  }

  async update(id: string, data: Partial<Book>): Promise<Book> {
    return prisma.book.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.book.delete({
      where: { id },
    });
  }

  async upsert(
    data: BookInput,
    uniqueField: "isbn" | "externalId"
  ): Promise<Book> {
    // 🔹 Caso ISBN
    if (uniqueField === "isbn" && data.isbn) {
      const existing = await this.findByIsbn(data.isbn);

      if (existing) return existing;

      return this.create(data);
    }

    // 🔹 Caso external (Google Books, etc)
    if (
      uniqueField === "externalId" &&
      data.externalId &&
      data.externalSource
    ) {
      const existing = await this.findByExternalId(
        data.externalSource,
        data.externalId
      );

      if (existing) return existing;

      return this.create(data);
    }

    throw new Error("Invalid upsert parameters");
  }
}