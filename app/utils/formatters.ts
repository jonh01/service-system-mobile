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
