interface Transaction {
  id: string
  amount: number
  description: string
  type: "income" | "expense"
  category: string
  date: string
}

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
