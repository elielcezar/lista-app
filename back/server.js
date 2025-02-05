import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import usuariosRoutes from './routes/usuarios.js';
import imoveisRoutes from './routes/imoveis.js';
import loginRoutes from './routes/login.js';
import categoriasRoutes from './routes/categorias.js';
import tipoRoutes from './routes/tipoImovel.js';
import finalidadeRoutes from './routes/finalidade.js';

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Rotas especificas para cada caso
app.use(usuariosRoutes);
app.use(imoveisRoutes);
app.use(loginRoutes);
app.use(categoriasRoutes);
app.use(tipoRoutes);
app.use(finalidadeRoutes);
app.use('/uploads', express.static('uploads'));

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});