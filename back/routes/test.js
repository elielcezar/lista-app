import { Router } from 'express';
import { prisma } from '../prisma/index.js';

const router = Router();

router.post('/test-encryption', async (req, res) => {
  try {
    // Criar um usuário de teste
    const user = await prisma.user.create({
      data: {
        name: "Usuário Teste 222",
        email: 'teste2222@exemplo.com', 
        password: '123456',
        role: 'colaborador'
      }
    });

    // Buscar o usuário criado
    const foundUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    res.json({
      message: 'Teste realizado com sucesso',
      userCreated: user,
      userFound: foundUser
    });
  } catch (error) {
    console.error('Erro no teste:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router; 