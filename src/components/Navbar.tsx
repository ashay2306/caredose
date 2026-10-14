import React, { useState } from 'react';
import { 
  Pill, 
  Users, 
  Bell, 
  AlertTriangle, 
  RefreshCw, 
  Layers, 
  ShieldCheck, 
  Clock, 
  Volume2, 
  VolumeX,
  Camera,
  LogIn,
  User,
  LogOut,
  ChevronDown,
  UserPlus
} from 'lucide-react';
import { FamilyMember, AuthUser } from '../types/medicare';

interface NavbarProps {
  members: FamilyMember[];
  selectedMemberId: string | 'all';
  onSelectMember: (id: string | 'all') => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  currentUser: AuthUser | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenScanner: () => void;
  onOpenArchitecture: () => void;
  onOpenSafetyGuide: () => void;
  onTriggerDemoReminder: () => void;
  onTriggerEscalationDemo: () => void;
  onResetData: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  pendingEscalationsCount: number;
  lowStockCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  members,
  selectedMemberId,
  onSelectMember,
  activeTab,
  onSelectTab,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenScanner,
  onOpenArchitecture,
  onOpenSafetyGuide,
  onTriggerDemoReminder,
  onTriggerEscalationDemo,
  onResetData,
  soundEnabled,
  onToggleSound,
  pendingEscalationsCount,
  lowStockCount,
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const currentMember = members.find((m) => m.id === selectedMemberId);

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      {/* Top Banner with Quick Simulation shortcuts */}
      <div className="bg-slate-950 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80">
        <div className="flex items-center gap-3 text-slate-300">
          <span className="flex items-center gap-1.5 font-medium text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            CareDose Live Engine
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="hidden sm:inline text-slate-400">
            Smart Medication & Family Care System
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Demo Simulator Buttons */}
          <button
            onClick={onTriggerDemoReminder}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-[11px] font-medium transition-colors cursor-pointer"
            title="Trigger real-time 8:00 PM Metformin dose reminder alert for Arthur (Grandpa)"
          >
            <Bell className="w-3 h-3 text-teal-400" />
            <span>Simulate Reminder Alert</span>
          </button>

          <button
            onClick={onTriggerEscalationDemo}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[11px] font-medium transition-colors cursor-pointer"
            title="Demonstrate Missed Dose Escalation to Alex Rivera (+1 (555) 789-1022)"
          >
            <AlertTriangle className="w-3 h-3 text-rose-400" />
            <span>Simulate Missed Escalation</span>
          </button>

          <button
            onClick={onToggleSound}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={soundEnabled ? 'Mute Audio Alerts' : 'Enable Audio Alerts'}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onResetData}
            className="flex items-center gap-1 p-1 px-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 text-[11px] transition-colors"
            title="Reset to Initial Demo State"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden md:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Pill className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white">MediCare+</span>
              <span className="text-xs uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                CareDose
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Smart Medication & Family Care System
            </p>
          </div>
        </div>

        {/* Family Member Switcher */}
        <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/80">
          <Users className="w-4 h-4 text-slate-400 ml-1.5 hidden sm:inline" />
          <span className="text-xs text-slate-400 hidden md:inline">Active Patient:</span>
          
          <select
            value={selectedMemberId}
            onChange={(e) => onSelectMember(e.target.value)}
            className="bg-slate-900 text-white text-xs font-medium rounded-lg px-2.5 py-1.5 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-400 cursor-pointer"
          >
            <option value="all">👨‍👩‍👦 All Family Members</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.relationship}, {m.age}y)
              </option>
            ))}
          </select>

          {currentMember && (
            <div 
              className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-sm"
              style={{ backgroundColor: currentMember.avatarColor }}
              title={`${currentMember.name} - Guardian: ${currentMember.guardianName}`}
            >
              {currentMember.name.charAt(0)}
            </div>
          )}
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          {/* Strip Scanner CTA Button */}
          <button
            onClick={onOpenScanner}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Scan Strip</span>
          </button>

          {/* Safety Check Modal */}
          <button
            onClick={onOpenSafetyGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden lg:inline">Safety Guide</span>
          </button>

          {/* Architecture Explainer */}
          <button
            onClick={onOpenArchitecture}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
            title="System Architecture & Cloud Platform"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden xl:inline">Architecture</span>
          </button>

          {/* User Account / Login / Register Button */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-xs transition-colors cursor-pointer"
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-xs"
                  style={{ backgroundColor: currentUser.avatarColor }}
                >
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left hidden md:block">
                  <div className="font-semibold text-white leading-tight truncate max-w-24">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-teal-400 capitalize">
                    {currentUser.role.replace('_', ' ')}
                  </div>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-slate-200 shadow-2xl py-2 z-50 text-xs text-slate-900 animate-scale-in">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <div className="font-bold text-slate-900">{currentUser.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                    <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200 capitalize">
                      {currentUser.role.replace('_', ' ')}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenAuth();
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-slate-400" />
                    <span>Switch / Register New User</span>
                  </button>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-rose-50 flex items-center gap-2 text-rose-600 font-semibold cursor-pointer border-t border-slate-100 mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login / Register</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tab Bar */}
      <div className="bg-slate-900/90 border-t border-slate-800/80 px-4 sm:px-6">
        <nav className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-2 scrollbar-none text-xs">
          {[
            { id: 'today', label: "Today's Schedule", icon: Clock },
            { id: 'medicines', label: 'Medicines & Inventory', icon: Pill, badge: lowStockCount > 0 ? `${lowStockCount} Low` : undefined, badgeColor: 'bg-rose-500/20 text-rose-300' },
            { id: 'family', label: 'Family Caregiver Hub', icon: Users, badge: pendingEscalationsCount > 0 ? 'Alert' : undefined, badgeColor: 'bg-amber-500/20 text-amber-300' },
            { id: 'adherence', label: 'Adherence Analytics (92%)', icon: ShieldCheck },
            { id: 'prescriptions', label: 'Prescription Vault', icon: Layers },
            { id: 'appointments', label: 'Doctor Appointments', icon: Bell },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${tab.badgeColor}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
