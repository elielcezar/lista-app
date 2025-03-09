// back/utils/whatsappConfig.js
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Envia uma mensagem WhatsApp usando o Twilio
 * @param {string} para - Número de telefone do destinatário (com código do país)
 * @param {string} mensagem - Conteúdo da mensagem
 * @returns {Promise} - Promessa com o resultado do envio
 */
export async function enviarWhatsApp(para, mensagem) {
  try {
    // Garantir que o número tenha o formato internacional
    const numeroFormatado = formatarNumeroInternacional(para);
    
    const message = await client.messages.create({
      body: mensagem,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${numeroFormatado}`
    });
    
    console.log(`Mensagem WhatsApp enviada com SID: ${message.sid}`);
    return message;
  } catch (error) {
    console.error('Erro ao enviar WhatsApp:', error);
    throw error;
  }
}

/**
 * Formata um número de telefone para o padrão internacional
 * @param {string} numero - Número de telefone (pode estar em vários formatos)
 * @returns {string} - Número formatado com código do país
 */
function formatarNumeroInternacional(numero) {
  // Remover todos os caracteres não numéricos
  let numeroLimpo = numero.replace(/\D/g, '');
  
  // Se começar com 0, remover
  if (numeroLimpo.startsWith('0')) {
    numeroLimpo = numeroLimpo.substring(1);
  }
  
  // Se não tiver código do país (assumindo Brasil)
  if (numeroLimpo.length <= 11) {
    numeroLimpo = `55${numeroLimpo}`;
  }
  
  // Garantir que comece com +
  return numeroLimpo.startsWith('+') ? numeroLimpo : `+${numeroLimpo}`;
}

/**
 * Verifica se a configuração do WhatsApp está correta
 * @returns {Promise<boolean>} - true se estiver configurado corretamente
 */
export async function verificarConfiguracaoWhatsApp() {
  try {
    // Verificar se as variáveis de ambiente estão definidas
    if (!process.env.TWILIO_ACCOUNT_SID || 
        !process.env.TWILIO_AUTH_TOKEN || 
        !process.env.TWILIO_WHATSAPP_NUMBER) {
      console.error('Configuração do Twilio incompleta. Verifique as variáveis de ambiente.');
      return false;
    }
    
    // Verificar se a conta está ativa
    await client.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
    console.log('Configuração do Twilio WhatsApp verificada com sucesso');
    return true;
  } catch (error) {
    console.error('Erro na configuração do Twilio:', error);
    return false;
  }
}