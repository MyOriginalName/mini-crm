import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function AnalyticsWidget() {
  const data = [
    { name: "День 1", price: 100 },
    { name: "День 2", price: 105 },
    { name: "День 3", price: 102 },
  ];

  return (
    <Card>
      <CardContent>
        <h2 className="text-xl font-bold mb-2">Аналитика</h2>
        <LineChart width={300} height={200} data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <CartesianGrid stroke="#ccc" />
          <Line type="monotone" dataKey="price" stroke="#8884d8" />
        </LineChart>
      </CardContent>
    </Card>
  );
}

export default AnalyticsWidget;
