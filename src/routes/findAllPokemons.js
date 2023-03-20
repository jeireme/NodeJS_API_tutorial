const { Pokemon } = require("../db/sequelize");
const { Op } = require("sequelize");
const auth = require('../auth/auth')

module.exports = (app) => {
  app.get("/api/pokemons", auth, (req, res) => {
    // * Cette fois, nous n'utilisons pas "params" mais "query" pour tout ce qui correspond à des recherches du type "?name=Bulbizarre"
    if (req.query.name) {
      const name = req.query.name;
      const limit = parseInt(req.query.limit) || 5;

      if (name.length < 2) {
        const message = `Le terme de recherche doit contenir au moins 2 caractères`
        return res.status(400).json({ message})
      }
      
      return Pokemon.findAndCountAll({
        where: {
          name: {
            // ? 'name' est la propriété du modèle Pokémon
            [Op.like]: `%${name}%`, // ? 'name' ici est le critère de la recherche
          },
        },
        order: ["name"],
        // limit: 5,
        limit: limit,
      }).then(({ count, rows }) => {
        const message = `Il y a ${count} pokémons qui correspondent au terme de recherche ${name}.`;
        res.json({ message, data: rows });
      });
    } else {
      Pokemon.findAll({ order: ["name"] })
        .then((pokemons) => {
          const message = "La liste des pokémons a bien été récupérée.";
          res.json({ message, data: pokemons });
        })
        .catch((error) => {
          const message = `La liste des pokémons n'a pas été récupérée. Réessayez dans quelques instants.`;
          res.status(500).json({ message, data: error });
        });
    }
  });
};
