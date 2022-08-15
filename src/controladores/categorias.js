const knex = require('../conexao');

const listarCategorias = async (req, res) => {
    try {
        const categorias = await knex('categorias');
        console.log(categorias);

        if (categorias === undefined) {
            return res.status(404).json("Categoria não encontrada");
        }

        return res.status(200).json(categorias);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = listarCategorias;