export const CLIENT_STATUS = {
  active: 'active',
  inactive: 'inactive',
  blocked: 'blocked',
};

export const CLIENT_STATUS_LABELS = {
  active: 'Активный',
  inactive: 'Неактивный',
  blocked: 'Заблокирован',
};

export const CLIENT_STATUS_COLORS = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  blocked: 'bg-red-100 text-red-800',
};

export const CLIENT_TYPE = {
  individual: 'individual',
  company: 'company',
};

export const CLIENT_TYPE_LABELS = {
  individual: 'Физическое лицо',
  company: 'Юридическое лицо',
};

export const INITIAL_CLIENT_STATE = {
  name: '',
  email: '',
  phone: '',
  type: CLIENT_TYPE.individual,
  status: CLIENT_STATUS.active,
  company_name: '',
  inn: '',
  kpp: '',
  address: '',
  description: '',
}; 