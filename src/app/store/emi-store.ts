import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface EMIPlan {
  id: string
  months: number
  name: string
  interestRate: number
  enabled: boolean
  bankId?: string | null
}

export interface EMIConfig {
  minAmount: number
  maxAmount: number
  plans: EMIPlan[]
  eligibleCategories: string[]
}

interface EMIStore {
  config: EMIConfig
  updateConfig: (config: Partial<EMIConfig>) => void
  addPlan: (plan: EMIPlan) => void
  removePlan: (planId: string) => void
  updatePlan: (planId: string, updates: Partial<EMIPlan>) => void
}

const defaultConfig: EMIConfig = {
  minAmount: 10000,
  maxAmount: 1000000,
  plans: [
    { id: "1", months: 3, name: "3 Months", interestRate: 0, enabled: true },
    { id: "2", months: 6, name: "6 Months", interestRate: 2, enabled: true },
    { id: "3", months: 12, name: "12 Months", interestRate: 4, enabled: true },
  ],
  eligibleCategories: ["smartphones", "laptops", "tablets", "audio", "wearables"],
}

export const useEMIStore = create<EMIStore>()(
  persist(
    (set) => ({
      config: defaultConfig,

      updateConfig: (updates) => {
        set((state) => ({
          config: { ...state.config, ...updates },
        }))
      },

      addPlan: (plan) => {
        set((state) => ({
          config: {
            ...state.config,
            plans: [...state.config.plans, plan],
          },
        }))
      },

      removePlan: (planId) => {
        set((state) => ({
          config: {
            ...state.config,
            plans: state.config.plans.filter((p) => p.id !== planId),
          },
        }))
      },

      updatePlan: (planId, updates) => {
        set((state) => ({
          config: {
            ...state.config,
            plans: state.config.plans.map((p) => (p.id === planId ? { ...p, ...updates } : p)),
          },
        }))
      },
    }),
    {
      name: "emi-storage",
    },
  ),
)
