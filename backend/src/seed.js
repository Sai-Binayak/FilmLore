import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const genres = ["Action", "Comedy", "Drama", "Horror", "Romance", "Sci-Fi", "Thriller", "Fantasy", "Adventure", "Documentary"];

const films = Array.from({ length: 100 }, (_, i) => ({
  title: `Film #${i + 1}`,
  type: i % 2 === 0 ? "Movie" : "TV_Show",
  director: `Director ${i + 1}`,
  budget: 1000000 + i * 50000,
  location: `Location ${i + 1}`,
  duration: `${100 + i} min`,
  year_or_time: (2000 + (i % 25)).toString(),
  genre: genres[i % genres.length],
  rating: parseFloat((Math.random() * 10).toFixed(1)),
}));

async function main() {
  console.log("🌱 Seeding database...");
  await prisma.favfilms.createMany({ data: films });
  console.log("✅ Done seeding 100 entries!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
