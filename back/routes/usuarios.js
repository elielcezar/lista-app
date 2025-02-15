import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const router = express.Router();

// Criar usuario
router.post('/usuarios', async (req, res) => {
    
    console.log('Recebendo requisição POST /usuarios');    
    const { name, email, role, createdBy, password } = req.body;

    try {
        console.log('Dados recebidos:', { name, email, role, createdBy, password });
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const response = await prisma.user.create({
            data: {
                email,
                name,
                role,
                createdBy,
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
    try {
        const { name, email, createdBy } = req.query;
        
        // Log para debug
        console.log('Filtro createdBy:', createdBy);
        
        if (!createdBy) {
            return res.status(400).json({ 
                error: 'Parâmetro createdBy é obrigatório' 
            });
        }

        // Construir objeto where com filtros opcionais
        const where = {
            createdBy: parseInt(createdBy) // createdBy é obrigatório
        };
        
        // Adicionar filtros opcionais
        if (name) where.name = name;
        if (email) where.email = email;

        console.log('Query where:', where);

        const users = await prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                createdBy: true
            }
        });

        console.log('Usuários encontrados:', users.length);
        res.status(200).json(users);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
});


// Obter usuario pelo ID
router.get('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verificar se o ID foi fornecido
        if (!id) {
            return res.status(400).json({
                error: 'ID do usuário não fornecido'
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(id)
            }
        });

        if (!user) {
            return res.status(404).json({
                error: 'Usuário não encontrado'
            });
        }

        console.log('Usuário encontrado:', user);
        res.json(user);
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        res.status(500).json({
            error: 'Erro ao buscar usuário pelo ID',
            details: error.message
        });
    }
});

// Atualizar usuario
router.put('/usuarios/:id', async (req, res) => {    
    try {
        const { id } = req.params;
        const { name, email, password, role } = req.body;   

        // Validar se o ID foi fornecido
        if (!id) {
            return res.status(400).json({
                error: 'ID do usuário não fornecido'
            });
        }

        // Validar dados obrigatórios (agora sem password)
        if (!name || !email) {
            return res.status(400).json({
                error: 'Dados incompletos. Nome e email são obrigatórios.'
            });
        }

        // Preparar objeto de atualização
        const updateData = {
            email,
            name,
            role,
            updatedAt: new Date()
        };

        // Adicionar senha apenas se foi fornecida
        if (password && password.trim() !== '') {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }
        
        const response = await prisma.user.update({
            where: {
                id: parseInt(id)
            },
            data: updateData
        });

        console.log('Usuário atualizado:', response);
        
        // Retornar o usuário atualizado (sem a senha)
        const { password: _, ...userWithoutPassword } = response;
        res.status(200).json(userWithoutPassword);
        
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        
        if (error.code === 'P2025') {
            return res.status(404).json({ 
                error: 'Usuário não encontrado'
            });
        }        
        if (error.code === 'P2002') {
            return res.status(400).json({ 
                error: 'Email já está em uso'
            });
        }
        res.status(500).json({ 
            error: 'Erro ao atualizar usuário',
            details: error.message
        });
    }
});

// Excluir usuario
router.delete('/usuarios/:id', async (req, res) => {  
    try {
        const userId = parseInt(req.params.id);

        // Primeiro, deletar todas as tarefas relacionadas ao usuário
        await prisma.tarefa.deleteMany({
            where: { 
                OR: [
                    { userId: userId },
                    { authorId: userId }
                ]
            }
        });

        // Depois, deletar o usuário
        await prisma.user.delete({
            where: {
                id: userId
            }
        });

        res.status(200).json({
            message: 'Usuário deletado com sucesso'
        });
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        res.status(500).json({
            error: 'Erro ao deletar usuário',
            details: error.message
        });
    }
});

export default router;