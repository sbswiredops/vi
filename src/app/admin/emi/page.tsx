"use client";

import { useState, useEffect } from "react";
import emiService, { EmiBank, EmiPlan, CreateEmiPlanRequest, UpdateEmiPlanRequest } from "../../lib/api/services/emi";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Plus, Trash2, Edit2, Percent } from "lucide-react";
import { formatPrice } from "../../lib/utils/format";

export default function AdminEMIPage() {
  const [banks, setBanks] = useState<EmiBank[]>([]);
  const [plans, setPlans] = useState<EmiPlan[]>([]);
  const [isAddingBank, setIsAddingBank] = useState(false);
  const [newBank, setNewBank] = useState({ bankname: "" });
  const [editingBank, setEditingBank] = useState<EmiBank | null>(null);
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [editingPlan, setEditingPlan] = useState<EmiPlan | null>(null);
  const [newPlan, setNewPlan] = useState<CreateEmiPlanRequest>({
    months: 0,
    planName: "",
    interestRate: 0,
    bankId: "",
  });

  const fetchBanks = async () => {
    const data = await emiService.getBanks();
    setBanks(data);
  };
  const fetchPlans = async () => {
    const data = await emiService.getPlans();
    setPlans(data);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchBanks();
      await fetchPlans();
    };
    fetchData();
  }, []);

  const handleAddBank = async () => {
    if (newBank.bankname.trim()) {
      await emiService.createBank({ bankname: newBank.bankname });
      setNewBank({ bankname: "" });
      setIsAddingBank(false);
      fetchBanks();
    }
  };
  const handleUpdateBank = async () => {
    if (editingBank) {
      await emiService.updateBank(editingBank.id, { bankname: editingBank.bankname });
      setEditingBank(null);
      fetchBanks();
    }
  };
  const handleDeleteBank = async (id: string) => {
    await emiService.deleteBank(id);
    fetchBanks();
  };

  const handleAddPlan = async () => {
    if (newPlan.months && newPlan.planName && newPlan.bankId) {
      await emiService.createPlan(newPlan);
      setNewPlan({ months: 0, planName: "", interestRate: 0, bankId: "" });
      setIsAddingPlan(false);
      fetchPlans();
    }
  };

  const handleUpdatePlan = async () => {
    if (editingPlan) {
      const updateData: UpdateEmiPlanRequest = {
        bankId: editingPlan.bankId,
        months: editingPlan.months,
        planName: editingPlan.planName,
        interestRate: editingPlan.interestRate,
      };
      await emiService.updatePlan(editingPlan.id, updateData);
      setEditingPlan(null);
      fetchPlans();
    }
  };

  const togglePlanStatus = async (planId: string) => {
    const plan = plans.find((p) => p.id === planId);
    if (plan) {
      await emiService.updatePlan(planId, {
        planName: plan.planName,
        bankId: plan.bankId,
        months: plan.months,
        interestRate: plan.interestRate,
      });
      fetchPlans();
    }
  };

  const handleDeletePlan = async (id: string) => {
    await emiService.deletePlan(id);
    fetchPlans();
  };

  return (
    <div className="space-y-6">
      {/* Bank Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Banks
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            {banks.map((bank) => (
              <div key={bank.id} className="flex items-center gap-2 border rounded px-3 py-1">
                <span className="font-medium">{bank.bankname}</span>
                <Button size="sm" variant="fjhfhs" onClick={() => setEditingBank(bank)}>Edit</Button>
                <Button size="sm" variant="outline" className="text-destructive" onClick={() => handleDeleteBank(bank.id)}>
                  Delete
                </Button>
              </div>
            ))}
            <Button size="sm" onClick={() => setIsAddingBank(true)}>
              Add Bank
            </Button>
          </div>
          {isAddingBank && (
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Bank Name"
                value={newBank.bankname}
                onChange={(e) => setNewBank({ ...newBank, bankname: e.target.value })}
              />
              <Button size="sm" onClick={handleAddBank}>Save</Button>
              <Button size="sm" variant="outline" onClick={() => setIsAddingBank(false)}>Cancel</Button>
            </div>
          )}
          {editingBank && (
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Bank Name"
                value={editingBank.bankname}
                onChange={(e) => setEditingBank({ ...editingBank, bankname: e.target.value })}
              />
              <Button size="sm" onClick={handleUpdateBank}>Update</Button>
              <Button size="sm" variant="outline" onClick={() => setEditingBank(null)}>Cancel</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">EMI Management</h1>
        <p className="text-muted-foreground">
          Configure EMI plans, eligibility, and settings
        </p>
      </div>

      {/* EMI Plans */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5" />
            EMI Plans
          </CardTitle>
          <Button
            size="sm"
            onClick={() => setIsAddingPlan(!isAddingPlan)}
            className="gap-2">
            <Plus className="h-4 w-4" />
            Add Plan
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAddingPlan && (
            <div className="rounded-lg border border-border p-4">
              <h3 className="mb-4 font-semibold">New EMI Plan</h3>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-4">
                  <div>
                    <Label htmlFor="newBank">Bank</Label>
                    <select
                      id="newBank"
                      value={newPlan.bankId}
                      onChange={e => setNewPlan({...newPlan, bankId: e.target.value})}
                      className="mt-2 w-full border rounded px-2 py-2"
                      required
                    >
                      <option value="">Select Bank</option>
                      {banks.map(bank => (
                        <option key={bank.id} value={bank.id}>{bank.bankname}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="newMonths">Months</Label>
                    <Input
                      id="newMonths"
                      type="number"
                      value={newPlan.months}
                      onChange={e =>
                        setNewPlan({...newPlan, months: Number(e.target.value)})
                      }
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newName">Plan Name</Label>
                    <Input
                      id="newName"
                      value={newPlan.planName}
                      onChange={e =>
                        setNewPlan({...newPlan, planName: e.target.value})
                      }
                      className="mt-2"
                      placeholder="e.g., 6 Months"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newRate">Interest Rate (%)</Label>
                    <Input
                      id="newRate"
                      type="number"
                      step="0.1"
                      value={newPlan.interestRate}
                      onChange={e =>
                        setNewPlan({
                          ...newPlan,
                          interestRate: Number(e.target.value),
                        })
                      }
                      className="mt-2"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddPlan}>
                    Save Plan
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsAddingPlan(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
          <div className="space-y-3">
            {plans.map((plan) => {
              const bank = banks.find((b) => b.id === (plan.bankId || ""));
              const isEditing = editingPlan && editingPlan.id === plan.id;
              return (
                <div
                  key={plan.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  {isEditing ? (
                    <div className="flex-1 space-y-3">
                      <div className="grid gap-3 md:grid-cols-4">
                        <div>
                          <Label className="text-xs">Bank</Label>
                          <select
                            value={editingPlan?.bankId || ""}
                            onChange={e => setEditingPlan((prev) => prev ? { ...prev, bankId: e.target.value } : prev)}
                            className="mt-1 w-full border rounded px-2 py-2"
                            required
                          >
                            <option value="">Select Bank</option>
                            {banks.map((bank) => (
                              <option key={bank.id} value={bank.id}>{bank.bankname}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <Label className="text-xs">Months</Label>
                          <Input
                            type="number"
                            value={editingPlan?.months ?? 0}
                            onChange={e => setEditingPlan((prev) => prev ? { ...prev, months: Number(e.target.value) } : prev)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Plan Name</Label>
                          <Input
                            value={editingPlan?.planName || ""}
                            onChange={e => setEditingPlan((prev) => prev ? { ...prev, planName: e.target.value } : prev)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Interest Rate (%)</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={editingPlan?.interestRate ?? 0}
                            onChange={e => setEditingPlan((prev) => prev ? { ...prev, interestRate: Number(e.target.value) } : prev)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleUpdatePlan}>
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingPlan(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <p className="font-medium">{plan.planName}</p>
                        <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{plan.months} months</span>
                          <span>•</span>
                          <span>{plan.interestRate}% interest</span>
                          {bank && <><span>•</span><span className="font-semibold">{bank.bankname}</span></>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => togglePlanStatus(plan.id)}
                        >
                          Edit Status
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingPlan(plan)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-destructive"
                          onClick={() => handleDeletePlan(plan.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* EMI Calculator Preview */}
      <Card>
        <CardHeader>
          <CardTitle>EMI Calculator Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Example: For ৳100,000 order with available plans
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="py-2 text-left font-medium">Plan</th>
                    <th className="py-2 text-left font-medium">Bank</th>
                    <th className="py-2 text-center font-medium">Monthly Payment</th>
                    <th className="py-2 text-center font-medium">Total Interest</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map(plan => {
                    const principal = 100000;
                    const monthlyRate = plan.interestRate / 100 / 12;
                    const emi =
                      (principal *
                        monthlyRate *
                        Math.pow(1 + monthlyRate, plan.months)) /
                      (Math.pow(1 + monthlyRate, plan.months) - 1);
                    const totalInterest = emi * plan.months - principal;
                    const bank = banks.find(b => b.id === (plan.bankId || ''));
                    return (
                      <tr
                        key={plan.id}
                        className="border-b border-border last:border-0">
                        <td className="py-3 font-medium">{plan.planName}</td>
                        <td className="py-3">{bank ? bank.bankname : '-'}</td>
                        <td className="py-3 text-center">
                          {formatPrice(emi)}
                        </td>
                        <td className="py-3 text-center">
                          {formatPrice(totalInterest)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
