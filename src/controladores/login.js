const knex = require('../conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const senhaHash = require('../senhaHash');
const transporte = require('../nodemailer');
const { validaLogin, validaRedefiniSenha } = require('../validacoes/schemaLogin');

const redefinirSenha = async (req, res) => {
    const { email, senha_antiga, senha_nova } = req.body;

    try {

        await validaRedefiniSenha.validate(req.body);

        const quantidadeUsuarios = await knex('usuarios').where("email", email).first();

        if (quantidadeUsuarios === undefined) {
            return res.status(404).json("O usuario não foi encontrado");
        }

        const usuario = quantidadeUsuarios;

        const senhaCorreta = await bcrypt.compare(senha_antiga, usuario.senha);

        if (!senhaCorreta) {
            return res.status(400).json("Email e senha não confere");
        }

        await knex('usuarios').update({ senha: await bcrypt.hash(senha_nova, 10) }).where('id', usuario.id);


        const mailOptions = {
            from: 'Equipe10 <dev.testes@outlook.com.br>',
            to: usuario.email,
            subject: 'Senha atualizada',
            text: `Olá ${usuario.nome}, sua senha de acesso foi atualizada `
        };

        transporte.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });


        return res.status(200).json();
    } catch (error) {
        return res.status(400).json(error.message);
    }
}



const loginUsuario = async (req, res) => {
    const { email, senha } = req.body;

    try {

        await validaLogin.validate(req.body);

        const quantidadeUsuarios = await knex('usuarios').where("email", email).first();

        if (quantidadeUsuarios === undefined) {
            return res.status(400).json("O usuario não foi encontrado");
        }

        const usuario = quantidadeUsuarios;

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.status(400).json("Email e/ou senha incorretos");
        }

        const token = jwt.sign({ id: usuario.id }, senhaHash, { expiresIn: '1h' });

        const { senha: x, ...dadosUsuario } = usuario;

        return res.status(200).json({
            usuario: dadosUsuario,
            token
        });
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

module.exports = {
    redefinirSenha,
    loginUsuario
};