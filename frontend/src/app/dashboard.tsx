"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

export default function Dashboard() {
  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Overview</h1>
        <button className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-md font-medium">Export</button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="font-medium">Total Employee</h2>
          <p className="text-3xl font-bold">218</p>
          <p className="text-sm text-accent">+6% vs last month</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="font-medium">New Employee</h2>
          <p className="text-3xl font-bold">48</p>
          <p className="text-sm text-accent">+6% vs last month</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="font-medium">Resigned Employee</h2>
          <p className="text-3xl font-bold">16</p>
          <p className="text-sm text-accent">+2% vs last month</p>
        </div>
      </div>

      {/* KPI Performance */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="font-medium">KPI Performance</h2>
        <BarChart
          width={500}
          height={300}
          data={[
            { name: 'Jan', performance: 2400 },
            { name: 'Feb', performance: 1398 },
            { name: 'Mar', performance: 9800 },
            { name: 'Apr', performance: 3908 },
            { name: 'May', performance: 4800 },
            { name: 'Jun', performance: 3800 },
            { name: 'Jul', performance: 4300 },
          ]}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="performance" fill="#8884d8" />
        </BarChart>
        <p className="text-sm text-accent">91.72% +24% vs last month</p>
      </div>

      {/* Total Time Worked */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="font-medium">Total Time Worked</h2>
        <p className="text-3xl font-bold">12hr 32min</p>
        <p className="text-sm text-accent">+12% vs last month</p>
      </div>

      {/* Employment Status */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="font-medium">Employment Status</h2>
        <div className="flex justify-between">
          <Badge className="bg-green-500">324 Permanent</Badge>
          <Badge className="bg-yellow-500">121 Contract</Badge>
          <Badge className="bg-red-500">72 Probation</Badge>
        </div>
      </div>

      {/* Profile */}
      <div className="bg-white shadow rounded-lg p-4 space-x-4 flex items-center">
        <Avatar className="">
          <AvatarImage src="https://i.pravatar.cc/40" alt="Profile Picture" />
          <AvatarFallback>AT</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">Adam Taylor</p>
          <p className="text-sm text-accent">ataylor@mail.com</p>
        </div>
      </div>
    </div>
  );
}
