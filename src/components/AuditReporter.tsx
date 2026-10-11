import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  ShieldCheck, 
  ShieldAlert, 
  Download, 
  CheckCircle, 
  AlertTriangle,
  Building2,
  Calendar,
  Lock,
  Award
} from 'lucide-react';

export const AuditReporter: React.FC = () => {
  const [clientName, setClientName] = useState('Corporación Financiera & Tecnológica S.A.');
  const [auditScope, setAuditScope] = useState('Servicios Web Expuestos, APIs Internas e Infraestructura de Microservicios');
  const [auditDate, setAuditDate] = useState('10 de Octubre de 2026');
  const [leadAuditor, setLeadAuditor] = useState('Equipo Red Team & DFIR - CompuApps secureDev Tech');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0a1424] to-slate-900 border border-emerald-900/40 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold tracking-wide uppercase mb-1">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>MÓDULO DE GENERACIÓN DE INFORMES DE AUDITORÍA Y PERITAJE</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Reporte Ejecutivo & Técnico de Pentesting
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-2xl mt-1">
            Genera informes listos para entrega directiva y equipos técnicos con métricas de riesgo, evidencias recolectadas y recomendaciones prioritarias.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs font-mono flex items-center gap-2 transition-all cursor-pointer self-start md:self-auto"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir / Exportar a PDF</span>
        </button>
      </div>

      {/* Editable Report Parameters */}
      <div className="bg-[#0b101d] border border-slate-800 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
        <div>
          <label className="text-[10px] text-slate-400 block mb-1 uppercase">Entidad Auditada</label>
          <input 
            type="text" 
            value={clientName} 
            onChange={(e) => setClientName(e.target.value)}
            className="w-full bg-[#060a12] border border-slate-700 rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="text-[10px] text-slate-400 block mb-1 uppercase">Alcance del Pentest</label>
          <input 
            type="text" 
            value={auditScope} 
            onChange={(e) => setAuditScope(e.target.value)}
            className="w-full bg-[#060a12] border border-slate-700 rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="text-[10px] text-slate-400 block mb-1 uppercase">Fecha del Ejercicio</label>
          <input 
            type="text" 
            value={auditDate} 
            onChange={(e) => setAuditDate(e.target.value)}
            className="w-full bg-[#060a12] border border-slate-700 rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div>
          <label className="text-[10px] text-slate-400 block mb-1 uppercase">Auditor Líder</label>
          <input 
            type="text" 
            value={leadAuditor} 
            onChange={(e) => setLeadAuditor(e.target.value)}
            className="w-full bg-[#060a12] border border-slate-700 rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Official Report Document Container */}
      <div className="bg-[#0b101d] border border-slate-800 rounded-xl p-6 sm:p-10 shadow-2xl space-y-8 print:bg-white print:text-black print:p-0 print:border-none">
        {/* Report Cover / Header */}
        <div className="border-b-2 border-emerald-500/80 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
              <Award className="w-4 h-4" />
              <span>COMPUAPPS SECUREDEV TECH // INFORME DE SEGURIDAD OFENSIVA</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Informe Técnico de Prueba de Penetración & Peritaje Forense
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Unidad Operativa: VEGA CORE v4.8 • Confidencial - Solo Personal Autorizado
            </p>
          </div>

          <div className="bg-[#060a12] border border-slate-800 p-3 rounded-lg text-right font-mono text-xs">
            <span className="text-slate-500 block">ID INFORME:</span>
            <span className="text-emerald-400 font-bold">VEGA-REP-2026-981</span>
          </div>
        </div>

        {/* Executive Metrics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#060a12] border border-slate-800 p-4 rounded-xl text-center">
            <span className="text-[10px] font-mono text-slate-500 block uppercase">Nivel Global de Riesgo</span>
            <span className="text-2xl font-extrabold text-red-500 font-mono mt-1 block">ALTO (8.9/10)</span>
            <span className="text-[10px] text-slate-400">Atención Inmediata</span>
          </div>
          <div className="bg-[#060a12] border border-slate-800 p-4 rounded-xl text-center">
            <span className="text-[10px] font-mono text-slate-500 block uppercase">Hallazgos Críticos</span>
            <span className="text-2xl font-extrabold text-red-400 font-mono mt-1 block">3</span>
            <span className="text-[10px] text-slate-400">RCE & Broken Access</span>
          </div>
          <div className="bg-[#060a12] border border-slate-800 p-4 rounded-xl text-center">
            <span className="text-[10px] font-mono text-slate-500 block uppercase">Hallazgos Altos/Medios</span>
            <span className="text-2xl font-extrabold text-amber-400 font-mono mt-1 block">5</span>
            <span className="text-[10px] text-slate-400">Evasión y Exfiltración</span>
          </div>
          <div className="bg-[#060a12] border border-slate-800 p-4 rounded-xl text-center">
            <span className="text-[10px] font-mono text-slate-500 block uppercase">Tiempo Estimado Remediación</span>
            <span className="text-2xl font-extrabold text-emerald-400 font-mono mt-1 block">72 HORAS</span>
            <span className="text-[10px] text-slate-400">Fase 1 Prioritaria</span>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <section className="space-y-3">
          <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono border-b border-slate-800 pb-1 flex items-center gap-2">
            <span className="text-emerald-400">1.0</span>
            <span>Resumen Ejecutivo</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            Durante el período comprendido, la Unidad de Explotación y Análisis Forense <strong className="text-white">VEGA de CompuApps secureDev Tech</strong> realizó una auditoría de penetración autorizada bajo la modalidad de caja gris sobre los activos de <strong className="text-emerald-400">{clientName}</strong>. 
            El objetivo primordial consistió en identificar vectores de vulnerabilidad explotables, evaluar la resiliencia de los mecanismos de defensa perimetral (WAF, EDR) y emitir recomendaciones remediadoras definitivas.
          </p>
          <div className="bg-[#060a12] border border-emerald-950 p-4 rounded-lg text-xs font-mono text-emerald-300">
            <strong>Conclusión General:</strong> La postura de seguridad actual presenta brechas significativas en la validación de control de acceso y serialización de objetos en interfaces API, lo que permitió alcanzar ejecución arbitraria de comandos en el servidor anfitrión sin detonar alarmas críticas en los registros por defecto.
          </div>
        </section>

        {/* Section 2: Detailed Technical Findings */}
        <section className="space-y-4">
          <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono border-b border-slate-800 pb-1 flex items-center gap-2">
            <span className="text-emerald-400">2.0</span>
            <span>Hallazgos Técnicos Principales</span>
          </h3>

          <div className="space-y-3">
            <div className="bg-[#060a12] border border-slate-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-100 font-mono">
                  [VEGA-SEC-01] Ejecución Remota de Comandos (RCE) en Procesamiento de Archivos
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 font-bold">
                  CRÍTICO (CVSS 9.8)
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-2 leading-relaxed">
                El endpoint de conversión de documentos invoca llamadas al intérprete shell sin sanitizar los metadatos del fichero, permitiendo la inyección de comandos arbitrarios con permisos de usuario de servicio.
              </p>
              <div className="text-[11px] font-mono bg-slate-950 p-2.5 rounded border border-slate-900 text-slate-300">
                <span className="text-emerald-400 font-semibold block mb-0.5">Remediación Inmediata:</span>
                Migrar el procesamiento a bibliotecas seguras en memoria sin invocación a /bin/sh o cmd.exe; restringir la cuenta de servicio con chroot y AppArmor/SELinux.
              </div>
            </div>

            <div className="bg-[#060a12] border border-slate-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-100 font-mono">
                  [VEGA-SEC-02] Falla de Control de Acceso Horizontal (Bypass JWT & IDOR)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 font-bold">
                  CRÍTICO (CVSS 9.1)
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-2 leading-relaxed">
                Los tokens de autenticación no validan el algoritmo firmado en la cabecera, permitiendo eludir la verificación forjando peticiones con 'alg: none' y accediendo a paneles con rol super-administrador.
              </p>
              <div className="text-[11px] font-mono bg-slate-950 p-2.5 rounded border border-slate-900 text-slate-300">
                <span className="text-emerald-400 font-semibold block mb-0.5">Remediación Inmediata:</span>
                Forzar el rechazo de tokens sin firma criptográfica asimétrica RSA-256 e implementar autorización basada en roles (RBAC) validada en base de datos.
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Remediation Roadmap */}
        <section className="space-y-3">
          <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono border-b border-slate-800 pb-1 flex items-center gap-2">
            <span className="text-emerald-400">3.0</span>
            <span>Plan de Remediación & Cronograma Recomendado</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
            <div className="bg-[#060a12] border border-slate-800 p-3 rounded-lg">
              <span className="text-red-400 font-bold block mb-1">FASE 1: 24 - 48 HORAS</span>
              <p className="text-slate-300">Desplegar parches urgentes de validación en APIs y revocar credenciales filtradas.</p>
            </div>
            <div className="bg-[#060a12] border border-slate-800 p-3 rounded-lg">
              <span className="text-amber-400 font-bold block mb-1">FASE 2: 7 DÍAS</span>
              <p className="text-slate-300">Configuración estricta de reglas de bloqueo en WAF y políticas de Sysmon/auditd.</p>
            </div>
            <div className="bg-[#060a12] border border-slate-800 p-3 rounded-lg">
              <span className="text-emerald-400 font-bold block mb-1">FASE 3: 30 DÍAS</span>
              <p className="text-slate-300">Re-evaluación completa de penetración con VEGA para certificar cierre de brechas.</p>
            </div>
          </div>
        </section>

        {/* Signatures */}
        <div className="pt-8 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs font-mono">
          <div>
            <div className="border-b border-slate-700 pb-2 mb-1 text-slate-300 font-bold">
              {leadAuditor}
            </div>
            <span className="text-slate-500">Unidad de Explotación y Análisis Forense • CompuApps secureDev Tech</span>
          </div>
          <div>
            <div className="border-b border-slate-700 pb-2 mb-1 text-slate-300 font-bold">
              Dirección de Seguridad de la Información (CISO)
            </div>
            <span className="text-slate-500">{clientName}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
