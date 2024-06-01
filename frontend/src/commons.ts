import axios from "axios";

export const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

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


export   const formatMimeType = (mimeType: string) => {
  const parts = mimeType.split('/');
  return parts.length > 1 ? parts[1].toUpperCase() : mimeType.toUpperCase();
};

export const formatFileSize = (size: number) => {
  if (size < 1024) {
    return `${size} bytes`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  } else {
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }
};
