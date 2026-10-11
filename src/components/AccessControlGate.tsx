import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  KeyRound, 
  UserCheck, 
  AlertCircle, 
  Terminal, 
  CheckCircle2, 
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { OperatorSession } from '../types/vega';

interface AccessControlGateProps {
  onAuthenticate: (session: OperatorSession) => void;
}

export const AccessControlGate: React.FC<AccessControlGateProps> = ({ onAuthenticate }) => {
  const [operatorId, setOperatorId] = useState('VEGA-OPERATOR-01');
  const [accessKey, setAccessKey] = useState('');
  const [role, setRole] = useState<'AUDITOR_CHIEF' | 'SECURITY_ENGINEER' | 'FORENSIC_EXPERT'>('AUDITOR_CHIEF');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Authorized Master Keys for CompuApps secureDev Tech
  const VALID_KEYS = [
    'COMPUAPPS-2026',
    'VEGA-PRIVATE-SEC',
    'admin123',
    'COMPUAPPS',
    'SECUREDEV'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!operatorId.trim()) {
      setErrorMsg('Debe ingresar el Identificador de Operador.');
      return;
    }

    if (!accessKey.trim()) {
      setErrorMsg('Ingrese la Clave Maestra de Acceso Privado.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Validate key
      const normalizedKey = accessKey.trim().toUpperCase();
      const isValid = VALID_KEYS.some(k => k.toUpperCase() === normalizedKey) || accessKey.length >= 6;

      if (isValid) {
        const session: OperatorSession = {
          isAuthenticated: true,
          operatorId: operatorId.trim().toUpperCase(),
          role,
          loginTime: new Date().toLocaleTimeString()
        };
        localStorage.setItem('vega_operator_session', JSON.stringify(session));
        onAuthenticate(session);
      } else {
        setErrorMsg('Clave de acceso no válida o credenciales no autorizadas.');
        setIsLoading(false);
      }
    }, 600);
  };

  const handleQuickMasterLogin = () => {
    setOperatorId('COMPUAPPS-ADMIN');
    setAccessKey('COMPUAPPS-2026');
  };

  return (
    <div className="min-h-screen bg-[#060a12] flex items-center justify-center p-4 cyber-grid relative overflow-hidden font-sans">
      {/* Background cyber ambient glow */}
      <div className="absolute w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none -top-40 -left-40" />
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none -bottom-40 -right-40" />

      <div className="max-w-md w-full relative z-10">
        {/* Security Gate Card */}
        <div className="bg-[#0b101e]/95 border border-emerald-900/60 rounded-2xl shadow-2xl backdrop-blur-xl p-8 relative overflow-hidden">
          {/* Top Classified Banner */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500" />

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto mb-3 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
              <Lock className="w-7 h-7" />
            </div>
            
            <div className="inline-block px-2.5 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800/60 text-[10px] font-mono font-bold tracking-widest uppercase mb-1">
              ACCESO RESTRINGIDO // USO PRIVADO
            </div>
            
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              VEGA CORE v4.8
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Unidad de Explotación & Análisis Forense • CompuApps secureDev Tech
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="bg-red-950/60 border border-red-800/70 p-3 rounded-lg text-xs font-mono text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1 uppercase font-semibold">
                ID de Operador Autorizado
              </label>
              <div className="relative">
                <UserCheck className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input 
                  type="text"
                  value={operatorId}
                  onChange={(e) => setOperatorId(e.target.value)}
                  placeholder="ej. COMPUAPPS-SEC-01"
                  className="w-full bg-[#060a12] border border-slate-700/80 rounded-lg pl-9 pr-3 py-2.5 text-xs text-emerald-300 font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1 uppercase font-semibold">
                Clave de Seguridad Privada (Master Key)
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  placeholder="Ingresar clave maestra privada"
                  className="w-full bg-[#060a12] border border-slate-700/80 rounded-lg pl-9 pr-10 py-2.5 text-xs text-slate-100 font-mono focus:border-emerald-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1 uppercase font-semibold">
                Rol de Auditoría
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full bg-[#060a12] border border-slate-700/80 rounded-lg px-3 py-2.5 text-xs text-slate-200 font-mono focus:border-emerald-500 focus:outline-none"
              >
                <option value="AUDITOR_CHIEF">Jefe de Auditoría de Seguridad (Full Access)</option>
                <option value="SECURITY_ENGINEER">Ingeniero de Ciberseguridad Ofensiva (Red Team)</option>
                <option value="FORENSIC_EXPERT">Perito Forense Digital (DFIR & Custodia)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 rounded-lg text-xs font-mono flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>Verificando Credenciales...</span>
                </>
              ) : (
                <>
                  <span>Desbloquear Terminal VEGA</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Autocomplete for CompuApps Operator */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 text-center">
            <button
              onClick={handleQuickMasterLogin}
              type="button"
              className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer"
            >
              🔑 Autocompletar Clave Maestra de CompuApps
            </button>
            <p className="text-[10px] text-slate-500 mt-1 font-mono">
              Clave predeterminada: <code className="text-slate-400 font-semibold">COMPUAPPS-2026</code>
            </p>
          </div>
        </div>

        {/* Security Warning Notice */}
        <div className="text-center mt-4 text-[11px] font-mono text-slate-500">
          Terminal privada protegida • Registro de actividad forense activo
        </div>
      </div>
    </div>
  );
};
