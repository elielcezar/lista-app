import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Criar categoria
router.post('/categorias', async (req, res) => {

    console.log('Recebendo requisição POST /categorias')
    const { nome } = req.body;

    try{
        console.log('Dados recebidos:', nome);

        const response = await prisma.categoria.create({
            data: {
                nome,
                createdAt: new Date()
            }
        })
        console.log('Categoria criada:', response);
        res.status(201).json(response);        
    }catch (error){
        console.error('Erro ao criar categoria:', error);
        res.status(500).json({ error: 'Erro ao criar categoria'});
    }
})

// LIsta categorias
router.get('/categorias', async (req, res) => {
    console.log('Recebendo requisição GET /categorias')

    let categorias = [];

    if(req.query){
        categorias = await prisma.categoria.findMany({
            where: {
                nome: req.query.nome
            }
        });
    }else{
        categorias = await prisma.categoria.findMany();
    }

    console.log('Categorias encontradas:', categorias);
    res.status(200).json(categorias);

})

export default router;