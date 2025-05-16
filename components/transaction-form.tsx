"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react"

interface Transaction {
  id: string
  amount: number
  description: string
  type: "income" | "expense"
  category: string
  date: string
}

interface TransactionFormProps {
  onSubmit: (transaction: Transaction) => void
  onCancel: () => void
}

export function TransactionForm({ onSubmit, onCancel }: TransactionFormProps) {
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<"income" | "expense">("expense")
  const [category, setCategory] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert("Por favor, introduce una cantidad válida")
      return
    }

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      amount: Number(amount),
      description,
      type,
      category,
      date: new Date().toISOString(),
    }

    onSubmit(newTransaction)

    // Resetear formulario
    setAmount("")
    setDescription("")
    setType("expense")
    setCategory("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="type">Tipo de transacción</Label>
        <RadioGroup
          value={type}
          onValueChange={(value) => setType(value as "income" | "expense")}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="income" id="income" />
            <Label htmlFor="income" className="flex items-center cursor-pointer">
              <ArrowUpCircle className="h-4 w-4 mr-1 text-green-600" />
              Ingreso
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="expense" id="expense" />
            <Label htmlFor="expense" className="flex items-center cursor-pointer">
              <ArrowDownCircle className="h-4 w-4 mr-1 text-red-600" />
              Gasto
            </Label>
          </div>
        </RadioGroup>
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
            placeholder="Ej: Comida, Transporte..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-white"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          placeholder="Añade detalles sobre esta transacción"
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
