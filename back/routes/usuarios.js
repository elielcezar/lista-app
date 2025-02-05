import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const router = express.Router();

// Criar usuario
router.post('/usuarios', async (req, res) => {
    
    console.log('Recebendo requisição POST /usuarios');    
    const { name, email, password } = req.body;    

    try {
        console.log('Dados recebidos:', { name, email, password });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const response = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                createdAt: new Date()               
            }
        });
        console.log('Usuário criado:', response);
        res.status(201).json(response);
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
});

// Listar usuarios
router.get('/usuarios', async (req, res) => {

    console.log('Recebendo requisição GET /usuarios');
    let users = [];    

    if(req.query){
        users = await prisma.user.findMany({
            where:{
                name: req.query.name,
                email: req.query.email,
                password: req.query.password
            }
        })
    }else{
        users = await prisma.user.findMany();
    }
    console.log('Usuários encontrados:', users);
    res.status(200).json(users);

});


// Obter usuario pelo ID
router.get('/usuarios/:id', async (req, res) => {
    try{
        const {id} = req.params;
        const user = await prisma.user.findUnique({
            where: {
                id: id
            }
        });
        if(!user){
            return res.status(404).json({
                error: 'Usuário não encontrado'
            })
        }
        res.json(user);
    }catch(error){
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({
            error: 'Erro ao buscar usuário'
        });
    }
});

// Atualizar usuario
router.put('/usuarios/:id', async (req, res) => {    

    try{
        console.log('Recebendo requisição PUT /usuarios');    

        const { name, email, password } = req.body;   
        const hashedPassword = await bcrypt.hash(password, 10);
        const response = await prisma.user.update({
            where: {
                id: req.params.id
            },
            data: {
                email,
                name,
                password: hashedPassword,
            }
        });
        console.log('Usuário atualizado:', response);
        res.status(200).json(req.body);
    }catch(error){
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
});

// Excluir usuario
router.delete('/usuarios/:id', async (req, res) => {    
    await prisma.user.delete({
        where: {
            id: req.params.id
        }
    });
    res.status(200).json({
        message: 'Usuario deletado com sucesso'
    });
});

export default router;
