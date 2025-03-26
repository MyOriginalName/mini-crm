import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { CLIENT_TYPES, CLIENT_STATUSES } from "@/lib/constants";

export default function EditClientModal({
  isOpen,
  onOpenChange,
  onSubmit,
  client,
  onClientChange,
}) {
  if (!client) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onSubmit({
      name: formData.get('name'),
      type: formData.get('type'),
      status: formData.get('status'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      company: formData.get('company'),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Редактировать клиента</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Имя</Label>
              <Input
                id="name"
                name="name"
                value={client.name}
                onChange={(e) => onClientChange({ ...client, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="type">Тип</Label>
              <Select
                id="type"
                name="type"
                value={client.type}
                onValueChange={(value) => onClientChange({ ...client, type: value })}
                required
              >
                {Object.entries(CLIENT_TYPES).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Статус</Label>
              <Select
                id="status"
                name="status"
                value={client.status}
                onValueChange={(value) => onClientChange({ ...client, status: value })}
                required
              >
                {Object.entries(CLIENT_STATUSES).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={client.email}
                onChange={(e) => onClientChange({ ...client, email: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={client.phone}
                onChange={(e) => onClientChange({ ...client, phone: e.target.value })}
                required
              />
            </div>

            {client.type === 'company' && (
              <>
                <div>
                  <Label htmlFor="company">Компания</Label>
                  <Input
                    id="company"
                    name="company"
                    value={client.company}
                    onChange={(e) => onClientChange({ ...client, company: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="company_name">Название компании</Label>
                  <Input
                    id="company_name"
                    value={client.company_name}
                    onChange={(e) => onClientChange({ ...client, company_name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="inn">ИНН</Label>
                  <Input
                    id="inn"
                    value={client.inn}
                    onChange={(e) => onClientChange({ ...client, inn: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="kpp">КПП</Label>
                  <Input
                    id="kpp"
                    value={client.kpp}
                    onChange={(e) => onClientChange({ ...client, kpp: e.target.value })}
                  />
                </div>
              </>
            )}
          </div>

          <div>
            <Label htmlFor="address">Адрес</Label>
            <Input
              id="address"
              value={client.address}
              onChange={(e) => onClientChange({ ...client, address: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="description">Описание</Label>
            <Input
              id="description"
              value={client.description}
              onChange={(e) => onClientChange({ ...client, description: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Отмена
            </Button>
            <Button type="submit">
              Сохранить
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 