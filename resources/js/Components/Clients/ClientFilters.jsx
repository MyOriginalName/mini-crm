import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import { Select } from '@/Components/ui/select';
import { Button } from '@/Components/ui/button';
import { CLIENT_STATUS, CLIENT_STATUS_LABELS, CLIENT_STATUS_COLORS, CLIENT_TYPE, CLIENT_TYPE_LABELS } from '@/constants/clientConstants';

export default function ClientFilters({
  filters,
  onFiltersChange,
  onSearch,
  onClear,
}) {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (field, value) => {
    const newFilters = { ...localFilters, [field]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleStatusClick = (status) => {
    handleChange('status', localFilters.status === status ? null : status);
  };

  const getStatusButtonVariant = (status) => {
    return localFilters.status === status ? 'default' : 'outline';
  };

  const getStatusButtonStyle = (status) => {
    const isSelected = localFilters.status === status;
    const baseColor = {
      [CLIENT_STATUS.active]: '#22c55e',    // зеленый
      [CLIENT_STATUS.inactive]: '#64748b',   // серый
      [CLIENT_STATUS.blocked]: '#ef4444',    // красный
    }[status];

    return {
      backgroundColor: isSelected ? baseColor : 'transparent',
      borderColor: baseColor,
      color: isSelected ? 'white' : baseColor,
      '&:hover': {
        backgroundColor: isSelected ? baseColor : `${baseColor}10`,
      }
    };
  };

  return (
    <Card className="mb-6">
      <CardContent className="py-4 px-6">
        <form onSubmit={onSearch}>
          <div className="flex gap-6">
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="text"
                  placeholder="Поиск по имени, email или телефону"
                  value={localFilters.search}
                  onChange={(e) => handleChange('search', e.target.value)}
                  className="h-9"
                />
                <Select
                  value={localFilters.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className="h-9"
                >
                  <option value="">Все типы</option>
                  {Object.entries(CLIENT_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </Select>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={getStatusButtonVariant(CLIENT_STATUS.active)}
                  onClick={() => handleStatusClick(CLIENT_STATUS.active)}
                  style={getStatusButtonStyle(CLIENT_STATUS.active)}
                  className="flex-1"
                >
                  {CLIENT_STATUS_LABELS[CLIENT_STATUS.active]}
                </Button>
                <Button
                  type="button"
                  variant={getStatusButtonVariant(CLIENT_STATUS.inactive)}
                  onClick={() => handleStatusClick(CLIENT_STATUS.inactive)}
                  style={getStatusButtonStyle(CLIENT_STATUS.inactive)}
                  className="flex-1"
                >
                  {CLIENT_STATUS_LABELS[CLIENT_STATUS.inactive]}
                </Button>
                <Button
                  type="button"
                  variant={getStatusButtonVariant(CLIENT_STATUS.blocked)}
                  onClick={() => handleStatusClick(CLIENT_STATUS.blocked)}
                  style={getStatusButtonStyle(CLIENT_STATUS.blocked)}
                  className="flex-1"
                >
                  {CLIENT_STATUS_LABELS[CLIENT_STATUS.blocked]}
                </Button>
              </div>
            </div>
            <div className="flex flex-col justify-start gap-2">
              <Button type="submit" className="h-9 px-6">Поиск</Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClear}
                className="h-9 px-6"
              >
                Сбросить
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

ClientFilters.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string,
    status: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
  onFiltersChange: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
}; 