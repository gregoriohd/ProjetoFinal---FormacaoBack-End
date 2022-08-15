const yup = require('./configuracoes');

const validaLogin = yup.object().shape({
    email: yup.string().required().email(),
    senha: yup.string().required()
});

const validaRedefiniSenha = yup.object().shape({
    email: yup.string().required().email(),
    senha_antiga: yup.string().required(),
    senha_nova: yup.string().required().min(3)
})

module.exports = {
    validaLogin,
    validaRedefiniSenha
};