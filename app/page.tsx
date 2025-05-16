"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Wallet, CreditCard, PieChart, ArrowUpCircle, ArrowDownCircle } from "lucide-react"
import { TransactionForm } from "@/components/transaction-form"
import { SubscriptionForm } from "@/components/subscription-form"
import { TransactionList } from "@/components/transaction-list"
import { SubscriptionList } from "@/components/subscription-list"
import { Overview } from "@/components/overview"
import { useToast } from "@/hooks/use-toast"
import type { Transaction } from "@/types/transaction"
import type { Subscription } from "@/types/subscription"

export default function Home() {
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [showTransactionForm, setShowTransactionForm] = useState(false)
  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false)

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    setMounted(true)
    const savedTransactions = localStorage.getItem("transactions")
    const savedSubscriptions = localStorage.getItem("subscriptions")

    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions))
    }

    if (savedSubscriptions) {
      setSubscriptions(JSON.parse(savedSubscriptions))
    }
  }, [])

  // Guardar datos en localStorage cuando cambian
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("transactions", JSON.stringify(transactions))
      localStorage.setItem("subscriptions", JSON.stringify(subscriptions))
    }
  }, [transactions, subscriptions, mounted])

  const addTransaction = (transaction: Transaction) => {
    setTransactions([...transactions, transaction])
    setShowTransactionForm(false)
    toast({
      title: "Transacción añadida",
      description: `${transaction.type === "income" ? "Ingreso" : "Gasto"} de ${transaction.amount}€ registrado.`,
    })
  }

  const addSubscription = (subscription: Subscription) => {
    setSubscriptions([...subscriptions, subscription])
    setShowSubscriptionForm(false)
    toast({
      title: "Suscripción añadida",
      description: `Suscripción de ${subscription.amount}€ registrada.`,
    })
  }

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id))
    toast({
      title: "Transacción eliminada",
      description: "La transacción ha sido eliminada correctamente.",
    })
  }

  const deleteSubscription = (id: string) => {
    setSubscriptions(subscriptions.filter((s) => s.id !== id))
    toast({
      title: "Suscripción eliminada",
      description: "La suscripción ha sido eliminada correctamente.",
    })
  }

  // Calcular balance total
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const totalSubscriptions = subscriptions.reduce((sum, s) => sum + s.amount, 0)

  const balance = totalIncome - totalExpense - totalSubscriptions

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-pink-50 to-blue-50">
      <div className="container mx-auto px-4 py-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-pink-600">FinanceTracker</h1>
          <p className="text-slate-600">Gestiona tus finanzas personales</p>
        </header>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="bg-green-50 border-green-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700">
                <ArrowUpCircle className="h-4 w-4 inline mr-1" />
                Ingresos Totales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">{totalIncome.toFixed(2)}€</div>
            </CardContent>
          </Card>

          <Card className="bg-red-50 border-red-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-700">
                <ArrowDownCircle className="h-4 w-4 inline mr-1" />
                Gastos Totales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-700">{(totalExpense + totalSubscriptions).toFixed(2)}€</div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">
                <Wallet className="h-4 w-4 inline mr-1" />
                Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${balance >= 0 ? "text-blue-700" : "text-red-700"}`}>
                {balance.toFixed(2)}€
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-pink-100">
            <TabsTrigger value="transactions" className="data-[state=active]:bg-pink-200">
              <Wallet className="h-4 w-4 mr-2" />
              Transacciones
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="data-[state=active]:bg-pink-200">
              <CreditCard className="h-4 w-4 mr-2" />
              Suscripciones
            </TabsTrigger>
            <TabsTrigger value="overview" className="data-[state=active]:bg-pink-200">
              <PieChart className="h-4 w-4 mr-2" />
              Resumen
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-700">Ingresos y Gastos</h2>
              <Button
                onClick={() => setShowTransactionForm(!showTransactionForm)}
                className="bg-pink-500 hover:bg-pink-600"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                {showTransactionForm ? "Cancelar" : "Añadir"}
              </Button>
            </div>

            {showTransactionForm && (
              <Card className="mb-6 border-pink-200 bg-pink-50">
                <CardContent className="pt-6">
                  <TransactionForm onSubmit={addTransaction} onCancel={() => setShowTransactionForm(false)} />
                </CardContent>
              </Card>
            )}

            <TransactionList transactions={transactions} onDelete={deleteTransaction} />
          </TabsContent>

          <TabsContent value="subscriptions" className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-700">Suscripciones y Gastos Fijos</h2>
              <Button
                onClick={() => setShowSubscriptionForm(!showSubscriptionForm)}
                className="bg-pink-500 hover:bg-pink-600"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                {showSubscriptionForm ? "Cancelar" : "Añadir"}
              </Button>
            </div>

            {showSubscriptionForm && (
              <Card className="mb-6 border-pink-200 bg-pink-50">
                <CardContent className="pt-6">
                  <SubscriptionForm onSubmit={addSubscription} onCancel={() => setShowSubscriptionForm(false)} />
                </CardContent>
              </Card>
            )}

            <SubscriptionList subscriptions={subscriptions} onDelete={deleteSubscription} />
          </TabsContent>

          <TabsContent value="overview" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumen Financiero</CardTitle>
                <CardDescription>Visualización de tus ingresos y gastos</CardDescription>
              </CardHeader>
              <CardContent>
                <Overview transactions={transactions} subscriptions={subscriptions} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
