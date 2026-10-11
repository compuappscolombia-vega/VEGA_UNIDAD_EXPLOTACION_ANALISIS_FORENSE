import React from 'react';
import { 
  ShieldAlert, 
  Terminal, 
  Cpu, 
  Search, 
  FileCode2, 
  Layers, 
  FileText, 
  Radio, 
  Fingerprint, 
  Activity,
  CheckCircle2,
  Download,
  Lock,
  LogOut,
  Compass,
  Sliders,
  UserCheck
} from 'lucide-react';
import { ModuleTab, OperatorSession, UserMode } from '../types/vega';

interface HeaderProps {
  activeTab: ModuleTab;
  setActiveTab: (tab: ModuleTab) => void;
  systemStatus: string;
  isAiActive: boolean;
  operatorSession: OperatorSession | null;
  onLogout: () => void;
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  setActiveTab, 
  systemStatus, 
  isAiActive,
  operatorSession,
  onLogout,
  userMode,
  setUserMode
}) => {
  const navItems: { id: ModuleTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'vulnerability_radar', label: 'Radar CVE & Scanner', icon: <Search className="w-4 h-4" /> },
    { id: 'ai_pentest', label: 'Motor IA Ofensiva', icon: <Cpu className="w-4 h-4" />, badge: 'AI CORE' },
    { id: 'script_forge', label: 'Forja de Scripts 100%', icon: <FileCode2 className="w-4 h-4" /> },
    { id: 'forensic_suite', label: 'Unidad Forense DFIR', icon: <Fingerprint className="w-4 h-4" />, badge: 'EVIDENCIAS' },
    { id: 'mitre_matrix', label: 'Matriz MITRE ATT&CK', icon: <Layers className="w-4 h-4" /> },
    { id: 'audit_reports', label: 'Reporte Auditoría', icon: <FileText className="w-4 h-4" /> },
    { id: 'deploy_export', label: 'Descargar & Publicar', icon: <Download className="w-4 h-4" />, badge: 'ZIP & URL' },
  ];

  return (
    <header className="border-b border-emerald-900/40 bg-[#090d16]/95 backdrop-blur-md sticky top-0 z-50">
      {/* Top Cyber Command Status Bar */}
      <div className="border-b border-emerald-950/80 px-4 py-1.5 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold tracking-wider">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>VEGA CORE // ONLINE</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
            <span>UNIDAD:</span>
            <span className="text-slate-200">EXPLOTACIÓN & ANÁLISIS FORENSE</span>
          </div>
          <span className="hidden sm:inline text-slate-600">|</span>
          <div className="hidden md:flex items-center gap-1.5">
            <span>AUTORIZACIÓN:</span>
            <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-1.5 py-0.5 rounded text-[10px]">
              AUDITORÍA ÉTICA AUTORIZADA
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* User Mode Toggle: Guiado vs Experto */}
          <div className="flex items-center gap-1 bg-[#060a12] p-0.5 rounded border border-slate-800">
            <button
              onClick={() => setUserMode('guided')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] transition-all cursor-pointer ${
                userMode === 'guided'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3 h-3" />
              <span>Modo Guiado</span>
            </button>
            <button
              onClick={() => setUserMode('expert')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] transition-all cursor-pointer ${
                userMode === 'expert'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3 h-3" />
              <span>Modo Experto</span>
            </button>
          </div>

          <span className="text-slate-600">|</span>

          {/* Operator ID Badge */}
          {operatorSession && (
            <div className="hidden lg:flex items-center gap-1 text-[11px] text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
              <UserCheck className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-mono font-semibold">{operatorSession.operatorId}</span>
              <span className="text-[10px] text-slate-500 font-mono">({operatorSession.role.split('_')[0]})</span>
            </div>
          )}

          <div className="flex items-center gap-1 text-[11px]">
            <span className="text-slate-500">ENGINE:</span>
            <span className="text-cyan-400 font-semibold">CompuApps secureDev</span>
          </div>
          
          <span className="text-slate-600">|</span>

          {/* Logout / Lock Button */}
          <button
            onClick={onLogout}
            className="flex items-center gap-1 text-[10px] font-mono text-red-400 bg-red-950/50 hover:bg-red-900/60 border border-red-800/60 px-2 py-0.5 rounded transition-colors cursor-pointer"
            title="Bloquear Terminal y Cerrar Sesión Privada"
          >
            <LogOut className="w-3 h-3" />
            <span>Bloquear</span>
          </button>
        </div>
      </div>

      {/* Main Brand & Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <ShieldAlert className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                VEGA
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-medium">
                  v4.8.2
                </span>
              </h1>
              <span className="text-[10px] uppercase tracking-widest text-emerald-400/80 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40 font-mono">
                RED & BLUE TEAM
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Unidad de Explotación y Análisis Forense <span className="text-emerald-500">•</span> CompuApps secureDev Tech
            </p>
          </div>
        </div>

        {/* Tactical Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer relative ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.15)] font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                    isActive ? 'bg-emerald-500/30 text-emerald-200' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <a
            href="/api/download-project-zip"
            download="VEGA_UNIDAD_EXPLOTACION_ANALISIS_FORENSE.zip"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold font-mono bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all ml-1 shadow-[0_0_12px_rgba(16,185,129,0.3)] shrink-0 cursor-pointer"
            title="Descargar código fuente completo en archivo .ZIP"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Descargar .ZIP</span>
          </a>
        </nav>
      </div>
    </header>
  );
};
