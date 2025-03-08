// back/routes/senha.js
import express from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { prisma } from '../prisma/index.js';
import { enviarEmail } from '../utils/emailConfig.js';
import { detectarTipoIdentificador } from '../utils/validation.js';

const router = express.Router();

// Rota para solicitar recuperação de senha
router.post('/esqueci-senha', async (req, res) => {
  const { identifier } = req.body;
  
  if (!identifier) {
    return res.status(400).json({ error: 'É necessário fornecer email ou telefone' });
  }
  
  try {
    // Verificar se o usuário existe
    const user = await prisma.user.findFirst({
      where: { identifier }
    });
    
    if (!user) {
      // Por segurança, não informamos se o usuário existe ou não
      return res.status(200).json({ 
        message: 'Se o identificador estiver cadastrado, você receberá um email com instruções.' 
      });
    }
    
    // Verificar se o identificador é um email
    const tipo = detectarTipoIdentificador(identifier);
    if (tipo !== 'email') {
      return res.status(400).json({ 
        error: 'Recuperação de senha via telefone ainda não está disponível. Use um email.' 
      });
    }
    
    // Gerar token aleatório
    const token = crypto.randomBytes(20).toString('hex');
    const expiraEm = new Date();
    expiraEm.setHours(expiraEm.getHours() + 1); // Token válido por 1 hora
    
    // Salvar token no banco
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetTokenExpires: expiraEm
      }
    });
    
    // Construir link de recuperação
    const resetLink = `${process.env.FRONTEND_URL}/redefinir-senha/${token}`;
    
    // Enviar email
    await enviarEmail(
      user.identifier,
      'Recuperação de Senha - Lista App',
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6200ea;">Recuperação de Senha</h2>
          <p>Olá ${user.name},</p>
          <p>Recebemos uma solicitação para redefinir sua senha. Se você não fez esta solicitação, ignore este email.</p>
          <p>Para redefinir sua senha, clique no botão abaixo:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #6200ea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Redefinir Minha Senha
            </a>
          </div>
          <p>Ou copie e cole o link abaixo no seu navegador:</p>
          <p style="word-break: break-all; color: #666;">${resetLink}</p>
          <p>Este link é válido por 1 hora.</p>
          <hr style="border: 1px solid #eee; margin: 30px 0;" />
          <p style="color: #666; font-size: 12px;">
            Se você não solicitou esta redefinição, sua conta continua segura e você pode ignorar este email.
          </p>
        </div>
      `
    );
    
    res.status(200).json({ 
      message: 'Se o email estiver cadastrado, você receberá um email com instruções dentro de alguns minutos.' 
    });
    
  } catch (error) {
    console.error('Erro ao processar recuperação de senha:', error);
    res.status(500).json({ error: 'Erro ao processar solicitação' });
  }
});

// Rota para validar token
router.get('/validar-token/:token', async (req, res) => {
  const { token } = req.params;
  
  try {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: {
          gt: new Date() // Token ainda não expirou
        }
      }
    });
    
    if (!user) {
      return res.status(400).json({ error: 'Token inválido ou expirado' });
    }
    
    res.status(200).json({ valid: true });
    
  } catch (error) {
    console.error('Erro ao validar token:', error);
    res.status(500).json({ error: 'Erro ao validar token' });
  }
});

// Rota para redefinir senha
router.post('/redefinir-senha', async (req, res) => {
  const { token, password } = req.body;
  
  if (!token || !password) {
    return res.status(400).json({ error: 'Token e nova senha são obrigatórios' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres' });
  }
  
  try {
    // Buscar usuário pelo token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: {
          gt: new Date() // Token ainda não expirou
        }
      }
    });
    
    if (!user) {
      return res.status(400).json({ error: 'Token inválido ou expirado' });
    }
    
    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Atualizar senha e limpar token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
        updatedAt: new Date()
      }
    });
    
    res.status(200).json({ message: 'Senha redefinida com sucesso' });
    
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    res.status(500).json({ error: 'Erro ao redefinir senha' });
  }
});

export default router;