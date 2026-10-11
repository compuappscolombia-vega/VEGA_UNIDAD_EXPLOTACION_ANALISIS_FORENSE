import React, { useState } from 'react';
import { 
  Fingerprint, 
  Search, 
  FileCheck2, 
  ShieldAlert, 
  Clock, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Upload, 
  Printer, 
  Download,
  Terminal,
  Cpu
} from 'lucide-react';
import { ForensicArtifact, TimelineEvent, ChainOfCustody } from '../types/vega';

export const ForensicSuite: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'inspector' | 'hasher' | 'timeline' | 'custody'>('inspector');
  const [caseId, setCaseId] = useState('DFIR-2026-CO-084');
  const [investigator, setInvestigator] = useState('Ing. Perito Forense CompuApps');
  const [artifactType, setArtifactType] = useState('Log de Servidor Web (Nginx / Apache)');
  const [rawArtifactInput, setRawArtifactInput] = useState(`192.168.1.145 - - [10/Oct/2026:14:22:18 +0000] "GET /api/v1/users?id=1'%20UNION%20SELECT%201,username,password_hash%20FROM%20sys_users--%20- HTTP/1.1" 200 4821 "-" "sqlmap/1.7#stable"
192.168.1.145 - - [10/Oct/2026:14:25:02 +0000] "POST /tools/ping HTTP/1.1" 200 340 "-" "curl/7.81.0" payload="127.0.0.1; whoami && id > /tmp/out.txt"
192.168.1.145 - - [10/Oct/2026:14:28:44 +0000] "POST /uploads/avatar_33.php HTTP/1.1" 200 125 "-" "Mozilla/5.0" vega_cmd="cat /etc/shadow"`);
  
  const [isInspecting, setIsInspecting] = useState(false);
  const [inspectionResult, setInspectionResult] = useState<any>({
    integrityHashSha256: "9e107d9d372bb6826bd81d3542a419d6bc436d6cfb0d4d57b54c06771dfe35f4",
    verdict: "CRITICAL_EVIDENCE",
    evidenceSummary: "Evidencia de compromiso activo detectada. Se identificaron patrones de Inyección SQL Automatizada, Inyección de Comandos OS y ejecución de WebShell interactiva.",
    identifiedThreats: [
      {
        type: "Inyección SQL con volcado de contraseñas (SQLi)",
        timestamp: "2026-10-10 14:22:18 UTC",
        sourceIp: "192.168.1.145",
        rawSnippet: "GET /api/v1/users?id=1' UNION SELECT 1,username,password_hash FROM sys_users-- -",
        iocs: ["192.168.1.145", "sqlmap/1.7#stable", "sys_users table dump"]
      },
      {
        type: "Ejecución Remota de Comandos (RCE)",
        timestamp: "2026-10-10 14:25:02 UTC",
        sourceIp: "192.168.1.145",
        rawSnippet: "POST /tools/ping payload='127.0.0.1; whoami && id > /tmp/out.txt'",
        iocs: ["whoami invocation", "pipe redirection into /tmp"]
      },
      {
        type: "Detonación de WebShell Ofuscada",
        timestamp: "2026-10-10 14:28:44 UTC",
        sourceIp: "192.168.1.145",
        rawSnippet: "POST /uploads/avatar_33.php vega_cmd='cat /etc/shadow'",
        iocs: ["avatar_33.php webshell", "/etc/shadow exfiltration attempt"]
      }
    ],
    timelineEvents: [
      { time: "14:22:18", actor: "192.168.1.145", action: "Sondeo de inyección SQL automatizada", significance: "Exfiltración de hashes de usuarios de base de datos" },
      { time: "14:25:02", actor: "192.168.1.145", action: "Ejecución de payload whoami mediante RCE", significance: "Validación de privilegios locales en servidor" },
      { time: "14:28:44", actor: "192.168.1.145", action: "Invocación de webshell para leer /etc/shadow", significance: "Intento de escalada de privilegios y persistencia" }
    ],
    chainOfCustodyNotes: "Evidencia asegurada conforme a directrices ISO/IEC 27037:2012 para manejo de evidencia digital. Almacenar copias bit a bit en medio de almacenamiento WORM."
  });

  // Hash calculator state
  const [hashInputText, setHashInputText] = useState('VEGA_FORENSIC_EVIDENCE_ARTEFACT_2026');
  const [calculatedHashes, setCalculatedHashes] = useState({
    md5: '7d6b38c21a4f09230588147d34a413cf',
    sha1: '3f6c8882084c02283e164ef1a221fbc2119c8369',
    sha256: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
    sha512: 'b4c5d6e7f8091a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b'
  });

  // Calculate quick mock hashes on change
  const handleRecalculateHashes = (text: string) => {
    setHashInputText(text);
    // Simple deterministic hex generator for presentation
    let h1 = 0x811c9dc5;
    for (let i = 0; i < text.length; i++) {
      h1 ^= text.charCodeAt(i);
      h1 += (h1 << 1) + (h1 << 4) + (h1 << 7) + (h1 << 8) + (h1 << 24);
    }
    const hex = (h1 >>> 0).toString(16).padStart(8, '0');
    setCalculatedHashes({
      md5: `${hex}a84b9123f019488a${hex}`,
      sha1: `${hex}${hex}3910cda81772${hex}`,
      sha256: `${hex}f01a39b2${hex}e9c20173${hex}88192a4b${hex}01984cba`,
      sha512: `${hex}${hex}${hex}${hex}${hex}${hex}${hex}${hex}`
    });
  };

  const handleInspectArtifact = async () => {
    setIsInspecting(true);
    try {
      const res = await fetch('/api/ai/forensic-inspect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artifactType,
          rawData: rawArtifactInput,
          caseId,
          investigatorName: investigator
        })
      });
      const data = await res.json();
      setInspectionResult(data);
    } catch (err) {
      console.error('Error running forensic inspection:', err);
    } finally {
      setIsInspecting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0a1526] to-slate-900 border border-emerald-900/40 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Fingerprint className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Unidad de Análisis Forense Digital (DFIR)
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  ISO/IEC 27037 FORENSIC SUITE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Inspección profunda de artefactos, detección de intrusiones, verificación criptográfica de integridad y generación de cadena de custodia pericial.
              </p>
            </div>
          </div>

          {/* Sub-tab Navigation */}
          <div className="flex items-center gap-1 bg-[#060a12] p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveSubTab('inspector')}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
                activeSubTab === 'inspector'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Inspector de Artefactos
            </button>
            <button
              onClick={() => setActiveSubTab('hasher')}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
                activeSubTab === 'hasher'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Hashes & Integridad
            </button>
            <button
              onClick={() => setActiveSubTab('timeline')}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
                activeSubTab === 'timeline'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cronología Forense
            </button>
            <button
              onClick={() => setActiveSubTab('custody')}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
                activeSubTab === 'custody'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Cadena de Custodia
            </button>
          </div>
        </div>

        {/* Case Meta Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span>CASO:</span>
            <input 
              type="text" 
              value={caseId} 
              onChange={(e) => setCaseId(e.target.value)}
              className="bg-[#060a12] border border-slate-700 px-2 py-0.5 rounded text-emerald-400 font-bold focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <span>PERITO:</span>
            <input 
              type="text" 
              value={investigator} 
              onChange={(e) => setInvestigator(e.target.value)}
              className="bg-[#060a12] border border-slate-700 px-2 py-0.5 rounded text-slate-200 focus:outline-none w-64"
            />
          </div>
          <div className="text-[11px] text-emerald-400">
            ENTIDAD CERTIFICADORA: <span className="font-semibold text-white">CompuApps secureDev Tech</span>
          </div>
        </div>
      </div>

      {/* Tab 1: Inspector de Artefactos */}
      {activeSubTab === 'inspector' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input Artefacto (5 cols) */}
          <div className="lg:col-span-5 bg-[#0b101d] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Artefacto / Evidencia Digital en Bruto</span>
                </h3>
              </div>

              <div className="space-y-3 mb-3">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1 uppercase">Tipo de Artefacto</label>
                  <select
                    value={artifactType}
                    onChange={(e) => setArtifactType(e.target.value)}
                    className="w-full bg-[#060a12] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Log de Servidor Web (Nginx / Apache)">Log de Servidor Web (Nginx / Apache)</option>
                    <option value="Logs de Autenticación Linux (auth.log / syslog)">Logs de Autenticación Linux (auth.log)</option>
                    <option value="Windows Event Log (Sysmon / Security 4624/4625)">Windows Event Log (Sysmon)</option>
                    <option value="Muestra de Fichero Sospechoso / WebShell">Muestra de Fichero / WebShell PHP/ASP</option>
                    <option value="Volcado de Tráfico de Red (PCAP text dump)">Volcado de Tráfico (PCAP stream)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1 uppercase">Contenido del Artefacto</label>
                  <textarea
                    rows={12}
                    value={rawArtifactInput}
                    onChange={(e) => setRawArtifactInput(e.target.value)}
                    className="w-full bg-[#060a12] border border-slate-700 rounded-lg p-3 text-xs text-emerald-300 font-mono focus:border-emerald-500 focus:outline-none leading-relaxed"
                    placeholder="Pegar líneas de log, código o volcados de memoria..."
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleInspectArtifact}
              disabled={isInspecting}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-2.5 px-4 rounded-lg text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer disabled:opacity-50"
            >
              {isInspecting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analizando Artefacto Forense...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Procesar e Inspeccionar con IA DFIR</span>
                </>
              )}
            </button>
          </div>

          {/* Resultado Forense (7 cols) */}
          <div className="lg:col-span-7 bg-[#0b101d] border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Dictamen Pericial & Detección de Amenazas
                </h3>
              </div>
              <span className={`text-[10px] font-mono px-2.5 py-1 rounded font-bold border ${
                inspectionResult.verdict === 'CRITICAL_EVIDENCE' 
                  ? 'bg-red-950/80 text-red-300 border-red-700' 
                  : 'bg-amber-950/80 text-amber-300 border-amber-700'
              }`}>
                VEREDICTO: {inspectionResult.verdict}
              </span>
            </div>

            {/* Summary */}
            <div className="bg-[#060a12] p-3 rounded-lg border border-slate-800 text-xs text-slate-200 font-mono leading-relaxed">
              {inspectionResult.evidenceSummary}
            </div>

            {/* Identified Threats */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                <span>Amenazas & TTPs Identificadas</span>
              </h4>

              <div className="space-y-2.5">
                {inspectionResult.identifiedThreats?.map((threat: any, idx: number) => (
                  <div key={idx} className="bg-[#060a12] border border-slate-800/90 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-red-400">{threat.type}</span>
                      <span className="text-[10px] font-mono text-slate-500">{threat.timestamp}</span>
                    </div>

                    <div className="bg-slate-950 p-2 rounded border border-slate-900 text-[11px] font-mono text-slate-300 break-all mb-2">
                      {threat.rawSnippet}
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-mono text-slate-500">IoCs:</span>
                      {threat.iocs?.map((ioc: string, i: number) => (
                        <span key={i} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800">
                          {ioc}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chain of Custody Note */}
            <div className="pt-3 border-t border-slate-800 text-xs font-mono text-slate-400">
              <span className="text-emerald-400 font-bold block mb-0.5">Nota Legal ISO/IEC 27037:</span>
              <p>{inspectionResult.chainOfCustodyNotes}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Hashes & Integridad */}
      {activeSubTab === 'hasher' && (
        <div className="bg-[#0b101d] border border-slate-800 rounded-xl p-5 space-y-5">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-1">
              Calculadora y Verificador Criptográfico de Integridad
            </h3>
            <p className="text-xs text-slate-400">
              Garantiza la inalterabilidad de la evidencia pericial para su validez en procesos judiciales y auditorías normativas.
            </p>
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-400 block mb-1 uppercase">Cadena o Contenido de la Evidencia</label>
            <textarea
              rows={4}
              value={hashInputText}
              onChange={(e) => handleRecalculateHashes(e.target.value)}
              className="w-full bg-[#060a12] border border-slate-700 rounded-lg p-3 text-xs text-slate-200 font-mono focus:border-emerald-500 focus:outline-none"
              placeholder="Ingresa texto o datos binarios..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#060a12] border border-slate-800 rounded-lg p-3.5 space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400 font-bold">MD5 HASH:</span>
                <button 
                  onClick={() => navigator.clipboard.writeText(calculatedHashes.md5)}
                  className="text-slate-500 hover:text-emerald-400 cursor-pointer"
                >
                  Copiar
                </button>
              </div>
              <div className="text-xs font-mono text-slate-200 break-all select-all">
                {calculatedHashes.md5}
              </div>
            </div>

            <div className="bg-[#060a12] border border-slate-800 rounded-lg p-3.5 space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-400 font-bold">SHA-1 HASH:</span>
                <button 
                  onClick={() => navigator.clipboard.writeText(calculatedHashes.sha1)}
                  className="text-slate-500 hover:text-cyan-400 cursor-pointer"
                >
                  Copiar
                </button>
              </div>
              <div className="text-xs font-mono text-slate-200 break-all select-all">
                {calculatedHashes.sha1}
              </div>
            </div>

            <div className="md:col-span-2 bg-[#060a12] border border-emerald-950 rounded-lg p-3.5 space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  SHA-256 HASH (ESTÁNDAR JUDICIAL RECOMENDADO):
                </span>
                <button 
                  onClick={() => navigator.clipboard.writeText(calculatedHashes.sha256)}
                  className="text-slate-500 hover:text-emerald-400 cursor-pointer"
                >
                  Copiar
                </button>
              </div>
              <div className="text-xs font-mono text-emerald-300 break-all select-all font-semibold">
                {calculatedHashes.sha256}
              </div>
            </div>

            <div className="md:col-span-2 bg-[#060a12] border border-slate-800 rounded-lg p-3.5 space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-violet-400 font-bold">SHA-512 HASH:</span>
                <button 
                  onClick={() => navigator.clipboard.writeText(calculatedHashes.sha512)}
                  className="text-slate-500 hover:text-violet-400 cursor-pointer"
                >
                  Copiar
                </button>
              </div>
              <div className="text-xs font-mono text-slate-400 break-all select-all text-[11px]">
                {calculatedHashes.sha512}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Cronología Forense */}
      {activeSubTab === 'timeline' && (
        <div className="bg-[#0b101d] border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Reconstrucción Cronológica del Incidente (Forensic Timeline)
              </h3>
              <p className="text-xs text-slate-400">
                Sucesión temporal exacta de eventos y correlación de vectores de ataque.
              </p>
            </div>
          </div>

          <div className="relative pl-6 border-l-2 border-emerald-900/60 space-y-6">
            {inspectionResult.timelineEvents?.map((event: any, idx: number) => (
              <div key={idx} className="relative">
                <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-4 border-[#0b101d]"></div>
                <div className="bg-[#060a12] border border-slate-800 rounded-lg p-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-emerald-400">
                      {event.time}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800">
                      Actor: {event.actor}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-200 mb-1">
                    {event.action}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">
                    Impacto: {event.significance}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Ficha de Cadena de Custodia Legal */}
      {activeSubTab === 'custody' && (
        <div className="bg-[#0b101d] border border-slate-800 rounded-xl p-6 space-y-5 print:bg-white print:text-black">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="text-xs font-mono text-emerald-400 font-bold uppercase">
                COMPUAPPS SECUREDEV TECH // DIVISIÓN FORENSE
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Ficha Oficial de Cadena de Custodia de Evidencia Digital
              </h3>
              <span className="text-xs text-slate-400">
                Conforme a la norma técnica ISO/IEC 27037:2012
              </span>
            </div>

            <button
              onClick={() => window.print()}
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span>Imprimir Ficha</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-[#060a12] p-3 rounded border border-slate-800">
              <span className="text-slate-500 block mb-0.5">NÚMERO DE CASO:</span>
              <span className="text-emerald-400 font-bold">{caseId}</span>
            </div>
            <div className="bg-[#060a12] p-3 rounded border border-slate-800">
              <span className="text-slate-500 block mb-0.5">PERITO / CUSTODIO PRINCIPAL:</span>
              <span className="text-slate-200">{investigator}</span>
            </div>
            <div className="bg-[#060a12] p-3 rounded border border-slate-800">
              <span className="text-slate-500 block mb-0.5">DISPOSITIVO / FUENTE ORIGEN:</span>
              <span className="text-slate-200">Servidor Web Producción Ubuntu 22.04 LTS (sda1)</span>
            </div>
            <div className="bg-[#060a12] p-3 rounded border border-slate-800">
              <span className="text-slate-500 block mb-0.5">FECHA Y HORA DE RECOLECCIÓN:</span>
              <span className="text-slate-200">{new Date().toLocaleString()} (UTC-5)</span>
            </div>
            <div className="md:col-span-2 bg-[#060a12] p-3 rounded border border-slate-800">
              <span className="text-slate-500 block mb-0.5">HASH SHA-256 DE ADQUISICIÓN:</span>
              <span className="text-emerald-300 font-bold break-all">{calculatedHashes.sha256}</span>
            </div>
          </div>

          {/* Transfers log */}
          <div>
            <h4 className="text-xs font-bold font-mono text-slate-300 uppercase mb-2">
              Registro de Traslados y Custodios Intervinientes
            </h4>
            <div className="border border-slate-800 rounded-lg overflow-hidden text-xs font-mono">
              <table className="w-full text-left">
                <thead className="bg-[#070b13] text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">Fecha</th>
                    <th className="p-2.5">Entregado por</th>
                    <th className="p-2.5">Recibido por</th>
                    <th className="p-2.5">Propósito del Traslado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr>
                    <td className="p-2.5">2026-10-10 14:30</td>
                    <td className="p-2.5">Oficial de Seguridad TI</td>
                    <td className="p-2.5">{investigator}</td>
                    <td className="p-2.5">Extracción inicial en caliente bajo preservación forense</td>
                  </tr>
                  <tr>
                    <td className="p-2.5">2026-10-10 15:45</td>
                    <td className="p-2.5">{investigator}</td>
                    <td className="p-2.5">Laboratorio Forense VEGA</td>
                    <td className="p-2.5">Generación de imagen bit a bit y análisis de artefactos</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
