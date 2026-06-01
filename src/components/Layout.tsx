import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  BarChart3, 
  FileBox, 
  Receipt, 
  FileText, 
  History, 
  Settings as SettingsIcon,
  Menu,
  X,
  Shield,
  TrendingUp,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { PolymorphicButton } from './ui/PolymorphicButton';
import { PolymorphicCard } from './ui/PolymorphicCard';

const NavItem = ({ to, icon: Icon, label, onClick }: { to: string, icon: any, label: string, onClick?: () => void }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) => 
        `flex items-center gap-3 px-[12px] py-[8px] rounded-[8px] text-[14px] font-medium transition-all duration-300 ${
          isActive 
            ? 'bg-[#E6F1FB] text-primary shadow-sm shadow-primary/5 dark:bg-primary/20 dark:text-white border-l-2 border-primary' 
            : 'text-text-secondary hover:bg-white/40 dark:hover:bg-white/5 dark:text-text-tertiary'
        }`
      }
    >
      <Icon size={18} />
      {label}
    </NavLink>
  );
};

export default function Layout() {
  const { settings, currentUser, lockVault, isViewOnlyMode } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <div className="flex h-screen overflow-hidden bg-page-light dark:bg-page-dark relative z-0">
      
      {/* Background Ambient Glowing Blurs (Glassmorphism Core) */}
      <div className="absolute top-[-15%] right-[-10%] w-[380px] sm:w-[600px] h-[380px] sm:h-[600px] rounded-full bg-gradient-to-tr from-primary/15 via-blue-500/10 to-indigo-500/15 blur-[90px] sm:blur-[130px] pointer-events-none animate-glow-1 -z-10"></div>
      <div className="absolute top-[30%] left-[-15%] w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] rounded-full bg-gradient-to-br from-income/15 via-emerald-400/10 to-teal-500/10 blur-[80px] sm:blur-[110px] pointer-events-none animate-glow-2 -z-10"></div>
      <div className="absolute bottom-[-15%] right-[5%] w-[420px] sm:w-[650px] h-[420px] sm:h-[650px] rounded-full bg-gradient-to-bl from-expense/15 via-pink-500/10 to-purple-600/15 blur-[100px] sm:blur-[150px] pointer-events-none animate-glow-3 -z-10"></div>

      {/* Modern Premium Glass Grid Backplane Overlay */}
      <div className="absolute inset-0 glass-grid opacity-[0.85] pointer-events-none -z-10" />

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white/60 dark:bg-card-dark/60 backdrop-blur-md border-b border-white/20 dark:border-white/10 absolute top-0 w-full z-20 h-[60px] no-print">
        <div className="flex items-center gap-2.5">
          <div className="w-[32px] h-[32px] rounded-[10px] bg-[#3B82F6] flex items-center justify-center shadow-sm">
            <TrendingUp className="text-white" size={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-text-primary dark:text-white tracking-[0.5px] leading-none uppercase">
              KUKISA FINANCE
            </span>
            <span className="text-[9px] text-text-secondary dark:text-text-tertiary leading-none mt-0.5 font-medium">
              School Club
            </span>
          </div>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-text-secondary">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden no-print" onClick={closeMobileMenu}></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`no-print fixed md:static inset-y-0 left-0 z-40 w-[210px] bg-white/40 dark:bg-card-dark/40 backdrop-blur-xl border-r border-white/25 dark:border-white/10 flex flex-col transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-5 hidden md:flex items-center gap-3">
          <div className="w-[42px] h-[42px] rounded-[14px] bg-[#3B82F6] flex items-center justify-center shadow-md shadow-blue-500/10 flex-shrink-0">
            <TrendingUp className="text-white" size={22} />
          </div>
          <div className="flex flex-col">
            <span className="text-[15px] font-bold text-text-primary dark:text-white tracking-[0.5px] leading-tight uppercase">
              KUKISA FINANCE
            </span>
            <span className="text-[11px] text-text-secondary dark:text-text-tertiary leading-tight font-medium">
              School Club
            </span>
          </div>
        </div>

        {/* Mobile Spacer */}
        <div className="h-[60px] md:hidden"></div>

        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-6">
          
          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.05em] text-text-tertiary mb-3 px-3">Finance</div>
            <nav className="flex flex-col gap-1">
              <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" onClick={closeMobileMenu} />
              <NavItem to="/transactions" icon={ArrowRightLeft} label="Transactions" onClick={closeMobileMenu} />
              <NavItem to="/analytics" icon={BarChart3} label="Analytics" onClick={closeMobileMenu} />
              <NavItem to="/reports" icon={FileBox} label="Reports" onClick={closeMobileMenu} />
            </nav>
          </div>

          <div>
            <div className="text-[11px] font-medium uppercase tracking-[0.05em] text-text-tertiary mb-3 px-3">Governance</div>
            <nav className="flex flex-col gap-1">
              <NavItem to="/accountability" icon={ShieldCheck} label="Accountability" onClick={closeMobileMenu} />
            </nav>
          </div>

        </div>

        <div className="p-4 border-t border-white/20 dark:border-white/10 flex flex-col gap-3">
          {/* Settings - Hidden for view-only users */}
          {!isViewOnlyMode && <NavItem to="/settings" icon={SettingsIcon} label="Settings" onClick={closeMobileMenu} />}
          
          {/* Dynamic Profile Indicator */}
          <div className="flex items-center justify-between p-2 rounded-[8px] bg-white/15 dark:bg-white/5 border border-white/10 dark:border-white/5 mt-1 animate-fade-in">
            <div className="flex items-center gap-2 overflow-hidden flex-1">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-[14px] flex-shrink-0 select-none shadow-sm shadow-primary/20">
                {(currentUser?.name || 'B').charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col overflow-hidden text-left flex-1">
                <span className="text-[12px] font-bold text-text-primary dark:text-white truncate max-w-[105px] leading-tight">
                  {currentUser?.name || 'BRIAN treasurer'}
                </span>
                <span className={`text-[10px] leading-tight truncate ${
                  isViewOnlyMode 
                    ? 'text-amber-600 dark:text-amber-400 font-semibold' 
                    : 'text-text-tertiary dark:text-text-tertiary'
                }`}>
                  {isViewOnlyMode ? '🔒 Read-Only' : 'Full Access'}
                </span>
              </div>
            </div>
            <button 
              onClick={() => lockVault()}
              className="p-1 text-text-secondary hover:text-expense hover:bg-white/20 dark:hover:bg-white/10 rounded-[6px] transition-colors cursor-pointer"
              title={isViewOnlyMode ? 'Exit' : 'Lock Vault'}
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative pt-[60px] md:pt-0">
        <div className="p-[24px] sm:px-[28px] max-w-7xl mx-auto pb-[100px]">
          <Outlet />
        </div>
      </main>
      
    </div>
  );
}
