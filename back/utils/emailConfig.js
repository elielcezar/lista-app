// back/utils/emailConfig.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configurar o transportador de email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Função para enviar email
export async function enviarEmail(para, assunto, html) {
  try {
    const info = await transporter.sendMail({
      from: `"Lista App" <${process.env.EMAIL_USER}>`,
      to: para,
      subject: assunto,
      html: html
    });
    
    console.log('Email enviado:', info.messageId);
    return info;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw error;
  }
}

// Verificar configuração
export async function verificarConfiguracao() {
  try {
    await transporter.verify();
    console.log('Servidor pronto para enviar emails');
    return true;
  } catch (error) {
    console.error('Erro na configuração de email:', error);
    return false;
  }
}