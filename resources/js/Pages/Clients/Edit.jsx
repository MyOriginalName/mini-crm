import { useState } from "react";
import { Head, useForm, Link, router } from "@inertiajs/react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Edit({ auth, client }) {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { data, setData, patch, processing, errors } = useForm({
    name: client.name,
    email: client.email,
    phone: client.phone || "",
    company: client.company || "",
    notes: client.notes || ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    patch(route('clients.update', client.id), {
      onSuccess: () => {
        router.visit(route('clients.index'));
      }
    });
  };

  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить этого клиента? Это действие нельзя отменить.')) {
      setIsDeleting(true);
      router.delete(route('clients.destroy', client.id), {
        onSuccess: () => {
          router.visit(route('clients.index'));
        },
        onError: () => {
          setIsDeleting(false);
          alert('Ошибка при удалении клиента');
        },
        onFinish: () => {
          setIsDeleting(false);
        }
      });
    }
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Редактирование клиента" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Редактирование клиента</h2>
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

                <div className="flex justify-between items-center pt-4 mt-6 border-t">
                  <Button 
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {isDeleting ? "Удаление..." : "Удалить клиента"}
                  </Button>
                  
                  <Button 
                    type="submit" 
                    disabled={processing}
                  >
                    {processing ? "Сохранение..." : "Сохранить изменения"}
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