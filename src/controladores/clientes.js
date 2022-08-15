const knex = require('../conexao');
const { validaCadastroCliente } = require('../validacoes/schemaCliente');


const cadastrarCliente = async (req, res) => {
    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body;

    try {
        await validaCadastroCliente.validate(req.body);

        const verificarEmail = await knex('clientes').where({ email }).first();
        const verificarCpf = await knex('clientes').where({ cpf }).first();

        if (verificarEmail) {
            return res.status(404).json({ mensagem: "O email já foi cadastrado." });
        }

        if (verificarCpf) {
            return res.status(404).json({ mensagem: "O CPF já foi cadastrado." });
        }

        const cadastroDeCliente = await knex('clientes')
            .insert({ nome, email, cpf, cep, rua, numero, bairro, cidade, estado }).returning('*');

        if (!cadastroDeCliente) {
            return res.status(404).json({ mensagem: "O usuário não pode ser cadastrado." });
        }

        return res.status(200).json({ mensagem: "O usuário foi cadastrado com sucesso." });

    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
}

const atualizarCliente = async (req, res) => {
    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body;
    const { id } = req.params;

    try {

        await validaCadastroCliente.validate(req.body);
        const listaCliente = await knex("clientes").where({ id });
        if (listaCliente.length === 0) {
            return res.status(404).json({ mensagem: "cliente não encontrado" });
        }
        const verificarEmail = await knex('clientes').where({ email }).whereNotIn("id", [id]).first();
        const verificarCpf = await knex('clientes').where({ cpf }).whereNotIn("id", [id]).first();

        if (verificarEmail) {
            return res.status(404).json({ mensagem: "O email já foi cadastrado." });
        }

        if (verificarCpf) {
            return res.status(404).json({ mensagem: "O CPF já foi cadastrado." });
        }





        const clienteAtulizado = await knex('clientes').update({ nome, email, cpf, cep, rua, numero, bairro, cidade, estado }).where({ id });

        return res.status(200).json('cliente atulizado com sucesso');
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};




const detalharCliente = async (req, res) => {
    const { id } = req.params;

    try {
        const detalhaCliente = await knex("clientes").where('id', id);
        if (detalhaCliente.length === 0) {
            return res.status(404).json({ mensagem: "cliente não encontrado" });
        }
        return res.status(200).json(detalhaCliente);
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }

};

const listarCliente = async (req, res) => {


    try {
        const listaCliente = await knex("clientes").orderBy("id");
        if (listaCliente.length === 0) {
            return res.status(404).json({ mensagem: "cliente não encontrado" });
        }
        return res.status(200).json(listaCliente);
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }

};

module.exports = {
    cadastrarCliente,
    atualizarCliente,
    listarCliente,
    detalharCliente

};
