"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface Transaction {
  id: string
  date: string
  amount: number
  type: "income" | "expense"
  category?: string
}

interface Subscription {
  id: string
  name: string
  amount: number
  category?: string
}

interface OverviewProps {
  transactions: Transaction[]
  subscriptions: Subscription[]
}

export function Overview({ transactions, subscriptions }: OverviewProps) {
  const [period, setPeriod] = useState("month")
  const chartRef = useRef<HTMLCanvasElement>(null)
  const pieRef = useRef<HTMLCanvasElement>(null)

  // Filtrar transacciones por período
  const filterByPeriod = (items: any[], dateField = "date") => {
    const now = new Date()
    const startDate = new Date()

    if (period === "week") {
      startDate.setDate(now.getDate() - 7)
    } else if (period === "month") {
      startDate.setMonth(now.getMonth() - 1)
    } else if (period === "year") {
      startDate.setFullYear(now.getFullYear() - 1)
    }

    return items.filter((item) => new Date(item[dateField]) >= startDate)
  }

  const filteredTransactions = filterByPeriod(transactions)

  // Calcular totales
  const totalIncome = filteredTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = filteredTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const totalSubscriptions = subscriptions.reduce((sum, s) => sum + s.amount, 0)

  // Agrupar gastos por categoría
  const expensesByCategory = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce(
      (acc, t) => {
        const category = t.category || "Sin categoría"
        acc[category] = (acc[category] || 0) + t.amount
        return acc
      },
      {} as Record<string, number>,
    )

  // Añadir suscripciones a las categorías
  subscriptions.forEach((s) => {
    const category = s.category || "Suscripciones"
    expensesByCategory[category] = (expensesByCategory[category] || 0) + s.amount
  })

  // Colores para el gráfico
  const colors = [
    "#f472b6", // pink-400
    "#a78bfa", // violet-400
    "#60a5fa", // blue-400
    "#4ade80", // green-400
    "#facc15", // yellow-400
    "#fb923c", // orange-400
    "#f87171", // red-400
    "#c084fc", // purple-400
    "#2dd4bf", // teal-400
    "#94a3b8", // slate-400
  ]

  // Renderizar gráficos cuando cambian los datos
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("chart.js").then(({ Chart, registerables }) => {
        Chart.register(...registerables)

        // Gráfico de barras para ingresos vs gastos
        if (chartRef.current) {
          const chartInstance = Chart.getChart(chartRef.current)
          if (chartInstance) {
            chartInstance.destroy()
          }

          new Chart(chartRef.current, {
            type: "bar",
            data: {
              labels: ["Ingresos", "Gastos"],
              datasets: [
                {
                  data: [totalIncome, totalExpense + totalSubscriptions],
                  backgroundColor: ["#4ade80", "#f87171"],
                  borderColor: ["#22c55e", "#ef4444"],
                  borderWidth: 1,
                },
              ],
            },
            options: {
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  callbacks: {
                    label: (context) => `${context.formattedValue}€`,
                  },
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: (value) => value + "€",
                  },
                },
              },
            },
          })
        }

        // Gráfico de pastel para categorías de gastos
        if (pieRef.current) {
          const pieInstance = Chart.getChart(pieRef.current)
          if (pieInstance) {
            pieInstance.destroy()
          }

          const categories = Object.keys(expensesByCategory)
          const values = Object.values(expensesByCategory)

          if (categories.length > 0) {
            new Chart(pieRef.current, {
              type: "doughnut",
              data: {
                labels: categories,
                datasets: [
                  {
                    data: values,
                    backgroundColor: categories.map((_, i) => colors[i % colors.length]),
                    borderWidth: 1,
                  },
                ],
              },
              options: {
                responsive: true,
                plugins: {
                  legend: {
                    position: "right",
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const value = context.raw as number
                        const total = values.reduce((a, b) => a + b, 0)
                        const percentage = Math.round((value / total) * 100)
                        return `${context.label}: ${value.toFixed(2)}€ (${percentage}%)`
                      },
                    },
                  },
                },
              },
            })
          }
        }
      })
    }
  }, [filteredTransactions, subscriptions, period, totalIncome, totalExpense, totalSubscriptions, expensesByCategory])

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <div className="w-48">
          <Label htmlFor="period" className="mb-1 block">
            Período
          </Label>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger id="period" className="bg-white">
              <SelectValue placeholder="Selecciona un período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Última semana</SelectItem>
              <SelectItem value="month">Último mes</SelectItem>
              <SelectItem value="year">Último año</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="balance" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-blue-100">
          <TabsTrigger value="balance" className="data-[state=active]:bg-blue-200">
            Balance
          </TabsTrigger>
          <TabsTrigger value="categories" className="data-[state=active]:bg-blue-200">
            Categorías
          </TabsTrigger>
        </TabsList>

        <TabsContent value="balance" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="h-80">
                <canvas ref={chartRef}></canvas>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <div className="text-sm text-green-700 font-medium">Ingresos totales</div>
                  <div className="text-2xl font-bold text-green-700 mt-1">{totalIncome.toFixed(2)}€</div>
                </div>

                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                  <div className="text-sm text-red-700 font-medium">Gastos totales</div>
                  <div className="text-2xl font-bold text-red-700 mt-1">
                    {(totalExpense + totalSubscriptions).toFixed(2)}€
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {Object.keys(expensesByCategory).length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  No hay datos suficientes para mostrar las categorías.
                </div>
              ) : (
                <div className="h-80">
                  <canvas ref={pieRef}></canvas>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
