const yup = require('./configuracoes');

const validaCadastroUsuario = yup.object().shape({
    nome: yup.string().required(),
    email: yup.string().required().email(),
    senha: yup.string().required().min(3)
})

module.exports = validaCadastroUsuario;