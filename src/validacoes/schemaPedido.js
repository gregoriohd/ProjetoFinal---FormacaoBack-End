const yup = require('./configuracoes');

validaCadastroPedido = yup.object().shape({
    cliente_id: yup.string().required("É necessário preencher o campo nome!"),
    observacao: yup.string().notRequired(),
    pedido_produtos: yup.array().of(
        yup.object().shape({
            produto_id: yup.number().required().positive().integer(),
            quantidade_produto: yup.number().required().positive().integer(),
        })
    ).required()
});

validaListarPedidos = yup.object().shape({
    cliente_id: yup.number().positive().integer()
})


module.exports = { validaCadastroPedido, validaListarPedidos };