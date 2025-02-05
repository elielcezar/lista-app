import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const router = express.Router();

// Login do usuario
router.post('/login', async (req, res) => {
    
    const { email, password } = req.body;
    console.log(email, password)

    try {        
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ error: 'Usuário não encontrado' });
        }
        // Compare a senha fornecida com a senha armazenada
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Senha inválida' });
        }
        // Se a senha for válida, retorne uma resposta de sucesso
        res.status(200).json({ message: 'Login bem-sucedido', user });

    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
});

export default router;