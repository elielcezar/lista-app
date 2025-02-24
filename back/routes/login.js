import express from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../prisma/index.js'; // Importar a instância que já tem o middleware

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

        // Remove a senha antes de enviar
        const { password: _, ...userWithoutPassword } = user;
        
        // Se a senha for válida, retorne uma resposta de sucesso
        res.status(200).json({ 
            message: 'Login bem-sucedido', 
            user: userWithoutPassword 
        });

    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
});

export default router;