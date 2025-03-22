import React from 'react';
import PropTypes from 'prop-types';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Select } from '@/Components/ui/select';
import { Textarea } from '@/Components/ui/textarea';

export default function FormField({
  type = 'text',
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  options = [],
  placeholder,
  className = '',
  rows = 3,
  ...props
}) {
  const renderField = () => {
    switch (type) {
      case 'select':
        return (
          <Select
            id={name}
            name={name}
            value={value}
            onChange={(e) => onChange(name, e.target.value)}
            required={required}
            className="h-9"
            {...props}
          >
            {options.map(({ value: optionValue, label: optionLabel }) => (
              <option key={optionValue} value={optionValue}>
                {optionLabel}
              </option>
            ))}
          </Select>
        );
      case 'textarea':
        return (
          <Textarea
            id={name}
            name={name}
            value={value}
            onChange={(e) => onChange(name, e.target.value)}
            placeholder={placeholder}
            required={required}
            rows={rows}
            {...props}
          />
        );
      default:
        return (
          <Input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={(e) => onChange(name, e.target.value)}
            placeholder={placeholder}
            required={required}
            className="h-9"
            {...props}
          />
        );
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={name}>{label}</Label>
      {renderField()}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

FormField.propTypes = {
  type: PropTypes.oneOf(['text', 'email', 'tel', 'select', 'textarea']),
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  required: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  placeholder: PropTypes.string,
  className: PropTypes.string,
  rows: PropTypes.number,
}; 