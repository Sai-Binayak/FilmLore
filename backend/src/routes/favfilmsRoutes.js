import express from "express";
import { getFavFilms, addFavFilm } from "../controllers/favfilmsController.js";

const router = express.Router();

router.get("/", getFavFilms);
router.post("/", addFavFilm);

export default router;
