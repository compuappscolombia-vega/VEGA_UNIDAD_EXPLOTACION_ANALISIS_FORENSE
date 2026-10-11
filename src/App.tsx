import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { VulnerabilityRadar } from './components/VulnerabilityRadar';
import { TacticalAiPentest } from './components/TacticalAiPentest';
import { ScriptForge } from './components/ScriptForge';
import { ForensicSuite } from './components/ForensicSuite';
import { MitreMatrix } from './components/MitreMatrix';
import { AuditReporter } from './components/AuditReporter';
import { ModuleTab, TargetProfile, CveItem } from './types/vega';
import { ShieldAlert, Terminal, Lock, Activity } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ModuleTab>('vulnerability_radar');
  const [systemStatus, setSystemStatus] = useState('ONLINE');
  const [isAiActive, setIsAiActive] = useState(false);
  const [stagedTarget, setStagedTarget] = useState<TargetProfile | null>(null);
  const [stagedCve, setStagedCve] = useState<CveItem | null>(null);
  const [forgeObjective, setForgeObjective] = useState<string>('');
  const [forgeToolType, setForgeToolType] = useState<string>('');

  useEffect(() => {
    // Check engine status
    fetch('/api/status')
      .then(res => res.json())
      .then(data => {
        setSystemStatus(data.status || 'ONLINE');
        setIsAiActive(Boolean(data.aiEngineAvailable));
      })
      .catch(() => {
        setSystemStatus('OFFLINE_FALLBACK');
        setIsAiActive(false);
      });
  }, []);

  const handleSendToAiPentest = (target: TargetProfile, cve?: CveItem) => {
    setStagedTarget(target);
    if (cve) setStagedCve(cve);
    setActiveTab('ai_pentest');
  };

  const handleNavigateToScriptForge = (objective: string, toolType: string) => {
    setForgeObjective(objective);
    setForgeToolType(toolType);
    setActiveTab('script_forge');
  };

  const handleSelectTechniqueForForge = (techniqueName: string) => {
    setForgeObjective(`PoC automatizado para técnica ${techniqueName}`);
    setForgeToolType('Exploit PoC Web Inyecciones (SQLi/RCE)');
    setActiveTab('script_forge');
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans cyber-grid">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        systemStatus={systemStatus}
        isAiActive={isAiActive}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'vulnerability_radar' && (
          <VulnerabilityRadar onSendToAiPentest={handleSendToAiPentest} />
        )}

        {activeTab === 'ai_pentest' && (
          <TacticalAiPentest 
            initialTarget={stagedTarget}
            selectedCve={stagedCve}
            onNavigateToScriptForge={handleNavigateToScriptForge}
          />
        )}

        {activeTab === 'script_forge' && (
          <ScriptForge 
            prefilledObjective={forgeObjective}
            prefilledToolType={forgeToolType}
          />
        )}

        {activeTab === 'forensic_suite' && (
          <ForensicSuite />
        )}

        {activeTab === 'mitre_matrix' && (
          <MitreMatrix 
            onSelectTechniqueForForge={handleSelectTechniqueForForge}
          />
        )}

        {activeTab === 'audit_reports' && (
          <AuditReporter />
        )}
      </main>

      {/* Cyber Security HUD Footer */}
      <footer className="border-t border-slate-800/80 bg-[#060a12]/90 backdrop-blur text-xs font-mono text-slate-500 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-slate-400 font-semibold">VEGA: UNIDAD DE EXPLOTACIÓN Y ANÁLISIS FORENSE</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-500">CompuApps secureDev Tech</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-emerald-400">PENTESTING ÉTICO AUTORIZADO</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">ANÁLISIS FORENSE DFIR</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-400">MITRE ATT&CK® COMPLIANT</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
