import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Criar categoria
router.post('/tipo', async (req, res) => {

    console.log('Recebendo requisição POST /tipo')
    const { nome } = req.body;

    try{
        console.log('Dados recebidos:', nome);

        const response = await prisma.tipo.create({
            data: {
                nome,
                createdAt: new Date()
            }
        })
        console.log('Novo tipo criado:', response);
        res.status(201).json(response);        
    }catch (error){
        console.error('Erro ao criar tipo de imóvel:', error);
        res.status(500).json({ error: 'Erro ao criar tipo de imóvel'});
    }
})

// LIsta categorias
router.get('/tipo', async (req, res) => {
    console.log('Recebendo requisição GET /tipo')

    let tipos = [];

    if(req.query){
        tipos = await prisma.tipo.findMany({
            where: {
                nome: req.query.nome
            }
        });
    }else{
        tipos = await prisma.tipo.findMany();
    }

    console.log('Tipos de imóvel encontrados:', tipos);
    res.status(200).json(tipos);

})

export default router;