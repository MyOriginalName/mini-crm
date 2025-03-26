import React from 'react';
import PropTypes from 'prop-types';
import { CLIENT_STATUS_LABELS, CLIENT_TYPE_LABELS, CLIENT_TYPE, CLIENT_STATUS } from '@/constants/clientConstants';
import { useForm } from '@inertiajs/react';
import FormModal from '@/Components/Forms/FormModal';
import FormField from '@/Components/Forms/FormField';

export default function CreateClientModal({
  isOpen,
  onOpenChange,
  onSubmit,
  client,
  onClientChange,
  mode = 'create'
}) {
  const {
    data,
    setData,
    errors,
    processing,
    reset,
  } = useForm(client);

  React.useEffect(() => {
    reset(client);
  }, [client, reset]);

  const handleChange = (field, value) => {
    setData(field, value);
    onClientChange?.({
      ...data,
      [field]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(data);
  };

  const isCompany = data.type === CLIENT_TYPE.company;

  const typeOptions = Object.entries(CLIENT_TYPE_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  const statusOptions = Object.entries(CLIENT_STATUS_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <FormModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={mode === 'create' ? 'Создать клиента' : 'Редактировать клиента'}
      onSubmit={handleSubmit}
      isSubmitting={processing}
      submitLabel={mode === 'create' ? 'Создать' : 'Сохранить'}
    >
      <FormField
        type="select"
        label="Тип клиента"
        name="type"
        value={data.type}
        onChange={handleChange}
        error={errors.type}
        required
        options={typeOptions}
      />

      <FormField
        label={isCompany ? 'Контактное лицо' : 'ФИО'}
        name="name"
        value={data.name}
        onChange={handleChange}
        error={errors.name}
        required
        placeholder={isCompany ? 'Введите имя контактного лица' : 'Введите ФИО'}
      />

      {isCompany && (
        <>
          <FormField
            label="Название компании"
            name="company_name"
            value={data.company_name}
            onChange={handleChange}
            error={errors.company_name}
            required
            placeholder="Введите название компании"
          />

          <FormField
            label="ИНН"
            name="inn"
            value={data.inn}
            onChange={handleChange}
            error={errors.inn}
            required
            placeholder="Введите ИНН"
          />

          <FormField
            label="КПП"
            name="kpp"
            value={data.kpp}
            onChange={handleChange}
            error={errors.kpp}
            placeholder="Введите КПП"
          />
        </>
      )}

      <FormField
        type="email"
        label="Email"
        name="email"
        value={data.email}
        onChange={handleChange}
        error={errors.email}
        required
        placeholder="Введите email"
      />

      <FormField
        type="tel"
        label="Телефон"
        name="phone"
        value={data.phone}
        onChange={handleChange}
        error={errors.phone}
        required
        placeholder="Введите телефон"
      />

      <FormField
        label="Адрес"
        name="address"
        value={data.address}
        onChange={handleChange}
        error={errors.address}
        placeholder="Введите адрес"
      />

      <FormField
        type="textarea"
        label="Описание"
        name="description"
        value={data.description}
        onChange={handleChange}
        error={errors.description}
        placeholder="Введите описание"
      />

      {mode === 'edit' && (
        <FormField
          type="select"
          label="Статус"
          name="status"
          value={data.status}
          onChange={handleChange}
          error={errors.status}
          required
          options={statusOptions}
        />
      )}
    </FormModal>
  );
}

CreateClientModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClientChange: PropTypes.func,
  client: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    type: PropTypes.oneOf(Object.values(CLIENT_TYPE)).isRequired,
    status: PropTypes.oneOf(Object.values(CLIENT_STATUS)).isRequired,
    company_name: PropTypes.string,
    inn: PropTypes.string,
    kpp: PropTypes.string,
    address: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  mode: PropTypes.oneOf(['create', 'edit']),
};

CreateClientModal.defaultProps = {
  mode: 'create',
}; 