import { encrypt, decrypt } from '../utils/encryption.js';

export const encryptionMiddleware = async (params, next) => {
  // Campos que devem ser criptografados
  const sensitiveFiels = [
    // Campos de usuário
    'name', 'role',
    // Campos de tarefa
    'titulo', 'descricao', 'observacoes'
  ];
  
  if (params.action === 'create' || params.action === 'update') {
    // Criptografa dados antes de salvar
    for (const field of sensitiveFiels) {
      if (params.args.data[field]) {
        params.args.data[field] = encrypt(params.args.data[field].toString());
      }
    }
  }
  
  const result = await next(params);
  
  // Adicionar log para debug
  console.log('Middleware - Ação:', params.action);
  console.log('Middleware - Model:', params.model);
  
  // Função auxiliar para descriptografar registros
  const decryptRecord = (record) => {
    if (!record || typeof record !== 'object') return;
    
    // Processa campos do registro atual
    for (const field of sensitiveFiels) {
      if (record[field] && typeof record[field] === 'string' && record[field].includes(':')) {
        try {
          record[field] = decrypt(record[field]);
          // Log do campo descriptografado
          console.log(`Campo ${field} descriptografado com sucesso`);
        } catch (error) {
          console.log(`Erro ao descriptografar campo ${field}:`, error);
        }
      }
    }
    
    // Processa relacionamentos
    if (record.user) decryptRecord(record.user);
    if (record.author) decryptRecord(record.author);
  };

  if (params.action === 'findUnique' || params.action === 'findMany') {
    if (result) {
      const records = Array.isArray(result) ? result : [result];
      records.forEach(record => {
        // Adicionar log para debug
        console.log('Processando registro:', record);
        decryptRecord(record);
      });
    }
  }
  
  return result;
};