"use client"

import { useState } from "react"
import { format, addWeeks, addMonths, addQuarters, addYears } from "date-fns"
import { es } from "date-fns/locale"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Trash2, Search, AlertCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Subscription {
  id: string
  name: string
  category: string
  billingCycle: string
  nextBillingDate: string
  amount: number
}

interface SubscriptionListProps {
  subscriptions: Subscription[]
  onDelete: (id: string) => void
}

export function SubscriptionList({ subscriptions, onDelete }: SubscriptionListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredSubscriptions = subscriptions
    .filter(
      (subscription) =>
        subscription.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subscription.category.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime())

  const getNextBillingDate = (subscription: Subscription) => {
    const date = new Date(subscription.nextBillingDate)

    switch (subscription.billingCycle) {
      case "weekly":
        return addWeeks(date, 1)
      case "monthly":
        return addMonths(date, 1)
      case "quarterly":
        return addQuarters(date, 1)
      case "yearly":
        return addYears(date, 1)
      default:
        return date
    }
  }

  const getBillingCycleText = (cycle: string) => {
    switch (cycle) {
      case "weekly":
        return "Semanal"
      case "monthly":
        return "Mensual"
      case "quarterly":
        return "Trimestral"
      case "yearly":
        return "Anual"
      default:
        return cycle
    }
  }

  const isUpcoming = (date: string) => {
    const billingDate = new Date(date)
    const today = new Date()
    const diffTime = billingDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7 && diffDays >= 0
  }

  if (subscriptions.length === 0) {
    return (
      <Card className="border-dashed border-slate-300 bg-slate-50">
        <CardContent className="py-8 text-center">
          <p className="text-slate-500">No hay suscripciones registradas.</p>
          <p className="text-slate-400 text-sm mt-1">Añade tu primera suscripción usando el botón de arriba.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Buscar por nombre o categoría..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 bg-white"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Ciclo</TableHead>
                <TableHead>Próximo cobro</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscriptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-500 py-6">
                    No se encontraron resultados para "{searchTerm}"
                  </TableCell>
                </TableRow>
              ) : (
                filteredSubscriptions.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell className="font-medium">{subscription.name}</TableCell>
                    <TableCell>
                      {subscription.category ? (
                        <Badge variant="outline" className="font-normal">
                          {subscription.category}
                        </Badge>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>{getBillingCycleText(subscription.billingCycle)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-slate-400" />
                        <span>{format(new Date(subscription.nextBillingDate), "dd MMM yyyy", { locale: es })}</span>
                        {isUpcoming(subscription.nextBillingDate) && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AlertCircle className="h-4 w-4 ml-1 text-amber-500" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Próximo cobro en menos de 7 días</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">{subscription.amount.toFixed(2)}€</TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Trash2 className="h-4 w-4 text-slate-400 hover:text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar suscripción?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. La suscripción será eliminada permanentemente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(subscription.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
