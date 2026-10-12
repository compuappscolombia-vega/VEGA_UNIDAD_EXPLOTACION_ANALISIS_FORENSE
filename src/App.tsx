import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { VulnerabilityRadar } from './components/VulnerabilityRadar';
import { TacticalAiPentest } from './components/TacticalAiPentest';
import { ScriptForge } from './components/ScriptForge';
import { ForensicSuite } from './components/ForensicSuite';
import { MitreMatrix } from './components/MitreMatrix';
import { AuditReporter } from './components/AuditReporter';
import { DeployExportCenter } from './components/DeployExportCenter';
import { AccessControlGate } from './components/AccessControlGate';
import { GuidedAssistant } from './components/GuidedAssistant';
import { AuditLogViewer } from './components/AuditLogViewer';
import { MultimediaAiLab } from './components/MultimediaAiLab';
import { GeoMapsIntel } from './components/GeoMapsIntel';
import { OperatorManagementPanel } from './components/OperatorManagementPanel';
import { ModuleTab, TargetProfile, CveItem, OperatorSession, UserMode } from './types/vega';
import { ShieldAlert, Terminal, Lock, Activity } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ModuleTab>('vulnerability_radar');
  const [userMode, setUserMode] = useState<UserMode>('guided');
  const [systemStatus, setSystemStatus] = useState('ONLINE');
  const [isAiActive, setIsAiActive] = useState(false);
  const [stagedTarget, setStagedTarget] = useState<TargetProfile | null>(null);
  const [stagedCve, setStagedCve] = useState<CveItem | null>(null);
  const [forgeObjective, setForgeObjective] = useState<string>('');
  const [forgeToolType, setForgeToolType] = useState<string>('');

  // Operator Authentication State
  const [operatorSession, setOperatorSession] = useState<OperatorSession | null>(() => {
    try {
      const saved = localStorage.getItem('vega_operator_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleLogin = (session: OperatorSession) => {
    setOperatorSession(session);
    // Send audit log event for successful authentication
    fetch('/api/audit-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        operatorId: session.operatorId,
        role: session.role,
        actionType: 'AUTH',
        actionDetail: `Autenticación exitosa del operador ${session.operatorId} en terminal VEGA con rol ${session.role}.`,
        severity: 'INFO'
      })
    }).catch(() => {});
  };

  const handleLogout = () => {
    if (operatorSession) {
      fetch('/api/audit-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operatorId: operatorSession.operatorId,
          role: operatorSession.role,
          actionType: 'AUTH',
          actionDetail: `Cierre de sesión y bloqueo de terminal VEGA ejecutado por ${operatorSession.operatorId}.`,
          severity: 'NOTICE'
        })
      }).catch(() => {});
    }
    localStorage.removeItem('vega_operator_session');
    setOperatorSession(null);
  };

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

  // Enforce Access Control Gate if not authenticated
  if (!operatorSession || !operatorSession.isAuthenticated) {
    return <AccessControlGate onAuthenticate={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans cyber-grid">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        systemStatus={systemStatus}
        isAiActive={isAiActive}
        operatorSession={operatorSession}
        onLogout={handleLogout}
        userMode={userMode}
        setUserMode={setUserMode}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Guided Assistant Walkthrough shown when userMode is 'guided' */}
        {userMode === 'guided' && (
          <GuidedAssistant 
            onNavigateTab={(tab) => setActiveTab(tab)} 
            activeTab={activeTab} 
          />
        )}

        {activeTab === 'vulnerability_radar' && (
          <VulnerabilityRadar 
            onSendToAiPentest={handleSendToAiPentest} 
            onOpenGeoMaps={(query) => {
              setForgeObjective(query);
              setActiveTab('geo_maps_intel');
            }}
          />
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

        {activeTab === 'multimedia_lab' && (
          <MultimediaAiLab operatorSession={operatorSession} />
        )}

        {activeTab === 'geo_maps_intel' && (
          <GeoMapsIntel 
            operatorSession={operatorSession} 
            defaultQuery={stagedTarget ? stagedTarget.ipOrHost : ''} 
          />
        )}

        {activeTab === 'operator_management' && (
          <OperatorManagementPanel operatorSession={operatorSession} />
        )}

        {activeTab === 'audit_logs' && (
          <AuditLogViewer operatorSession={operatorSession} />
        )}

        {activeTab === 'mitre_matrix' && (
          <MitreMatrix 
            onSelectTechniqueForForge={handleSelectTechniqueForForge}
          />
        )}

        {activeTab === 'audit_reports' && (
          <AuditReporter />
        )}

        {activeTab === 'deploy_export' && (
          <DeployExportCenter />
        )}
      </main>

      {/* Cyber Security HUD Footer */}
      <footer className="border-t border-slate-800/80 bg-[#060a12]/90 backdrop-blur text-xs font-mono text-slate-500 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span className="text-slate-400 font-semibold">VEGA: UNIDAD DE EXPLOTACIÓN Y ANÁLISIS FORENSE</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-500">CompuApps secureDev Tech</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-blue-400 font-semibold">PENTESTING ÉTICO AUTORIZADO</span>
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
