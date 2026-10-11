import React, { useState } from 'react';
import { 
  Layers, 
  Terminal, 
  ShieldCheck, 
  ChevronRight, 
  Search, 
  Sparkles, 
  FileCode2,
  AlertTriangle
} from 'lucide-react';
import { MITRE_TACTICS_DATA } from '../data/cveDatabase';

interface MitreMatrixProps {
  onSelectTechniqueForForge: (techniqueName: string) => void;
}

export const MitreMatrix: React.FC<MitreMatrixProps> = ({ onSelectTechniqueForForge }) => {
  const [selectedTechnique, setSelectedTechnique] = useState<any>(MITRE_TACTICS_DATA[0].techniques[0]);
  const [activeTacticName, setActiveTacticName] = useState<string>(MITRE_TACTICS_DATA[0].tactic);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0e1628] to-slate-900 border border-emerald-900/40 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold tracking-wide uppercase mb-1">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>MARCO TÁCTICO MITRE ATT&CK® ENTERPRISE</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Matriz de Tácticas y Técnicas Ofensivas
            </h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-2xl mt-1">
              Mapeo de procedimientos adversarios para pruebas de penetración autorizadas y reglas de detección correlacionadas para analistas forenses.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar técnica (T1190, Shell...)"
              className="bg-[#060a12] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Interactive Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {MITRE_TACTICS_DATA.map((col) => (
          <div key={col.tactic} className="bg-[#0b101d] border border-slate-800 rounded-xl p-3 flex flex-col">
            <div className="pb-2 mb-2 border-b border-slate-800">
              <span className="text-[10px] font-mono text-emerald-400 block font-semibold truncate">
                {col.tactic.split(' - ')[0]}
              </span>
              <h3 className="text-xs font-bold text-white tracking-tight truncate">
                {col.name}
              </h3>
            </div>

            <div className="space-y-1.5 flex-1">
              {col.techniques
                .filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.id.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((t) => {
                  const isSelected = selectedTechnique?.id === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        setSelectedTechnique(t);
                        setActiveTacticName(col.tactic);
                      }}
                      className={`w-full text-left p-2 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.15)] font-semibold'
                          : 'bg-[#060a12] text-slate-300 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                        <span className="text-cyan-400 font-bold">{t.id}</span>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
                      </div>
                      <div className="line-clamp-2 leading-tight">
                        {t.name}
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Technique Deep Dive Inspector */}
      {selectedTechnique && (
        <div className="bg-[#0b101d] border border-emerald-950 rounded-xl p-5 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  {selectedTechnique.id}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {activeTacticName}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                {selectedTechnique.name}
              </h3>
            </div>

            <button
              onClick={() => onSelectTechniqueForForge(selectedTechnique.name)}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs font-mono flex items-center gap-2 transition-all cursor-pointer self-start md:self-auto"
            >
              <FileCode2 className="w-4 h-4" />
              <span>Forjar Script PoC para esta Técnica</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-[#060a12] p-4 rounded-lg border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Descripción Técnica & Procedimiento de Ataque</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-mono">
                {selectedTechnique.description}
              </p>
              <div className="pt-2 text-[11px] font-mono text-slate-400">
                <span className="text-slate-500 block">Objetivo del Ejercicio Red Team:</span>
                Comprobar si los controles preventivos y perimetrales bloquean la invocación de este vector en la fase de auditoría autorizada.
              </div>
            </div>

            <div className="bg-[#060a12] p-4 rounded-lg border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Estrategia de Detección & Telemetría Forense (DFIR)</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-mono">
                {selectedTechnique.detection}
              </p>
              <div className="pt-2 text-[11px] font-mono text-slate-400">
                <span className="text-slate-500 block">Fuentes de Datos Recomendadas:</span>
                Registros de auditoría de procesos del sistema operativo, telemetría EDR/XDR, logs de proxy web y eventos de firewall.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
