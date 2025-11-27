'use client';

import {useState} from 'react';

interface Bank {
  id: string;
  name: string;
}

interface NewPlan {
  months: number;
  name: string;
  interestRate: number;
  bankId: string;
}
// Demo initial banks
const initialBanks: Bank[] = [
  { id: '1', name: 'AB Bank' },
  { id: '2', name: 'Bank Asia' },
  { id: '3', name: 'Brac Bank' },
];
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import {Button} from '../../components/ui/button';
import {Input} from '../../components/ui/input';
import {Label} from '../../components/ui/label';
import {Badge} from '../../components/ui/badge';
import {useEMIStore, type EMIPlan} from '../../store/emi-store';
import {Plus, Trash2, Edit2, Percent} from 'lucide-react';
import {formatPrice} from '../../lib/utils/format';

export default function AdminEMIPage() {
  const {config, addPlan, removePlan, updatePlan} = useEMIStore();
  // Bank management state
  const [banks, setBanks] = useState<Bank[]>(initialBanks);
  const [isAddingBank, setIsAddingBank] = useState(false);
  const [newBank, setNewBank] = useState({ name: '' });
  const [editingBank, setEditingBank] = useState<Bank | null>(null);
  // Plan state
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [editingPlan, setEditingPlan] = useState<EMIPlan | null>(null);
  const [newPlan, setNewPlan] = useState<NewPlan>({
    months: 0,
    name: '',
    interestRate: 0,
    bankId: '',
  });

  // Bank handlers
  const handleAddBank = () => {
    if (newBank.name.trim()) {
      setBanks([...banks, { id: Date.now().toString(), name: newBank.name }]);
      setNewBank({ name: '' });
      setIsAddingBank(false);
    }
  };
  const handleUpdateBank = () => {
    if (editingBank) {
      setBanks(banks.map((b) => (b.id === editingBank.id ? editingBank : b)));
      setEditingBank(null);
    }
  };
  const handleDeleteBank = (id: string) => {
    setBanks(banks.filter((b) => b.id !== id));
  };

  const handleAddPlan = () => {
    if (newPlan.months && newPlan.name && newPlan.bankId) {
      addPlan({
        id: `plan-${Date.now()}`,
        months: newPlan.months,
        name: newPlan.name,
        interestRate: newPlan.interestRate,
        enabled: true,
        bankId: newPlan.bankId,
      });
      setNewPlan({months: 0, name: '', interestRate: 0, bankId: ''});
      setIsAddingPlan(false);
    }
  };

  const handleUpdatePlan = () => {
    if (editingPlan) {
      updatePlan(editingPlan.id, editingPlan);
      setEditingPlan(null);
    }
  };

  const togglePlanStatus = (planId: string) => {
    const plan = config.plans.find(p => p.id === planId);
    if (plan) {
      updatePlan(planId, {enabled: !plan.enabled});
    }
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
                <span className="font-medium">{bank.name}</span>
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
                value={newBank.name}
                onChange={(e) => setNewBank({ ...newBank, name: e.target.value })}
              />
              <Button size="sm" onClick={handleAddBank}>Save</Button>
              <Button size="sm" variant="outline" onClick={() => setIsAddingBank(false)}>Cancel</Button>
            </div>
          )}
          {editingBank && (
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Bank Name"
                value={editingBank.name}
                onChange={(e) => setEditingBank({ ...editingBank, name: e.target.value })}
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
                        <option key={bank.id} value={bank.id}>{bank.name}</option>
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
                      value={newPlan.name}
                      onChange={e =>
                        setNewPlan({...newPlan, name: e.target.value})
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
            {config.plans.map(plan => {
              const bank = banks.find(b => b.id === (plan.bankId || ''));
              return (
                <div
                  key={plan.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4">
                  {editingPlan?.id === plan.id ? (
                  <div className="flex-1 space-y-3">
                    <div className="grid gap-3 md:grid-cols-4">
                      <div>
                        <Label className="text-xs">Bank</Label>
                        <select
                          value={editingPlan.bankId || ''}
                          onChange={e => setEditingPlan({ ...editingPlan, bankId: e.target.value })}
                          className="mt-1 w-full border rounded px-2 py-2"
                          required
                        >
                          <option value="">Select Bank</option>
                          {banks.map(bank => (
                            <option key={bank.id} value={bank.id}>{bank.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label className="text-xs">Months</Label>
                        <Input
                          type="number"
                          value={editingPlan.months}
                          onChange={e =>
                            setEditingPlan({
                              ...editingPlan,
                              months: Number(e.target.value),
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Plan Name</Label>
                        <Input
                          value={editingPlan.name}
                          onChange={e =>
                            setEditingPlan({
                              ...editingPlan,
                              name: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Interest Rate (%)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={editingPlan.interestRate}
                          onChange={e =>
                            setEditingPlan({
                              ...editingPlan,
                              interestRate: Number(e.target.value),
                            })
                          }
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
                        onClick={() => setEditingPlan(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="font-medium">{plan.name}</p>
                      <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                        <span>{plan.months} months</span>
                        <span>•</span>
                        <span>{plan.interestRate}% interest</span>
                        {bank && <><span>•</span><span className="font-semibold">{bank.name}</span></>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={plan.enabled ? 'default' : 'secondary'}>
                        {plan.enabled ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => togglePlanStatus(plan.id)}>
                        {plan.enabled ? 'Disable' : 'Enable'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingPlan(plan)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive"
                        onClick={() => removePlan(plan.id)}>
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
                  {config.plans
                    .filter(p => p.enabled)
                    .map(plan => {
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
                          <td className="py-3 font-medium">{plan.name}</td>
                          <td className="py-3">{bank ? bank.name : '-'}</td>
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
