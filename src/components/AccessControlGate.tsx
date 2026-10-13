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
  EyeOff,
  ShieldCheck,
  Copy,
  Check
} from 'lucide-react';
import { OperatorSession } from '../types/vega';

interface AccessControlGateProps {
  onAuthenticate: (session: OperatorSession) => void;
}

export const AccessControlGate: React.FC<AccessControlGateProps> = ({ onAuthenticate }) => {
  // Completely empty state - NO autocomplete, NO automatic pre-filling
  const [operatorId, setOperatorId] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedUser, setCopiedUser] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const handleCopyUser = () => {
    navigator.clipboard.writeText('AdminCEO');
    setCopiedUser(true);
    setTimeout(() => setCopiedUser(false), 2000);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText('AdminCEO#2026');
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!operatorId.trim()) {
      setErrorMsg('Debe ingresar su ID de Operador asignado.');
      return;
    }

    if (!accessKey.trim()) {
      setErrorMsg('Debe ingresar su Clave de Seguridad Privada.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operatorId: operatorId.trim(),
          password: accessKey.trim()
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Credenciales de acceso inválidas. Verifique su ID de Operador y Clave.');
        setIsLoading(false);
        return;
      }

      const session: OperatorSession = data.session;
      localStorage.setItem('vega_operator_session', JSON.stringify(session));
      onAuthenticate(session);
    } catch (err: any) {
      console.error('Error during authentication:', err);
      setErrorMsg('Error de conexión con el motor de seguridad local. Verifique que el servicio esté activo.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060a12] flex items-center justify-center p-4 cyber-grid relative overflow-hidden font-sans">
      {/* Background cyber ambient glow */}
      <div className="absolute w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -top-40 -left-40" />
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -bottom-40 -right-40" />

      <div className="max-w-md w-full relative z-10">
        {/* Security Gate Card */}
        <div className="bg-[#0b101e]/95 border border-blue-900/60 rounded-2xl shadow-2xl backdrop-blur-xl p-8 relative overflow-hidden">
          {/* Top Classified Banner */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600" />

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-xl bg-blue-950/80 border border-blue-500/40 flex items-center justify-center text-cyan-400 mx-auto mb-3 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              <Lock className="w-7 h-7" />
            </div>
            
            <div className="inline-block px-2.5 py-0.5 rounded bg-blue-950/90 text-cyan-400 border border-blue-700/60 text-[10px] font-mono font-bold tracking-widest uppercase mb-1">
              ACCESO RESTRINGIDO // ZERO-TRUST GATE
            </div>
            
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              VEGA CORE v4.8
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Unidad de Explotación & Análisis Forense • CompuApps secureDev Tech
            </p>
          </div>

          {/* Strict Security: Autocomplete eliminated entirely */}
          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
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
                  name="operatorIdField"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  value={operatorId}
                  onChange={(e) => setOperatorId(e.target.value)}
                  placeholder="Ej: AdminCEO"
                  className="w-full bg-[#060a12] border border-slate-700/80 rounded-lg pl-9 pr-3 py-2.5 text-xs text-cyan-300 font-mono focus:border-blue-500 focus:outline-none"
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
                  name="accessKeyField"
                  autoComplete="new-password"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  placeholder="Ingrese clave maestra"
                  className="w-full bg-[#060a12] border border-slate-700/80 rounded-lg pl-9 pr-10 py-2.5 text-xs text-slate-100 font-mono focus:border-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 cursor-pointer"
                  title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="bg-[#070d18] border border-blue-900/40 rounded-lg p-2.5 text-[11px] font-mono text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Autenticación Zero-Trust validada contra base de datos local cifrada (PBKDF2-SHA512).</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg text-xs font-mono flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all cursor-pointer disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>Verificando Credenciales Cifradas...</span>
                </>
              ) : (
                <>
                  <span>Desbloquear Terminal VEGA</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Credenciales de Acceso Oficial para el AdminCEO (Jefe de Auditorías de Seguridad - Access Full) */}
          <div className="mt-5 pt-4 border-t border-slate-800/80">
            <div className="bg-[#060a14] border border-blue-900/60 rounded-xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>CREDENCIALES DEL ADMINCEO</span>
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-blue-950 text-cyan-300 border border-blue-700 font-bold uppercase">
                  ACCESS FULL
                </span>
              </div>

              <div className="text-[11px] font-mono text-slate-300 space-y-1">
                <div>
                  <span className="text-slate-400">Cargo: </span>
                  <strong className="text-white">Jefe de Auditorías de Seguridad</strong>
                </div>
                <div className="text-[10px] text-slate-400">
                  Panel de administración exclusivo de operadores habilitado para esta cuenta.
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-[#090f1d] p-2 rounded border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 block uppercase">Usuario:</span>
                    <button
                      type="button"
                      onClick={handleCopyUser}
                      className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 cursor-pointer"
                      title="Copiar usuario al portapapeles"
                    >
                      {copiedUser ? <Check className="w-3 h-3 text-cyan-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedUser ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>
                  <code className="text-white font-bold select-all">AdminCEO</code>
                </div>

                <div className="bg-[#090f1d] p-2 rounded border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 block uppercase">Clave Maestra:</span>
                    <button
                      type="button"
                      onClick={handleCopyKey}
                      className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 cursor-pointer"
                      title="Copiar clave al portapapeles"
                    >
                      {copiedKey ? <Check className="w-3 h-3 text-cyan-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>
                  <code className="text-cyan-300 font-bold select-all">AdminCEO#2026</code>
                </div>
              </div>

              <div className="pt-1 border-t border-slate-800/60">
                <p className="text-[10px] text-slate-400 font-mono leading-relaxed">
                  🛡️ <strong>Seguridad estricta:</strong> El autocompletado y botones de auto-acceso han sido eliminados. Ingrese las credenciales manualmente en el formulario superior.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Warning Notice */}
        <div className="text-center mt-4 text-[11px] font-mono text-slate-500">
          Terminal privada protegida • Base de datos local cifrada • Auditoría DFIR activa
        </div>
      </div>
    </div>
  );
};
