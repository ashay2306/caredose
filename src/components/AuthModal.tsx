import React, { useState } from 'react';
import { 
  ShieldCheck, 
  User, 
  Mail, 
  Lock, 
  X, 
  Check, 
  Sparkles, 
  Users, 
  ArrowRight,
  UserPlus,
  LogIn
} from 'lucide-react';
import { AuthUser, UserRole } from '../types/medicare';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser, withDemoPack?: boolean) => void;
  currentUser: AuthUser | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentUser,
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('family_caregiver');
  const [withSampleData, setWithSampleData] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }

    if (isRegister && !name) {
      setErrorMessage('Please provide your full name.');
      return;
    }

    const colors = ['#0d9488', '#0284c7', '#059669', '#6366f1', '#d97706', '#db2777'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const authenticatedUser: AuthUser = {
      id: `usr-${Date.now()}`,
      name: isRegister ? name : (email.split('@')[0] || 'User'),
      email,
      role,
      avatarColor: randomColor,
      createdAt: new Date().toISOString(),
    };

    onLoginSuccess(authenticatedUser, isRegister ? withSampleData : false);
    onClose();
  };

  const handleQuickDemoLogin = (demoRole: UserRole, demoName: string, demoEmail: string) => {
    const user: AuthUser = {
      id: `usr-${demoName.toLowerCase().replace(/\s+/g, '-')}`,
      name: demoName,
      email: demoEmail,
      role: demoRole,
      avatarColor: demoRole === 'family_caregiver' ? '#4f46e5' : '#0284c7',
      createdAt: new Date().toISOString(),
    };
    onLoginSuccess(user, false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden my-6 animate-scale-in">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-teal-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                {isRegister ? 'Create CareDose Account' : 'Welcome to CareDose'}
              </h2>
              <p className="text-xs text-slate-400">
                {isRegister
                  ? 'Register to track medications & coordinate family care'
                  : 'Log in to manage your medication schedule & refills'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="p-6 space-y-5">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                !isRegister ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                isRegister ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register New User</span>
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium">
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-3.5">
            {isRegister && (
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Johnson"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs font-medium pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-teal-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder="alex.caregiver@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs font-medium pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs font-medium pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-teal-500"
                />
              </div>
            </div>

            {isRegister && (
              <>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Account Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full text-xs font-medium p-2.5 rounded-lg border border-slate-300 focus:outline-teal-500 bg-white"
                  >
                    <option value="family_caregiver">👨‍👩‍👦 Family Caregiver (Multi-Patient Oversight)</option>
                    <option value="patient">💊 Individual Patient (Personal Meds Only)</option>
                    <option value="student">🎓 College Student / Evaluator (Project Demo Mode)</option>
                  </select>
                </div>

                <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-200">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={withSampleData}
                      onChange={(e) => setWithSampleData(e.target.checked)}
                      className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-teal-950">Seed Starting Family & Medication Pack</span>
                      <p className="text-[11px] text-teal-800/90 mt-0.5">
                        Pre-loads multi-generational family profiles (Arthur, Elena, Robert, Alex, Leo), clinical regimens (Metformin, Atorvastatin, Levothyroxine, Lisinopril), doctor consultations with Dr. Sarah Jenkins & Dr. Robert Miller, and 92% adherence history.
                      </p>
                    </div>
                  </label>
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>{isRegister ? 'Create Free Account' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Demo Logins */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              ⚡ Quick 1-Click Demo Profiles:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('family_caregiver', 'Alex Rivera (Caregiver)', 'alex.rivera@familycare.com')}
                className="p-2 text-left bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-300 rounded-lg text-xs transition-colors cursor-pointer"
              >
                <div className="font-bold text-slate-900">Alex Rivera</div>
                <div className="text-[10px] text-indigo-700 font-semibold">Primary Caregiver</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('patient', 'Arthur Rivera (Grandpa)', 'arthur.rivera@familycare.com')}
                className="p-2 text-left bg-slate-50 hover:bg-sky-50/60 border border-slate-200 hover:border-sky-300 rounded-lg text-xs transition-colors cursor-pointer"
              >
                <div className="font-bold text-slate-900">Arthur Rivera</div>
                <div className="text-[10px] text-sky-700 font-semibold">Senior Diabetic View</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('patient', 'Elena Rivera (Mother)', 'elena.rivera@familycare.com')}
                className="p-2 text-left bg-slate-50 hover:bg-amber-50/60 border border-slate-200 hover:border-amber-300 rounded-lg text-xs transition-colors cursor-pointer"
              >
                <div className="font-bold text-slate-900">Elena Rivera</div>
                <div className="text-[10px] text-amber-700 font-semibold">Thyroid & Bone Care</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
