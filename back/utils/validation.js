/**
 * Detecta se o identificador é um email ou telefone
 * @param {string} identifier - O identificador a ser verificado
 * @returns {string} - 'email' ou 'telefone'
 */
export function detectarTipoIdentificador(identifier) {
    return identifier.includes('@') ? 'email' : 'telefone';
  }
  
  /**
   * Valida se o formato do email é válido
   * @param {string} email - O email a ser validado
   * @returns {boolean} - true se o email for válido, false caso contrário
   */
  export function validarEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  /**
   * Valida se o formato do telefone é válido
   * @param {string} telefone - O telefone a ser validado
   * @returns {boolean} - true se o telefone for válido, false caso contrário
   */
  export function validarTelefone(telefone) {
    // Remove caracteres não numéricos
    const numeroLimpo = telefone.replace(/\D/g, '');
    
    // Verifica se tem entre 10 e 11 dígitos (com ou sem DDD)
    if (numeroLimpo.length < 10 || numeroLimpo.length > 11) {
      return false;
    }
    
    // Verifica se não é um número com todos os dígitos iguais
    if (/^(\d)\1+$/.test(numeroLimpo)) {
      return false;
    }
    
    return true;
  }
  
  /**
   * Limpa o telefone removendo caracteres não numéricos
   * @param {string} telefone - O telefone a ser limpo
   * @returns {string} - O telefone apenas com dígitos
   */
  export function limparTelefone(telefone) {
    return telefone.replace(/\D/g, '');
  }