import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Get all favorite films
export const getFavFilms = async (req, res) => {
  try {
    const films = await prisma.favfilms.findMany();
    res.json(films);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a new film
export const addFavFilm = async (req, res) => {
  try {
    const { title, type, director, budget, location, duration, year_or_time } = req.body;

    const film = await prisma.favfilms.create({
      data: { title, type, director, budget, location, duration, year_or_time },
    });

    res.status(201).json(film);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
