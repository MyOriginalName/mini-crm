import { useState, useEffect } from "react";
import Draggable from "react-draggable";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AnalyticsWidget from '@/components/AnalyticsWidget';

export default function Dashboard() {
  console.log("Dashboard загружается");

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-red-500">Инвестиционная CRM</h1>
      <DraggableWidget type="analytics" />
      <DraggableWidget type="news" />
    </div>
  );
}

function DraggableWidget({ type }) {
  return (
    <Draggable handle=".drag-handle" grid={[3, 3]} >
      <div className="relative w-fit cursor-default">
        {/* Черная линия, которая теперь будет handle (область перетаскивания) */}
        <div className="drag-handle w-full h-2 bg-black cursor-grab border border-gray-800"></div>

        {/* Контент виджета */}
        <Widget type={type} />
      </div>
    </Draggable>
  );
}

function Widget({ type }) {
  if (type === "analytics") {
    return <AnalyticsWidget />;
  }
  if (type === "news") {
    return <NewsWidget />;
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
