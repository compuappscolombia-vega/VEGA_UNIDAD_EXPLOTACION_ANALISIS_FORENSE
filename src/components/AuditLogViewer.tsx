import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  RefreshCw, 
  Lock, 
  Hash, 
  Copy, 
  Check, 
  UserCheck, 
  Clock, 
  FileSpreadsheet, 
  Cpu, 
  Terminal, 
  Fingerprint
} from 'lucide-react';
import { AuditLogEntry, OperatorSession } from '../types/vega';

interface AuditLogViewerProps {
  operatorSession: OperatorSession | null;
}

export const AuditLogViewer: React.FC<AuditLogViewerProps> = ({ operatorSession }) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [headHash, setHeadHash] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionTypeFilter, setActionTypeFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Integrity verification state
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    tested: boolean;
    isValid: boolean;
    totalVerified: number;
    testedAt: string;
  } | null>(null);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (actionTypeFilter !== 'ALL') params.append('actionType', actionTypeFilter);
      if (severityFilter !== 'ALL') params.append('severity', severityFilter);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await fetch(`/api/audit-logs?${params.toString()}`);
      const data = await res.json();
      setLogs(data.logs || []);
      setTotalCount(data.totalCount || 0);
      setHeadHash(data.headHash || '');
    } catch (e) {
      console.error('Error fetching audit logs:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [actionTypeFilter, severityFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLogs();
  };

  const handleVerifyIntegrity = async () => {
    setIsVerifying(true);
    try {
      const res = await fetch('/api/audit-logs/verify-integrity', { method: 'POST' });
      const data = await res.json();
      setVerificationResult({
        tested: true,
        isValid: data.isValid,
        totalVerified: data.totalVerified,
        testedAt: new Date().toLocaleTimeString()
      });
    } catch (e) {
      console.error('Error verifying audit log integrity:', e);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const getActionBadge = (type: string) => {
    switch (type) {
      case 'AUTH':
        return 'bg-blue-950 text-blue-400 border-blue-800';
      case 'SCAN':
        return 'bg-cyan-950 text-cyan-400 border-cyan-800';
      case 'AI_ANALYSIS':
        return 'bg-indigo-950 text-indigo-400 border-indigo-800';
      case 'SCRIPT_FORGE':
        return 'bg-amber-950 text-amber-400 border-amber-800';
      case 'FORENSICS':
        return 'bg-violet-950 text-violet-400 border-violet-800';
      case 'REPORT':
        return 'bg-blue-950 text-blue-400 border-blue-800';
      case 'DOWNLOAD':
        return 'bg-teal-950 text-teal-400 border-teal-800';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-red-950 text-red-400 border-red-700 font-bold';
      case 'WARNING':
        return 'bg-amber-950 text-amber-400 border-amber-700 font-semibold';
      case 'NOTICE':
        return 'bg-cyan-950 text-cyan-400 border-cyan-800';
      default:
        return 'bg-slate-900 text-slate-400 border-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0a1626] to-slate-900 border border-blue-900/40 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Bitácora Centralizada de Auditoría (Audit Log)
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-cyan-400 border border-blue-800">
                  ISO/IEC 27037 COMPLIANT
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Registro inmutable y encadenado criptográficamente (SHA-256 Chaining) de todas las acciones operativas, escaneos, artefactos y scripts generados en VEGA.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
            <button
              onClick={handleVerifyIntegrity}
              disabled={isVerifying}
              className="bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800/80 font-mono text-xs px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              {isVerifying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
              <span>Verificar Integridad Criptográfica</span>
            </button>

            <a
              href="/api/audit-logs/export?format=json"
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-mono text-xs px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>Exportar JSON Firmado</span>
            </a>

            <a
              href="/api/audit-logs/export?format=csv"
              className="bg-blue-950/80 hover:bg-blue-900 text-blue-300 border border-blue-800/80 font-mono text-xs px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-400" />
              <span>Exportar CSV Pericial</span>
            </a>
          </div>
        </div>

        {/* Verification Alert Banner */}
        {verificationResult && (
          <div className={`mt-4 p-3 rounded-lg border text-xs font-mono flex items-center justify-between gap-3 ${
            verificationResult.isValid
              ? 'bg-blue-950/60 border-blue-800/80 text-blue-300'
              : 'bg-red-950/60 border-red-800/80 text-red-300'
          }`}>
            <div className="flex items-center gap-2">
              {verificationResult.isValid ? (
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              )}
              <span>
                {verificationResult.isValid
                  ? `Integridad Criptográfica Validada: La cadena de ${verificationResult.totalVerified} registros forenses es 100% íntegra y no ha sufrido manipulaciones.`
                  : 'ALERTA DE SEGURIDAD: Se detectó una inconsistencia en la cadena de hashes de los registros.'}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 shrink-0">
              Verificado a las {verificationResult.testedAt}
            </span>
          </div>
        )}

        {/* Meta Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span>TOTAL REGISTROS: <strong className="text-white">{totalCount}</strong></span>
            <span className="text-slate-600">|</span>
            <span>OPERADOR EN SESIÓN: <strong className="text-cyan-400">{operatorSession?.operatorId || 'COMPUAPPS-ADMIN'}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] truncate max-w-md">
            <span className="text-slate-500">HEAD HASH (SHA-256):</span>
            <span className="text-cyan-300 font-mono truncate">{headHash}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0b101d] border border-slate-800 rounded-xl p-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          <div className="lg:col-span-2">
            <label className="text-[10px] text-slate-400 uppercase block mb-1">Buscar en Registros</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por ID, host objetivo, detalle o hash..."
                className="w-full bg-[#060a12] border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 uppercase block mb-1">Tipo de Acción</label>
            <select
              value={actionTypeFilter}
              onChange={(e) => setActionTypeFilter(e.target.value)}
              className="w-full bg-[#060a12] border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">Todas las Acciones</option>
              <option value="AUTH">Autenticación (AUTH)</option>
              <option value="SCAN">Inspección de Red (SCAN)</option>
              <option value="AI_ANALYSIS">Análisis de IA (AI_ANALYSIS)</option>
              <option value="SCRIPT_FORGE">Forja de Scripts (SCRIPT_FORGE)</option>
              <option value="FORENSICS">Peritaje Forense (FORENSICS)</option>
              <option value="REPORT">Reportes (REPORT)</option>
              <option value="DOWNLOAD">Descargas (DOWNLOAD)</option>
              <option value="SYSTEM">Sistema (SYSTEM)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 uppercase block mb-1">Severidad</label>
            <div className="flex gap-2">
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="flex-1 bg-[#060a12] border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="ALL">Todas</option>
                <option value="INFO">INFO</option>
                <option value="NOTICE">NOTICE</option>
                <option value="WARNING">WARNING</option>
                <option value="CRITICAL">CRITICAL</option>
              </select>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                Filtrar
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Audit Log Table */}
      <div className="bg-[#0b101d] border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-[#060a12] border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                <th className="py-3 px-3">Fecha y Hora (UTC)</th>
                <th className="py-3 px-3">ID Registro</th>
                <th className="py-3 px-3">Operador / Rol</th>
                <th className="py-3 px-3">Acción</th>
                <th className="py-3 px-3">Severidad</th>
                <th className="py-3 px-3">Detalle de la Acción Forense</th>
                <th className="py-3 px-3 text-right">Hash SHA-256</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-slate-300">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 px-3 whitespace-nowrap text-slate-400 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap text-cyan-400 font-semibold text-[11px]">
                    {log.id}
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="text-slate-200 font-bold block">{log.operatorId}</span>
                    <span className="text-[10px] text-slate-500">{log.role}</span>
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className={`text-[9px] px-2 py-0.5 rounded border ${getActionBadge(log.actionType)}`}>
                      {log.actionType}
                    </span>
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className={`text-[9px] px-2 py-0.5 rounded border ${getSeverityBadge(log.severity)}`}>
                      {log.severity}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-slate-300 max-w-md">
                    <p className="line-clamp-2 leading-relaxed text-[11px]">
                      {log.actionDetail}
                    </p>
                    {log.target && (
                      <span className="text-[10px] text-cyan-400 block mt-0.5">
                        Objetivo: {log.target}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-3 whitespace-nowrap text-right text-[10px]">
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-slate-500 truncate w-24 block" title={log.entryHash}>
                        {log.entryHash.substring(0, 10)}...
                      </span>
                      <button
                        onClick={() => handleCopyHash(log.entryHash)}
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
                        title="Copiar Hash SHA-256 completo"
                      >
                        {copiedHash === log.entryHash ? (
                          <Check className="w-3 h-3 text-cyan-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {logs.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    {isLoading ? 'Cargando registros forenses...' : 'No se encontraron registros de auditoría que coincidan con los filtros.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
