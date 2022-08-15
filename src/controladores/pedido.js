const knex = require('../conexao');
const { validaCadastroPedido, validaListarPedidos } = require('../validacoes/schemaPedido');

const cadastrarPedido = async (req, res) => {
    const { cliente_id, observacao, pedido_produtos } = req.body;

    try {
        await validaCadastroPedido.validate(req.body);

        const verificarCliente = await knex('clientes').where({ id: cliente_id }).first();

        if (!verificarCliente) {
            return res.status(404).json({ mensagem: "O cliente solicitado não foi encontrado." });
        }

        let valorDosPedidos = 0;
        for (const produto of pedido_produtos) {
            const verificarProduto = await knex('produtos').where({ id: produto.produto_id }).first();

            if (verificarProduto.length === 0) {
                return res.status(404).json({ mensagem: "O produto solicitado não foi encontrado." });
            }


            if (produto.quantidade_produto > verificarProduto.quantidade_estoque) {
                return res.status(404).json({ mensagem: `O pedido solicitado está acima do valor de estoque, que é de ${produto.quantidade_produto} unidade(s).` });
            }

            valorDosPedidos += (verificarProduto.valor * produto.quantidade_produto);

        }

        const inserirPedidos = await knex('pedidos')
            .insert({ cliente_id, observacao, valor_total: valorDosPedidos });

        if (!inserirPedidos) {
            return res.status(404).json({ mensagem: "Não foi possível inserir os pedidos." });
        }

        const clienteIdPedido = await knex('pedidos').where({ cliente_id }).orderBy('id', 'desc').first();
        let subtracaoEstoque = 0;
        for (const produto of pedido_produtos) {
            const verificarProduto = await knex('produtos').where({ id: produto.produto_id }).first();
            subtracaoEstoque = verificarProduto.quantidade_estoque - produto.quantidade_produto;

            const atualizarProduto = await knex('produtos')
                .where({ id: produto.produto_id }).update({ quantidade_estoque: subtracaoEstoque });

            if (!atualizarProduto) {
                return res.status(404).json({ mensagem: "Não foi possível atualizar o produto no estoque." });
            }

            const inserirPedidosProdutos = await knex('pedido_produtos')
                .insert({
                    pedido_id: clienteIdPedido.id, produto_id: produto.produto_id,
                    quantidade_produto: produto.quantidade_produto, valor_produto: produto.quantidade_produto * verificarProduto.valor
                });

            if (!inserirPedidosProdutos) {
                return res.status(404).json({ mensagem: "Não foi possível inserir o produto no pedido." });
            }
        }



        return res.status(200).json("Pedido cadastrado com sucesso.");

    } catch (error) {
        return res.status(400).json({ mensagem: error.message })
    }
}

const listarPedidos = async (req, res) => {

    const { cliente_id } = req.query;

    try {
        let pedidos = await knex('pedidos');

        if (cliente_id) {
            await validaListarPedidos.validate(req.query);
            pedidos = await knex('pedidos').where({ cliente_id: cliente_id });
            if (pedidos.length === 0) {
                return res.status(404).json({ mensagem: "Cliente não encontrado." });
            }
        }

        if (!pedidos) {
            return res.status(404).json({ mensagem: "Pedido não encontrado." });
        }

        let lista = [];

        for (const pedido0 of pedidos) {
            const pedidoProduto = await knex('pedido_produtos').where({ pedido_id: pedido0.id })

            let vetorPedido = {
                pedido: {
                    id: pedido0.id,
                    valor_total: pedido0.valor_total,
                    observacao: pedido0.observacao,
                    cliente_id: pedido0.cliente_id
                },
                pedido_produtos: [...pedidoProduto]
            }

            lista.push(vetorPedido);
        }
        return res.status(200).json(lista);

    } catch (error) {
        return res.status(400).json({ mensagem: error.message })
    }
}

module.exports = {
    cadastrarPedido,
    listarPedidos
}


