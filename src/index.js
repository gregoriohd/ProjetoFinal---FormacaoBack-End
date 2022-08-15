const express = require('express');
const rotas = require('./rotas');
const cors = require('cors');

const app = express();

app.use(express.json({ 'limit': '5mb' }));
app.use(cors());
app.use(rotas);

app.listen(process.env.PORT || 3000);