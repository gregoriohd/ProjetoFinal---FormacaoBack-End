const knex = require('../conexao');
const bcrypt = require('bcrypt');
const { validaCadastroProduto, validaAtualizarProduto } = require('../validacoes/schemaProduto');
const excluirPorNomeProdutoURL = require('../validacoes/validarNomesURL');

const cadastrarProduto = async (req, res) => {
    const { descricao, quantidade_estoque, valor, categoria_id, produto_imagem } = req.body;


    try {

        await validaCadastroProduto.validate(req.body);

        const categoriaExiste = await knex('categorias').where({ id: categoria_id }).first();

        if (!categoriaExiste) {
            return res.status(404).json({ mensagem: "categoria não encontrada." });
        }

        const produto = await knex('produtos').insert({ descricao, quantidade_estoque, valor, categoria_id, produto_imagem }).returning('*');

        if (!produto) {
            return res.status(400).json({ mensagem: "O produto não foi cadastrado." });
        }

        return res.status(200).json(produto);

    } catch (error) {
        return res.status(400).json({ mensagem: error.message })
    }
};

const atualizarSemIdProduto = async (req, res) => {
    try {
        await validaAtualizarProduto.validate(req.params);
    } catch (error) {
        return res.status(400).json({ mensagem: error.message })
    }
}

const atualizarProduto = async (req, res) => {
    let { descricao, quantidade_estoque, valor, categoria_id, produto_imagem } = req.body;
    const { id } = req.params;


    try {

        await validaCadastroProduto.validate(req.body);

        await validaAtualizarProduto.validate(req.params);

        const categoriaExiste = await knex('categorias').where({ id: categoria_id }).first();

        if (!categoriaExiste) {
            return res.status(404).json({ mensagem: "categoria não encontrada." });
        }

        const produtoExiste = await knex('produtos').where({ id }).first();

        if (!produtoExiste) {
            return res.status(404).json({ mensagem: 'produto não encontrado' });
        }

        if (!produto_imagem) {
            produto_imagem = null;
        }


        excluirPorNomeProdutoURL(produtoExiste.produto_imagem, req, res)

        const produto = await knex('produtos').update({ descricao, quantidade_estoque, valor, categoria_id, produto_imagem }).where('id', id).returning(['*']);

        if (!produto) {
            return res.status(400).json({ mensagem: "O produto não foi cadastrado." });
        }

        return res.status(200).json(produto[0]);

    } catch (error) {
        return res.status(400).json({ mensagem: error.message })
    }
};

const listarProdutos = async (req, res) => {

    const { categoria_id } = req.query;

    if (categoria_id) {
        try {
            const produtosPorCategorias = await knex('produtos').where({ categoria_id });
            if (produtosPorCategorias.length === 0) {
                return res.status(404).json({ mensagem: "produto não encontrado" });
            }
            return res.status(200).json(produtosPorCategorias);
        } catch (error) {
            return res.status(400).json({ mensagem: error.message });
        }
    }

    try {
        const listaProdutos = await knex('produtos');
        if (listaProdutos.length === 0) {
            return res.status(404).json({ mensagem: "produtos não encontrado" });
        }
        return res.status(200).json(listaProdutos);
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }

}

const detalharProduto = async (req, res) => {
    const { id } = req.params;

    try {
        const produtoSelecionado = await knex('produtos').where({ id }).first();

        if (!produtoSelecionado) {
            return res.status(404).json({ mensagem: "O produto listado não foi encontrado" });
        }

        return res.status(200).json(produtoSelecionado);
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
}

const excluirProduto = async (req, res) => {
    const { id } = req.params;

    try {
        const produtoEncontrado = await knex('produtos').where({ id }).first();

        if (!produtoEncontrado) {
            return res.status(400).json("O produto não foi encontrado");
        }

        const pedidoProdutoEncontrado = await knex('pedido_produtos').where({ produto_id: id }).first();

        if (pedidoProdutoEncontrado) {
            return res.status(400).json("O produto não pode ser excluido, pois encontra-se no pedido");
        }

        // Aprimorar exclusão de produto vem nesta linha

        const produtoExcluido = await knex('produtos').where({ id }).delete();

        if (produtoEncontrado.produto_imagem) {
            const imgExcluir = excluirPorNomeProdutoURL(produtoEncontrado.produto_imagem);
            if (imgExcluir === 0) {
                return res.status(404).json({ mensagem: "Imagem não encontrada" });
            }

            if (imgExcluir === 1) {
                return res.status(400).json({ mensagem: "erro ao excluir imagem" });
            }
        }
        if (!produtoExcluido) {
            return res.status(400).json("O produto não foi excluido");
        }

        return res.status(200).json('Produto excluido com sucesso');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = { cadastrarProduto, atualizarProduto, atualizarSemIdProduto, listarProdutos, detalharProduto, excluirProduto }

