import React, { useState } from 'react';
import { 
  Package, 
  AlertTriangle, 
  ShoppingCart, 
  Plus, 
  Clock, 
  Printer, 
  Share2, 
  Check, 
  Calendar,
  Building,
  ArrowRight,
  TrendingDown,
  X
} from 'lucide-react';
import { Medicine, FamilyMember } from '../types/medicare';

interface StockAndRefillsProps {
  medicines: Medicine[];
  members: FamilyMember[];
  selectedMemberId: string | 'all';
  onUpdateStock: (medicineId: string, newStock: number) => void;
  onOpenAddModal: () => void;
  onOpenScanner: () => void;
}

export const StockAndRefills: React.FC<StockAndRefillsProps> = ({
  medicines,
  members,
  selectedMemberId,
  onUpdateStock,
  onOpenAddModal,
  onOpenScanner,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'low' | 'adequate'>('all');
  const [refillModalMed, setRefillModalMed] = useState<Medicine | null>(null);
  const [customRefillUnits, setCustomRefillUnits] = useState<number>(30);
  const [orderSlipOpen, setOrderSlipOpen] = useState(false);
  const [copiedSlip, setCopiedSlip] = useState(false);
  const [partnerOrderSuccess, setPartnerOrderSuccess] = useState<string | null>(null);

  const visibleMedicines = selectedMemberId === 'all'
    ? medicines
    : medicines.filter((m) => m.profileId === selectedMemberId);

  // Calculate days remaining for each medicine
  const medicinesWithStats = visibleMedicines.map((med) => {
    const dailyDoses = Math.max(1, med.scheduleTimings.length || 1);
    const daysRemaining = Math.floor(med.currentStock / dailyDoses);
    const isCritical = med.currentStock <= med.minStockAlert;
    const isDepleted = med.currentStock <= 0;
    const percentRemaining = med.initialStock > 0 
      ? Math.min(100, Math.round((med.currentStock / med.initialStock) * 100))
      : 50;

    return {
      ...med,
      dailyDoses,
      daysRemaining,
      isCritical,
      isDepleted,
      percentRemaining,
    };
  });

  const lowStockMedicines = medicinesWithStats.filter((m) => m.isCritical);
  const adequateStockMedicines = medicinesWithStats.filter((m) => !m.isCritical);

  const displayedMedicines = filterType === 'low'
    ? lowStockMedicines
    : filterType === 'adequate'
    ? adequateStockMedicines
    : medicinesWithStats;

  const handleRefillSubmit = () => {
    if (refillModalMed) {
      const updated = refillModalMed.currentStock + customRefillUnits;
      onUpdateStock(refillModalMed.id, updated);
      setPartnerOrderSuccess(`Refilled ${customRefillUnits} ${refillModalMed.unitType} of ${refillModalMed.name}!`);
      setTimeout(() => setPartnerOrderSuccess(null), 3000);
      setRefillModalMed(null);
    }
  };

  const generateOrderSlipText = () => {
    const patientName = selectedMemberId === 'all' ? 'Family Care Account' : (members.find(m => m.id === selectedMemberId)?.name || 'Patient');
    const items = lowStockMedicines.length > 0 ? lowStockMedicines : displayedMedicines;
    
    let text = `======================================\n`;
    text += `💊 CAREDOSE REFILL ORDER SLIP\n`;
    text += `======================================\n`;
    text += `Patient Name: ${patientName}\n`;
    text += `Order Date: ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}\n`;
    text += `--------------------------------------\n`;
    items.forEach((item, idx) => {
      text += `${idx + 1}. ${item.name} (${item.strength})\n`;
      text += `   Form: ${item.dosageForm} | Salt: ${item.activeSalt || 'N/A'}\n`;
      text += `   Current Stock: ${item.currentStock} units (${item.daysRemaining} days left)\n`;
      text += `   Requested Refill: 30 ${item.unitType}\n\n`;
    });
    text += `--------------------------------------\n`;
    text += `Verified via CareDose Smart Medication Management System\n`;
    return text;
  };

  const copyOrderSlip = () => {
    navigator.clipboard.writeText(generateOrderSlipText());
    setCopiedSlip(true);
    setTimeout(() => setCopiedSlip(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Alert if any low stock */}
      {lowStockMedicines.length > 0 && (
        <div className="bg-rose-50 border border-rose-200/90 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-950 flex items-center gap-2">
                <span>Automatic Refill Alert: {lowStockMedicines.length} Medicine(s) Running Low</span>
              </h3>
              <p className="text-xs text-rose-700 mt-0.5">
                {lowStockMedicines.map((m) => `${m.name} (${m.daysRemaining} days remaining)`).join(', ')}.
                Restock before doses are missed.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center">
            <button
              onClick={() => setOrderSlipOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Generate Refill Order Slip</span>
            </button>
          </div>
        </div>
      )}

      {/* Success Notification Banner */}
      {partnerOrderSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 font-medium flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
          <span>{partnerOrderSuccess}</span>
        </div>
      )}

      {/* Action Header & Filter Tabs */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              filterType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Inventory ({medicinesWithStats.length})
          </button>
          <button
            onClick={() => setFilterType('low')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              filterType === 'low' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-600 hover:text-rose-600'
            }`}
          >
            ⚠️ Low Stock ({lowStockMedicines.length})
          </button>
          <button
            onClick={() => setFilterType('adequate')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              filterType === 'adequate' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            In Stock ({adequateStockMedicines.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setOrderSlipOpen(true)}
            className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Order Slip</span>
          </button>
          <button
            onClick={onOpenAddModal}
            className="px-3.5 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Medicine</span>
          </button>
          <button
            onClick={onOpenScanner}
            className="px-3.5 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-lg flex items-center gap-1.5 cursor-pointer"
          >
            <Package className="w-3.5 h-3.5" />
            <span>Scan Strip (AI)</span>
          </button>
        </div>
      </div>

      {/* Grid of Stock Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedMedicines.map((med) => {
          const member = members.find((m) => m.id === med.profileId) || members[0];

          return (
            <div
              key={med.id}
              className={`bg-white rounded-2xl border p-5 transition-all flex flex-col justify-between ${
                med.isCritical
                  ? 'border-rose-300 ring-1 ring-rose-200 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="space-y-3">
                {/* Header: Patient & Form Tag */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: member.avatarColor }}
                    />
                    <span className="font-semibold text-slate-700">{member.name}</span>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                    med.isCritical
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {med.dosageForm}
                  </span>
                </div>

                {/* Medicine Title & Strength */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    {med.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="font-medium text-slate-700">{med.strength}</span>
                    <span aria-hidden="true">·</span>
                    <span>{med.doseAmount} ({med.dailyDoses}x/day)</span>
                  </div>
                </div>

                {/* Stock Progress Bar & Days Remaining */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xl font-extrabold text-slate-900">{med.currentStock}</span>
                      <span className="text-xs text-slate-500 ml-1">{med.unitType} remaining</span>
                    </div>

                    <div className="text-right">
                      {med.isCritical ? (
                        <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          ⚠️ {med.daysRemaining} days left
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-emerald-700">
                          ~{med.daysRemaining} days supply
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stock Gauge */}
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        med.isCritical
                          ? 'bg-rose-500'
                          : med.percentRemaining < 40
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.max(6, med.percentRemaining)}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Min alert: {med.minStockAlert} {med.unitType}</span>
                    <span>Purchased: {med.initialStock} {med.unitType}</span>
                  </div>
                </div>

                {/* Expiry Date & Manufacturer metadata */}
                <div className="text-[11px] text-slate-500 space-y-0.5">
                  {med.expiryDate && (
                    <div className="flex justify-between">
                      <span>Expiry Date:</span>
                      <span className="font-medium text-slate-700">{med.expiryDate}</span>
                    </div>
                  )}
                  {med.manufacturer && (
                    <div className="flex justify-between">
                      <span>Manufacturer:</span>
                      <span className="font-medium text-slate-700 truncate max-w-[160px]">{med.manufacturer}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons: 1-click Refill or Edit Stock */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => {
                    setRefillModalMed(med);
                    setCustomRefillUnits(30);
                  }}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    med.isCritical
                      ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Refill Medicine</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onUpdateStock(med.id, Math.max(0, med.currentStock - 1))}
                    className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 cursor-pointer"
                    title="Manual adjust: -1"
                  >
                    -
                  </button>
                  <button
                    onClick={() => onUpdateStock(med.id, med.currentStock + 1)}
                    className="w-7 h-7 rounded-lg border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 cursor-pointer"
                    title="Manual adjust: +1"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {displayedMedicines.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No Inventory Found</h3>
          <p className="text-xs text-slate-500 mt-1">No medicines match this stock filter.</p>
        </div>
      )}

      {/* Refill Modal */}
      {refillModalMed && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Record Refill / Purchase</h3>
                <p className="text-xs text-slate-500">
                  {refillModalMed.name} ({refillModalMed.strength})
                </p>
              </div>
              <button
                onClick={() => setRefillModalMed(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1.5 border border-slate-100">
              <div className="flex justify-between text-slate-600">
                <span>Current On-Hand Stock:</span>
                <span className="font-bold text-slate-900">{refillModalMed.currentStock} {refillModalMed.unitType}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Projected New Stock:</span>
                <span className="font-bold text-teal-700">{refillModalMed.currentStock + customRefillUnits} {refillModalMed.unitType}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700">Select Refill Quantity to Add:</label>
              <div className="grid grid-cols-4 gap-2">
                {[10, 15, 30, 60].map((num) => (
                  <button
                    key={num}
                    onClick={() => setCustomRefillUnits(num)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      customRefillUnits === num
                        ? 'bg-teal-50 border-teal-500 text-teal-800'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    +{num} {refillModalMed.unitType}
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <label className="text-xs font-semibold text-slate-700 block mb-1">Or Custom Quantity:</label>
                <input
                  type="number"
                  min="1"
                  value={customRefillUnits}
                  onChange={(e) => setCustomRefillUnits(parseInt(e.target.value, 10) || 1)}
                  className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setRefillModalMed(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRefillSubmit}
                className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
              >
                Update Stock (+{customRefillUnits})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Pharmacy Order Slip Modal */}
      {orderSlipOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Pharmacy Refill Order Slip</h3>
                <p className="text-xs text-slate-500">Ready to present to local chemist or share on WhatsApp</p>
              </div>
              <button
                onClick={() => setOrderSlipOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <pre className="bg-slate-900 text-teal-300 p-4 rounded-xl text-xs font-mono whitespace-pre-wrap max-h-72 overflow-y-auto leading-relaxed border border-slate-800">
              {generateOrderSlipText()}
            </pre>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                {lowStockMedicines.length} low-stock items included
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={copyOrderSlip}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedSlip ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedSlip ? 'Copied to Clipboard!' : 'Copy Order Text'}</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
