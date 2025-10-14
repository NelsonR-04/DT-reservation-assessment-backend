import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  try {
    // Primero, aplicar las migraciones para asegurar que el esquema esté actualizado
    console.log('Applying Prisma migrations...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });

    // Leer el archivo SQL de semilla
    const seedFilePath = path.join(__dirname, 'seed.sql');
    const seedSQL = fs.readFileSync(seedFilePath, 'utf8');

    // Ejecutar el SQL directamente usando executeRaw de Prisma
    console.log('Populating database with sample data...');

    // Dividir el SQL en declaraciones individuales
    const statements = seedSQL
      .split(';')
      .filter(statement => statement.trim() !== '')
      .map(statement => statement.trim() + ';');

    // Ejecutar cada declaración
    for (const statement of statements) {
      await prisma.$executeRawUnsafe(statement);
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
