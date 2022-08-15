const supabase = require('../config/supabaseCliente');

const uploadImg = async (req, res) => {
    const { nome, url_produto } = req.body;

    if (!nome) {
        return res.status(400).json({ mensagem: "nome é orbigatorio" });
    }

    if (!url_produto) {
        return res.status(400).json({ mensagem: "url_produto na base64 é orbigatorio" });
    }
    const buffer = Buffer.from(url_produto, 'base64');
    try {

        const { data, error } = await supabase.storage.from(process.env.SUPABASE_BUCKET).upload(nome, buffer);

        if (error) {
            if (error.statusCode === '23505') {
                return res.status(400).json({ mensagem: "ja tem uma imagem com este mesmo nome" });
            }
            return res.status(400).json(error);
        }

        const { publicURL } = await supabase.storage.from(process.env.SUPABASE_BUCKET).getPublicUrl(nome);
        const url = await supabase.storage.from(process.env.SUPABASE_BUCKET).createSignedUrl(nome, 70)
        if (url.error) {
            return res.status(400).json(url.error.message);
        }


        return res.status(200).json(publicURL);


    } catch (error) {
        return res.status(500).json(error.message());
    }
}

module.exports = uploadImg;