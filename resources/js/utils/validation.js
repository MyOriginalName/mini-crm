export const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^\+?[0-9]{10,15}$/;
  return re.test(phone.replace(/[^0-9+]/g, ''));
};

export const validateINN = (inn) => {
  const re = /^[0-9]{10}$|^[0-9]{12}$/;
  return re.test(inn);
};

export const validateKPP = (kpp) => {
  const re = /^[0-9]{9}$/;
  return re.test(kpp);
};

export const getFieldError = (field, value, isCompany = false) => {
  if (!value && field.required) {
    return 'Это поле обязательно для заполнения';
  }

  switch (field.name) {
    case 'email':
      if (value && !validateEmail(value)) {
        return 'Некорректный email адрес';
      }
      break;
    case 'phone':
      if (value && !validatePhone(value)) {
        return 'Некорректный номер телефона';
      }
      break;
    case 'inn':
      if (isCompany && value && !validateINN(value)) {
        return 'Некорректный ИНН';
      }
      break;
    case 'kpp':
      if (isCompany && value && !validateKPP(value)) {
        return 'Некорректный КПП';
      }
      break;
    default:
      return null;
  }

  return null;
}; 