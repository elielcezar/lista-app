import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// Criar finalidade
router.post('/finalidade', async (req, res) => {

    console.log('Recebendo requisição POST /finalidade')
    const { nome } = req.body;

    try{
        console.log('Dados recebidos:', nome);

        const response = await prisma.finalidade.create({
            data: {
                nome,
                createdAt: new Date()
            }
        })
        console.log('Novo finalidade criada:', response);
        res.status(201).json(response);        
    }catch (error){
        console.error('Erro ao criar finalidade:', error);
        res.status(500).json({ error: 'Erro ao criar finalidade'});
    }
})

// LIsta finalidades
router.get('/finalidade', async (req, res) => {
    console.log('Recebendo requisição GET /finalidade')

    let finalidades = [];

    if(req.query){
        finalidades = await prisma.finalidade.findMany({
            where: {
                nome: req.query.nome
            }
        });
    }else{
        finalidades = await prisma.finalidade.findMany();
    }

    console.log('Finalidades encontradas:', finalidades);
    res.status(200).json(finalidades);

})

export default router;