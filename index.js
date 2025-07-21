import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.ejs", { pokemon: null, error: null });
});

app.post("/", async (req, res) => {
  const searchTerm = req.body.pokemonName?.trim();

  if (!searchTerm) {
    return res.render("index.ejs", {
      pokemon: null,
      error: "Please enter your Pokemon name or ID.",
    });
  }

  try {
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`
    );
    const data = response.data;

    const pokemon = {
      name: data.name,
      id: data.id,
      sprite: data.sprites.front_default,
      types: data.types.map((t) => t.type.name),
      abilities: data.abilities.map((a) => a.ability.name),
      stats: data.stats.map((s) => ({
        name: s.stat.name,
        value: s.base_stat,
      })),
    };
    res.render("index.ejs", { pokemon, error: null });
  } catch (error) {
    console.error("API ERROR:", error.message);
    res.render("index.ejs", {
      pokemon: null,
      error: "could not fetch the pokemon.",
    });
  }
});

app.listen(port, () => {
  console.log(`The Server is running on ${port}`);
});
