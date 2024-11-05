// Função para formatar CPF
export const formatCPF = (value: string): string => {
  // Remove todos os caracteres não numéricos
  value = value.replace(/\D/g, '');

  // Adiciona os pontos e o hífen
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d)/, '$1.$2');
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

  return value;
};

// Função para formatar Telefone
export const formatPhone = (value: string): string => {
  // Remove todos os caracteres não numéricos
  value = value.replace(/\D/g, '');

  // Formata o número de telefone
  if (value.length > 10) {
    // Formato para número de celular: (XX)XXXXX-XXXX
    value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1)$2-$3');
  } else {
    // Formato para número fixo: (XX)XXXX-XXXX
    value = value.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1)$2-$3');
  }

  return value;
};

export const convertStringForNumber = (value: string): number => {
  console.log('1: ' + value);
  const cleanText = value.replace(',', '');
  console.log('2: ' + cleanText);
  const numericValue =
    parseFloat(cleanText.slice(0, -2) + '.' + cleanText.slice(-2).padEnd(2, '0')) || 0;

  console.log('3: ' + numericValue.toFixed(2));
  return numericValue;
};

export const formatPrice = (valor: number): string => {
  try {
    let [inteiro, decimal] = valor.toString().split('.');
    decimal = (decimal || '00').padEnd(2, '0');
    return `${inteiro},${decimal}`;
  } catch {
    return '0.0';
  }
};

export const cleanPhone = (value: string): string => {
  // Remove todos os caracteres não numéricos e adiciona o DDD
  let tel = '55' + value;
  return tel.replace(/\D/g, '');
};

export const converterData = (dataString: string): string => {
  const data = new Date(dataString);
  return data.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};
