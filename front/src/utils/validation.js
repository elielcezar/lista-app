// Detectar tipo de identificador
export function detectarTipoIdentificador(identifier) {
  return identifier.includes('@') ? 'email' : 'telefone';
}

// Validar email
export function validarEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validar telefone brasileiro
export function validarTelefone(telefone) {
  // Remove caracteres não numéricos
  const numeroLimpo = telefone.replace(/\D/g, '');
  
  // Verifica se tem entre 10 e 11 dígitos (com DDD)
  if (numeroLimpo.length < 10 || numeroLimpo.length > 11) {
    return false;
  }
  
  // Verifica se não é um número com todos os dígitos iguais
  if (/^(\d)\1+$/.test(numeroLimpo)) {
    return false;
  }
  
  return true;
}

// Validar identificador (email ou telefone)
export function validarIdentificador(identifier) {
  const tipo = detectarTipoIdentificador(identifier);
  
  if (tipo === 'email') {
    return validarEmail(identifier);
  } else {
    return validarTelefone(identifier);
  }
}

// Formatar telefone para exibição
export function formatarTelefone(telefone) {
  const numeroLimpo = telefone.replace(/\D/g, '');
  
  if (numeroLimpo.length === 11) {
    return `(${numeroLimpo.substring(0, 2)}) ${numeroLimpo.substring(2, 7)}-${numeroLimpo.substring(7)}`;
  } else if (numeroLimpo.length === 10) {
    return `(${numeroLimpo.substring(0, 2)}) ${numeroLimpo.substring(2, 6)}-${numeroLimpo.substring(6)}`;
  }
  
  return telefone;
}

// Limpar telefone para armazenamento (remover todos os caracteres não numéricos)
export function limparTelefone(telefone) {
  return telefone.replace(/\D/g, '');
}

// Preparar identificador para armazenamento
export function prepararIdentificador(identifier) {
  const tipo = detectarTipoIdentificador(identifier);
  
  if (tipo === 'email') {
    return identifier.trim().toLowerCase();
  } else {
    return limparTelefone(identifier);
  }
} 