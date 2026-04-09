// backend/src/scripts/test-db.ts
import * as dotenv from "dotenv";
// Carrega o .env antes de importar o Prisma
dotenv.config({ path: __dirname + "/../../.env" });
import { PrismaClient } from "@prisma/client";
// Verifica se a variável foi carregada
console.log("DATABASE_URL =", process.env.DATABASE_URL);
const prisma = new PrismaClient(); // NÃO passe opções
async function main() {
    try {
        await prisma.$connect();
        console.log("✅ Conexão com o banco OK");
    }
    catch (e) {
        console.error("❌ Erro ao conectar:", e);
    }
    finally {
        await prisma.$disconnect();
    }
}
main();
