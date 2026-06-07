import { Head, useForm, Link } from "@inertiajs/react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Create({ auth }) {
  const { data, setData, post, processing, errors } = useForm({
    name: "",
    email: "",
    phone: "",
    company: "",
    type: "individual",
    status: "active",
    company_name: "",
    inn: "",
    kpp: "",
    address: "",
    notes: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('clients.store'), {
      onSuccess: () => {
        window.location.href = route('clients.index');
      }
    });
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Создание клиента" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Создание клиента</h2>
                <Link href={route('clients.index')}>
                  <Button variant="outline">Назад к списку</Button>
                </Link>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Имя</Label>
                  <Input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={e => setData('email', e.target.value)}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    type="text"
                    value={data.phone}
                    onChange={e => setData('phone', e.target.value)}
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <Label htmlFor="company">Компания</Label>
                  <Input
                    id="company"
                    type="text"
                    value={data.company}
                    onChange={e => setData('company', e.target.value)}
                    className={errors.company ? "border-red-500" : ""}
                  />
                  {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
                </div>

                <div>
                  <Label htmlFor="type">Тип</Label>
                  <Select
                    id="type"
                    value={data.type}
                    onChange={e => setData('type', e.target.value)}
                    className={errors.type ? "border-red-500" : ""}
                  >
                    <option value="individual">Физическое лицо</option>
                    <option value="company">Юридическое лицо</option>
                  </Select>
                  {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
                </div>

                <div>
                  <Label htmlFor="status">Статус</Label>
                  <Select
                    id="status"
                    value={data.status}
                    onChange={e => setData('status', e.target.value)}
                    className={errors.status ? "border-red-500" : ""}
                  >
                    <option value="active">Активен</option>
                    <option value="inactive">Неактивен</option>
                    <option value="blocked">Заблокирован</option>
                  </Select>
                  {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                </div>

                <div>
                  <Label htmlFor="address">Адрес</Label>
                  <Input
                    id="address"
                    type="text"
                    value={data.address}
                    onChange={e => setData('address', e.target.value)}
                    className={errors.address ? "border-red-500" : ""}
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                <div>
                  <Label htmlFor="notes">Заметки</Label>
                  <Textarea
                    id="notes"
                    value={data.notes}
                    onChange={e => setData('notes', e.target.value)}
                    className={errors.notes ? "border-red-500" : ""}
                    rows={4}
                  />
                  {errors.notes && <p className="text-red-500 text-sm mt-1">{errors.notes}</p>}
                </div>

                <div className="flex justify-end pt-4 mt-6 border-t">
                  <Button type="submit" disabled={processing}>
                    {processing ? "Создание..." : "Создать клиента"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
