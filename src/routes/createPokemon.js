const { Pokemon } = require('../db/sequelize')
const { ValidationError, UniqueConstraintError } = require('sequelize')
const auth = require('../auth/auth')

  
module.exports = (app) => {
  app.post('/api/pokemons', auth, (req, res) => {
    Pokemon.create(req.body)
      .then(pokemon => {
        const message = `Le pokémon ${req.body.name} a bien été crée.`
        res.json({ message, data: pokemon })
      })
      .catch(error => {

        // * S'il s'agit d'une erreur de validation (null pour le name, ou "!:;ù" pour les points de vie)
        if (error instanceof ValidationError) {
          return res.status(400).json({message: error.message, data: error})
        }

        // * Si le nom d'un pokémon n'est pas unique 
        if (error instanceof UniqueConstraintError) {
          return res.status(400).json({ message: error.message, data: error})
        } 

        const message = `Le pokémon n'a pas pu être ajouté. Réessayez dans quelques instants.`
        res.status(500).json({message, data: error})
      })
  })
}