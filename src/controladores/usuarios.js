const knex = require('../conexao');
const bcrypt = require('bcrypt');
const validaCadastroUsuario = require('../validacoes/schemaUsuario');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {

        await validaCadastroUsuario.validate(req.body);

        const cadastroUsuario = await knex('usuarios').where({ email }).first();

        if (cadastroUsuario) {
            return res.status(400).json("O email já existe");
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const usuario = await knex('usuarios').insert({ nome, email, senha: senhaCriptografada }).returning('*');

        if (!usuario) {
            return res.status(400).json("O usuário não foi cadastrado.");
        }

        const { senha: x, ...dadosUsuarios } = usuario[0];
        return res.status(200).json(dadosUsuarios);

    } catch (error) {
        return res.status(400).json(error.message)
    }
};

const editarPerfilUsuario = async (req, res) => {
    let { nome, email, senha } = req.body;
    const id = req.usuario.id;

    try {

        await validaCadastroUsuario.validate(req.body);

        const usuarioExiste = await knex('usuarios').where({ id }).first();

        if (!usuarioExiste) {
            return res.status(404).json('Usuario não encontrado');
        }

        if (senha) {
            senha = await bcrypt.hash(senha, 10);
        }

        if (email !== req.usuario.email) {
            const emailUsuarioExistente = await knex('usuarios').where({ email }).first();

            if (emailUsuarioExistente) {
                return res.status(404).json("O email já existe");
            }
        }

        let usuarioAtualizado = await knex('usuarios').where({ id }).update({ nome, email, senha });

        if (!usuarioAtualizado) {
            return res.status(400).json("O usuario não foi atualizado");
        }

        return res.status(200).json('Usuario foi atualizado com sucesso.');
    } catch (error) {
        return res.status(404).json(error.message);
    }
}

const buscarUsuario = async (req, res) => {
    const { usuario } = req;

    if (!usuario) {
        return res.status(400).json({
            mensagem:
                "Para acessar este recurso um token de autenticação válido deve ser enviado.",
        });
    }
    try {
        return res.status(200).json(usuario);
    } catch (error) {
        return res.status(400).json({ "mensagem ": error.message });
    }
};

module.exports = {
    cadastrarUsuario,
    editarPerfilUsuario,
    buscarUsuario
}