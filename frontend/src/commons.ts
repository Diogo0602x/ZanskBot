export const formatCNPJ = (value: string) => {
  const cnpj = value.replace(/\D/g, ''); // Remove non-numeric characters
  if (cnpj.length <= 14) {
    return cnpj.replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
  return value;
};

export const formatPhone = (value: string) => {
  const phone = value.replace(/\D/g, ''); // Remove non-numeric characters
  if (phone.length <= 10) {
    // Format as (XX) XXXX-XXXX
    return phone.replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  } else {
    // Format as (XX) XXXXX-XXXX
    return phone.replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  }
};
