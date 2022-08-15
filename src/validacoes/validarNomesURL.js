const supabase = require('../config/supabaseCliente');
async function excluirPorNomeProdutoURL(url, req, res) {

    if (url) {
        const urlNome = url.slice(79, 1000);

        try {
            const { data, error } = await supabase.storage.from(process.env.SUPABASE_BUCKET).remove([urlNome]);

        } catch (error) {
            return res.status(500).json(error.message());
        }
    }
}

module.exports = excluirPorNomeProdutoURL;