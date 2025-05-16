"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Subscription {
  id: string
  name: string
  amount: number
  description: string
  category: string
  billingCycle: string
  nextBillingDate: string
  createdAt: string
}

interface SubscriptionFormProps {
  onSubmit: (subscription: Subscription) => void
  onCancel: () => void
}

export function SubscriptionForm({ onSubmit, onCancel }: SubscriptionFormProps) {
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [billingCycle, setBillingCycle] = useState("monthly")
  const [nextBillingDate, setNextBillingDate] = useState<Date | undefined>(new Date())

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert("Por favor, introduce una cantidad válida")
      return
    }

    if (!name) {
      alert("Por favor, introduce un nombre para la suscripción")
      return
    }

    const newSubscription: Subscription = {
      id: Date.now().toString(),
      name,
      amount: Number(amount),
      description,
      category,
      billingCycle,
      nextBillingDate: nextBillingDate?.toISOString() || new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }

    onSubmit(newSubscription)

    // Resetear formulario
    setName("")
    setAmount("")
    setDescription("")
    setCategory("")
    setBillingCycle("monthly")
    setNextBillingDate(new Date())
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre de la suscripción</Label>
        <Input
          id="name"
          placeholder="Ej: Netflix, Gimnasio..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="bg-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Cantidad (€)</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="bg-white"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Categoría</Label>
          <Input
            id="category"
            placeholder="Ej: Entretenimiento, Servicios..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="billingCycle">Ciclo de facturación</Label>
          <Select value={billingCycle} onValueChange={setBillingCycle}>
            <SelectTrigger id="billingCycle" className="bg-white">
              <SelectValue placeholder="Selecciona un ciclo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Semanal</SelectItem>
              <SelectItem value="monthly">Mensual</SelectItem>
              <SelectItem value="quarterly">Trimestral</SelectItem>
              <SelectItem value="yearly">Anual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Próximo cobro</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal bg-white">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {nextBillingDate ? format(nextBillingDate, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={nextBillingDate} onSelect={setNextBillingDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          placeholder="Añade detalles sobre esta suscripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-white"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-pink-500 hover:bg-pink-600">
          Guardar
        </Button>
      </div>
    </form>
  )
}
