import { useState, useEffect } from "react";
import Draggable from "react-draggable";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AnalyticsWidget from '@/components/AnalyticsWidget';
import ClientsWidget from '@/Components/ClientsWidget';
import CreateClientWidget from '@/Components/CreateClientWidget';
import { ClientsWidgetProvider } from '@/Components/ClientsWidgetContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
  console.log("Dashboard загружается");
  
  // Legacy function kept for backward compatibility
  const handleClientCreated = () => {
    // This is no longer needed as we're using context now
  };

  return (
    <AuthenticatedLayout
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
    >
      <Head title="Dashboard" />
      
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <h1 className="text-2xl font-bold mb-4 text-red-500">Какая-то CRM</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <DraggableWidget type="analytics" />
                <DraggableWidget type="news" />
                <ClientsWidgetProvider>
                  <DraggableWidget type="clients" />
                  <DraggableWidget type="createClient" onClientCreated={handleClientCreated} />
                </ClientsWidgetProvider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

function DraggableWidget({ type, onClientCreated }) {
  return (
    <Draggable handle=".drag-handle" grid={[3, 3]} >
      <div className="relative w-full cursor-default">
        {/* Черная линия, которая теперь будет handle (область перетаскивания) */}
        <div className="drag-handle w-full h-2 bg-black cursor-grab border border-gray-800"></div>

        {/* Контент виджета */}
        <Widget type={type} onClientCreated={onClientCreated} />
      </div>
    </Draggable>
  );
}

function Widget({ type, onClientCreated }) {
  if (type === "analytics") {
    return <AnalyticsWidget />;
  }
  if (type === "news") {
    return <NewsWidget />;
  }
  if (type === "clients") {
    return <ClientsWidget />;
  }
  if (type === "createClient") {
    return <CreateClientWidget onClientCreated={onClientCreated} />;
  }
  return null;
}

function NewsWidget() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    setNews([
      { title: "Новость 1" },
      { title: "Новость 2" },
      { title: "Новость 3" },
    ]);
  }, []);

  return (
    <Card>
      <CardContent>
        <h2 className="text-xl font-bold mb-2">Новости</h2>
        <ul>
          {news.map((item, index) => (
            <li key={index} className="mb-1">{item.title}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
