const yup = require('./configuracoes');

const validaCadastroProduto = yup.object().shape({
    descricao: yup.string().required(),
    quantidade_estoque: yup.number().required().integer().test("", "quantidade_estoque não dever ser um numero negativo", (quantidade_estoque) => {
        if (quantidade_estoque < 0) {
            return false;
        }
        return true
    }),
    valor: yup.number().required().positive().integer(),
    categoria_id: yup.number().required().positive().integer()
})

const validaAtualizarProduto = yup.object().shape({
    id: yup.number().required("o paramento id é obrigatorio")
})

module.exports = { validaCadastroProduto, validaAtualizarProduto };