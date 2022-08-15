const yup = require('./configuracoes');

validaCadastroCliente = yup.object().shape({
    nome: yup.string().required("É necessário preencher o campo nome!"),
    email: yup.string().required("É necessário preencher o campo email!").email(),
    cpf: yup.string().required("É necessário preencher o campo cpf!").min(11).max(11),
    cep: yup.string().notRequired().min(8).max(8),
    rua: yup.string().notRequired(),
    numero: yup.number().notRequired().positive().integer(),
    bairro: yup.string().notRequired(),
    cidade: yup.string().notRequired(),
    estado: yup.string().notRequired()
});

module.exports = { validaCadastroCliente };
