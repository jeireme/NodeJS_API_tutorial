const validTypes = ["Plante", "Poison", "Feu", "Eau", "Insecte", "Vol", "Normal", "Electrik", "Fée"]

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Pokemon', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Le nom est déjà pris."
        },
        validate: {
          notEmpty: { msg: `Le nom renseigné doit contenir au moins un caractère.`},
          notNull: { msg: `Veuillez indiquer un nom pour votre pokémon.`}
        } 
      },
      hp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: { msg: `Utilisez uniquement des nombres entiers pour les points de vie.`},
          notNull: { msg: `Les points de vie sont une propriété requise.` },
          max: {
            args: [999],
            msg: `Le nombre maximal de points de vie ne peut dépasser 999.`
          },
          min: {
            args: [0],
            msg: `Le nombre minimal de points de vie doit être supérieur ou égal à 0.`
          }
        } 
      },
      cp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: { msg: `Utilisez uniquement des nombres entiers pour les points des dégats.`},
          notNull: { msg: `Le points de dégats sont une propriété requise.`},
          max: {
            args: [99],
            msg: `Le nombre maximal de points de vie ne peut dépasser 99.`
          },
          min: {
            args: [0],
            msg: `Le nombre minimal de points de vie doit être supérieur ou égal à 0.`
          }
        } 
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isUrl: { msg: `Veuillez indiquer une url valide pour votre image.`},
          notNull: { msg: `L'url de votre image est une propriété requise.`}
        } 
      },
      types: {
        type: DataTypes.STRING,
        allowNull: false,
        // ? Getter : Base de données -> API Rest
        get() {
          return this.getDataValue('types').split(',') // ? ["Plante", "Poison"]
        },
        // ? Setter : API Rest -> Base de données
        set(types) {
          this.setDataValue('types', types.join()) // ? "Plante, Poison"
        },
        validate: {
          isTypesValid(value) {
            if (!value) {
              throw new Error('Un pokémon doit au moins avoir un type.')
            }
            if (value.split(',').length > 3) {
              throw new Error('Un pokémon ne peut avoir plus de trois types.')
            }
            value.split(',').forEach(type => {
              if (!validTypes.includes(type)) {
                throw new Error(`Le type d'un pokémon doit appartenir à la liste suivante : ${validTypes}`)
              }
            })
          }
        }
      }
    }, {
      timestamps: true,
      createdAt: 'created',
      updatedAt: false
    })
  }