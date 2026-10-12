import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Key, 
  Lock, 
  Trash2, 
  Power, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Search, 
  ShieldAlert, 
  Fingerprint, 
  Database,
  Eye,
  EyeOff,
  UserCheck
} from 'lucide-react';
import { OperatorSession, StoredOperator } from '../types/vega';

interface OperatorManagementPanelProps {
  operatorSession: OperatorSession | null;
}

export const OperatorManagementPanel: React.FC<OperatorManagementPanelProps> = ({ operatorSession }) => {
  const [operators, setOperators] = useState<StoredOperator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form states for new operator
  const [newId, setNewId] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'AUDITOR_CHIEF' | 'SECURITY_ENGINEER' | 'FORENSIC_EXPERT'>('SECURITY_ENGINEER');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCeoAccount, setIsCeoAccount] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset password modal state
  const [resetTargetOp, setResetTargetOp] = useState<string | null>(null);
  const [resetPasswordVal, setResetPasswordVal] = useState('');

  const isCEO = operatorSession?.isCEO || operatorSession?.operatorId?.toUpperCase() === 'ADMINCEO' || operatorSession?.role === 'AUDITOR_CHIEF';

  const fetchOperators = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/admin/users', {
        headers: {
          'x-operator-id': operatorSession?.operatorId || 'AdminCEO'
        }
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'No se pudieron cargar los operadores.');
      } else {
        setOperators(data.operators || []);
      }
    } catch (err: any) {
      console.error('Error fetching operators:', err);
      setErrorMsg('Error de red al consultar la base de datos de operadores.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOperators();
  }, [operatorSession]);

  const handleCreateOperator = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!newId.trim() || !newName.trim() || !newPassword.trim()) {
      setErrorMsg('Debe completar todos los campos del nuevo operador.');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMsg('La contraseña debe tener un mínimo de 8 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Las contraseñas ingresadas no coinciden.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestingOperatorId: operatorSession?.operatorId || 'AdminCEO',
          operatorId: newId.trim().toUpperCase(),
          fullName: newName.trim(),
          password: newPassword,
          role: newRole,
          isCEO: isCeoAccount
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'No se pudo crear el operador.');
      } else {
        setSuccessMsg(data.message || 'Operador creado con credenciales cifradas PBKDF2-SHA512.');
        setNewId('');
        setNewName('');
        setNewPassword('');
        setConfirmPassword('');
        setIsCeoAccount(false);
        fetchOperators();
      }
    } catch (err: any) {
      console.error('Error creating operator:', err);
      setErrorMsg('Error de conexión al guardar el operador.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (targetId: string, currentStatus: boolean) => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await fetch(`/api/admin/users/${targetId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestingOperatorId: operatorSession?.operatorId || 'AdminCEO',
          isActive: !currentStatus
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Error al cambiar estado.');
      } else {
        setSuccessMsg(`Estado de ${targetId} modificado: ${!currentStatus ? 'Activo' : 'Suspendido'}.`);
        fetchOperators();
      }
    } catch (err: any) {
      setErrorMsg('Error al comunicar con el servidor.');
    }
  };

  const handleExecutePasswordReset = async () => {
    if (!resetTargetOp || resetPasswordVal.length < 8) {
      setErrorMsg('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${resetTargetOp}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestingOperatorId: operatorSession?.operatorId || 'AdminCEO',
          newPassword: resetPasswordVal
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'No se pudo cambiar la contraseña.');
      } else {
        setSuccessMsg(`Contraseña de ${resetTargetOp} actualizada y cifrada exitosamente.`);
        setResetTargetOp(null);
        setResetPasswordVal('');
        fetchOperators();
      }
    } catch (err) {
      setErrorMsg('Error al restablecer la contraseña.');
    }
  };

  const handleDeleteOperator = async (targetId: string) => {
    if (!confirm(`¿Está seguro de revocar y eliminar definitivamente al operador "${targetId}" de la base de datos?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${targetId}`, {
        method: 'DELETE',
        headers: {
          'x-operator-id': operatorSession?.operatorId || 'AdminCEO'
        }
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'No se pudo eliminar el operador.');
      } else {
        setSuccessMsg(`Operador ${targetId} eliminado de la base de datos.`);
        fetchOperators();
      }
    } catch (err) {
      setErrorMsg('Error al eliminar el operador.');
    }
  };

  if (!isCEO) {
    return (
      <div className="bg-[#0b101e] border border-red-900/60 rounded-xl p-8 text-center max-w-xl mx-auto shadow-2xl">
        <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-white mb-2">Acceso Restringido al CEO</h2>
        <p className="text-xs text-slate-300 font-mono">
          Este módulo está reservado exclusivamente para el usuario <strong>AdminCEO</strong> (Jefe de Auditorías de Seguridad).
          Solo el CEO tiene la autorización para crear, modificar o revocar cuentas de operadores y gestionar las credenciales cifradas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0a1426] to-slate-900 border border-blue-900/40 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Gestión Local de Operadores (Panel Exclusivo del CEO)
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800 font-bold">
                  ADMIN-CEO CONTROL
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Crea y administra operadores autorizados. Las credenciales se almacenan con cifrado militar (PBKDF2-SHA512 + Salt criptográfico de 128-bits) en la base de datos local persistente.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchOperators}
              disabled={isLoading}
              className="text-xs font-mono text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-blue-400' : ''}`} />
              <span>Actualizar Lista</span>
            </button>
          </div>
        </div>

        {/* Security Parameters Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span>ALMACENAMIENTO:</span>
            <span className="text-slate-200 font-semibold">data/operators_db.json (Local Privada)</span>
          </div>
          <div className="flex items-center gap-2">
            <Fingerprint className="w-3.5 h-3.5 text-cyan-400" />
            <span>ALGORITMO DE CIFRADO:</span>
            <span className="text-cyan-300 font-semibold">PBKDF2 (SHA-512 / 100,000 Iteraciones)</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>DIRECTIVA:</span>
            <span className="text-blue-300 font-semibold">Cero-Confianza // Sin Autocompletar</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="bg-red-950/60 border border-red-800/80 p-3 rounded-lg text-xs font-mono text-red-300 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg('')} className="text-slate-400 hover:text-white text-xs">✕</button>
        </div>
      )}

      {successMsg && (
        <div className="bg-blue-950/60 border border-blue-800/80 p-3 rounded-lg text-xs font-mono text-blue-300 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-slate-400 hover:text-white text-xs">✕</button>
        </div>
      )}

      {/* Main Grid: Create Operator (5 cols) + Operator Directory (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Create New Operator */}
        <div className="lg:col-span-5 bg-[#0b101e] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <UserPlus className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Registrar Nuevo Operador en Base de Datos
            </h3>
          </div>

          <form onSubmit={handleCreateOperator} className="space-y-3.5">
            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1 uppercase font-semibold">
                ID de Operador Único
              </label>
              <input
                type="text"
                value={newId}
                onChange={(e) => setNewId(e.target.value)}
                placeholder="ej. OP-FORENSIC-02"
                className="w-full bg-[#060a12] border border-slate-700 rounded-lg px-3 py-2 text-xs text-cyan-300 font-mono focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1 uppercase font-semibold">
                Nombre Completo / Perito
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="ej. Perito Forense Digital Senior"
                className="w-full bg-[#060a12] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1 uppercase font-semibold">
                Rol de Auditoría Asignado
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as any)}
                className="w-full bg-[#060a12] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:border-blue-500 focus:outline-none"
              >
                <option value="AUDITOR_CHIEF">Jefe de Auditoría de Seguridad (Full Access)</option>
                <option value="SECURITY_ENGINEER">Ingeniero de Ciberseguridad Ofensiva (Red Team)</option>
                <option value="FORENSIC_EXPERT">Perito Forense Digital (DFIR & Custodia)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1 uppercase font-semibold">
                Contraseña Privada (Mínimo 8 caracteres)
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Definir contraseña de alta entropía"
                  className="w-full bg-[#060a12] border border-slate-700 rounded-lg pl-3 pr-9 py-2 text-xs text-slate-200 font-mono focus:border-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-2.5 top-2.5 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1 uppercase font-semibold">
                Confirmar Contraseña
              </label>
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repetir contraseña exacta"
                className="w-full bg-[#060a12] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isCeoCheck"
                checked={isCeoAccount}
                onChange={(e) => setIsCeoAccount(e.target.checked)}
                className="rounded border-slate-700 text-blue-600 focus:ring-0 bg-[#060a12]"
              />
              <label htmlFor="isCeoCheck" className="text-xs font-mono text-slate-300 cursor-pointer select-none">
                Conceder Privilegios de CEO / Director de Auditorías
              </label>
            </div>

            <div className="bg-[#060a14] border border-blue-900/40 p-2.5 rounded-lg text-[10px] font-mono text-slate-400">
              🔒 El servidor generará un salt de 128-bits aleatorio y cifrará la clave antes de insertarla en el disco.
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg text-xs font-mono flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Cifrando y Guardando en Base de Datos...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Crear Operador con Contraseña Cifrada</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Table: Registered Operators in Database */}
        <div className="lg:col-span-7 bg-[#0b101e] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Directorio de Operadores Cifrados ({operators.length})
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              Base de Datos: <strong className="text-blue-400">Activa & Persistente</strong>
            </span>
          </div>

          <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
            {operators.map((op) => (
              <div 
                key={op.operatorId}
                className={`p-3.5 rounded-lg border transition-all ${
                  op.isCEO 
                    ? 'bg-blue-950/20 border-blue-700/60 shadow-[0_0_12px_rgba(37,99,235,0.1)]' 
                    : op.isActive 
                      ? 'bg-[#060a14] border-slate-800 hover:border-slate-700' 
                      : 'bg-red-950/20 border-red-900/50 opacity-70'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <UserCheck className={`w-4 h-4 ${op.isCEO ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span className="font-mono font-bold text-white text-xs">
                      {op.operatorId}
                    </span>
                    {op.isCEO && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-700 font-bold">
                        CEO / ROOT
                      </span>
                    )}
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                      op.isActive 
                        ? 'bg-blue-950 text-blue-400 border-blue-800' 
                        : 'bg-red-950 text-red-400 border-red-800'
                    }`}>
                      {op.isActive ? 'ACTIVO' : 'SUSPENDIDO'}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400">
                    Creado: {new Date(op.createdAt).toLocaleDateString()} por {op.createdBy}
                  </span>
                </div>

                <div className="text-xs text-slate-300 font-sans mb-3">
                  {op.fullName} • <span className="font-mono text-cyan-400 text-[11px]">{op.role}</span>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono">
                  <div className="text-slate-500">
                    Último acceso: <span className="text-slate-400">{op.lastLogin ? new Date(op.lastLogin).toLocaleString() : 'Nunca'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {!op.isCEO && (
                      <button
                        onClick={() => handleToggleStatus(op.operatorId, op.isActive)}
                        className={`px-2 py-1 rounded text-[10px] font-mono border transition-colors cursor-pointer ${
                          op.isActive 
                            ? 'bg-slate-900 border-amber-800 text-amber-400 hover:bg-amber-950/40' 
                            : 'bg-slate-900 border-blue-800 text-blue-400 hover:bg-blue-950/40'
                        }`}
                      >
                        <Power className="w-3 h-3 inline mr-1" />
                        {op.isActive ? 'Suspender' : 'Activar'}
                      </button>
                    )}

                    <button
                      onClick={() => setResetTargetOp(op.operatorId)}
                      className="px-2 py-1 rounded text-[10px] font-mono bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
                    >
                      <Key className="w-3 h-3 inline mr-1 text-cyan-400" />
                      Restablecer Clave
                    </button>

                    {!op.isCEO && (
                      <button
                        onClick={() => handleDeleteOperator(op.operatorId)}
                        className="px-2 py-1 rounded text-[10px] font-mono bg-red-950/40 border border-red-800/60 text-red-400 hover:bg-red-900/60 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3 inline mr-1" />
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Password Reset Modal */}
      {resetTargetOp && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0b101e] border border-blue-800 rounded-xl p-5 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-xs font-bold text-white font-mono uppercase flex items-center gap-1.5">
                <Key className="w-4 h-4 text-blue-400" />
                <span>Restablecer Contraseña Cifrada ({resetTargetOp})</span>
              </h4>
              <button 
                onClick={() => setResetTargetOp(null)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              El sistema generará un nuevo salt criptográfico único y recifrará la clave con PBKDF2-SHA512.
            </p>

            <div>
              <label className="text-[11px] font-mono text-slate-400 block mb-1 uppercase">
                Nueva Contraseña Privada (Mín. 8 caracteres)
              </label>
              <input
                type="password"
                value={resetPasswordVal}
                onChange={(e) => setResetPasswordVal(e.target.value)}
                placeholder="Nueva clave para el operador"
                className="w-full bg-[#060a12] border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setResetTargetOp(null)}
                className="px-3 py-1.5 rounded text-xs font-mono text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleExecutePasswordReset}
                className="px-4 py-1.5 rounded text-xs font-mono font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/30 cursor-pointer"
              >
                Confirmar y Cifrar Clave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
