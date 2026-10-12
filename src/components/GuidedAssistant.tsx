import React, { useState } from 'react';
import { 
  Compass, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight, 
  Search, 
  Cpu, 
  FileCode2, 
  Fingerprint, 
  FileText, 
  BookOpen, 
  AlertTriangle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Video
} from 'lucide-react';
import { ModuleTab } from '../types/vega';

interface GuidedAssistantProps {
  onNavigateTab: (tab: ModuleTab) => void;
  activeTab: ModuleTab;
}

export const GuidedAssistant: React.FC<GuidedAssistantProps> = ({ onNavigateTab, activeTab }) => {
  const [showGlossary, setShowGlossary] = useState(false);

  const steps = [
    {
      num: 1,
      id: 'vulnerability_radar' as ModuleTab,
      title: 'Paso 1: Explorar Objetivo (Escaneo)',
      desc: 'Descubre qué puertas y servicios tiene abiertos el sistema y si existen fallas conocidas (CVEs).',
      actionLabel: 'Abrir Escáner de Vulnerabilidades',
      icon: <Search className="w-4 h-4 text-cyan-400" />
    },
    {
      num: 2,
      id: 'ai_pentest' as ModuleTab,
      title: 'Paso 2: Diagnóstico con Inteligencia Artificial',
      desc: 'La IA analiza la información y calcula qué tan vulnerable es el sistema y vectores de ataque.',
      actionLabel: 'Consultar Diagnóstico de IA',
      icon: <Cpu className="w-4 h-4 text-blue-400" />
    },
    {
      num: 3,
      id: 'script_forge' as ModuleTab,
      title: 'Paso 3: Probar con Scripts Reales',
      desc: 'Genera herramientas a medida (Python, Bash, PowerShell) para comprobar la explotación.',
      actionLabel: 'Crear Scripts de Prueba',
      icon: <FileCode2 className="w-4 h-4 text-amber-400" />
    },
    {
      num: 4,
      id: 'forensic_suite' as ModuleTab,
      title: 'Paso 4: Análisis Forense & DFIR',
      desc: 'Inspección de artefactos, timeline de intrusión y hashes SHA-256 con validez legal.',
      actionLabel: 'Ver Unidad Forense',
      icon: <Fingerprint className="w-4 h-4 text-violet-400" />
    },
    {
      num: 5,
      id: 'multimedia_lab' as ModuleTab,
      title: 'Paso 5: Laboratorio Multimedia con IA',
      desc: 'Módulos dedicados para transcripción de interceptaciones, generación de imágenes y síntesis de video.',
      actionLabel: 'Abrir Lab Multimedia',
      icon: <Video className="w-4 h-4 text-sky-400" />
    },
    {
      num: 6,
      id: 'audit_logs' as ModuleTab,
      title: 'Paso 6: Bitácora Central (Audit Log)',
      desc: 'Registro inmutable con hashes SHA-256 encadenados de cada acción de los operadores.',
      actionLabel: 'Ver Bitácora Forense',
      icon: <ShieldCheck className="w-4 h-4 text-blue-400" />
    },
    {
      num: 7,
      id: 'audit_reports' as ModuleTab,
      title: 'Paso 7: Emitir Reporte Formal',
      desc: 'Genera el informe pericial ejecutivo para el cliente con resumen de riesgo y mitigación.',
      actionLabel: 'Generar Reporte Formal',
      icon: <FileText className="w-4 h-4 text-cyan-400" />
    }
  ];

  const glossaryItems = [
    {
      term: 'Bitácora Forense (Audit Trail / Hash Chaining)',
      explanation: 'Es un registro inmutable donde cada acción del operador se firma con una cadena de hashes SHA-256 (similar a una blockchain). Sirve como prueba jurídica de qué se hizo, cuándo y por qué operador, bajo la norma ISO/IEC 27037.'
    },
    {
      term: 'CVE (Common Vulnerabilities and Exposures)',
      explanation: 'Es el código internacional único que identifica una falla de seguridad en un programa (por ejemplo, CVE-2024-3400). Permite saber qué versión del software tiene el error.'
    },
    {
      term: 'CVSS (Puntaje de Severidad)',
      explanation: 'Una calificación del 0.0 al 10.0 que indica la gravedad. De 0 a 3.9 es Bajo, de 4.0 a 6.9 es Medio, de 7.0 a 8.9 es Alto, y de 9.0 a 10.0 es Crítico (requiere atención inmediata).'
    },
    {
      term: 'Hash SHA-256 (Huella Digital Criptográfica)',
      explanation: 'Es un código único generado matemáticamente a partir de un archivo. Si alguien cambia siquiera una letra del archivo, el hash cambia por completo. Se usa en juicios y peritajes para demostrar que la evidencia no fue manipulada.'
    },
    {
      term: 'Pentesting Ético (Prueba de Penetración Autorizada)',
      explanation: 'Es una auditoría donde expertos simulan un ataque con permiso formal del cliente para encontrar los puntos débiles antes de que un atacante malicioso los aproveche.'
    },
    {
      term: 'MITRE ATT&CK',
      explanation: 'Es la enciclopedia mundial de tácticas y técnicas que usan los hackers reales. Ayuda a saber cómo atacan y cómo configurar las defensas para detectarlos.'
    }
  ];

  return (
    <div className="bg-gradient-to-r from-[#0d1627] via-[#09121f] to-[#0d1627] border border-cyan-800/40 rounded-xl p-4 sm:p-5 shadow-lg mb-6 text-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Modo Guiado Paso a Paso (Para Todo Usuario)
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                ASISTENTE VEGA
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Sigue estos 7 pasos guiados para realizar una auditoría de seguridad, análisis forense pericial y generación multimedia con IA.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowGlossary(!showGlossary)}
          className="text-xs font-mono text-cyan-300 bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-800/60 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>{showGlossary ? 'Ocultar Glosario' : '¿No entiendes los términos? Ver Glosario'}</span>
          {showGlossary ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* 7 Guided Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-7 gap-3 mt-4">
        {steps.map((st) => {
          const isCurrent = activeTab === st.id;
          return (
            <div 
              key={st.num}
              onClick={() => onNavigateTab(st.id)}
              className={`p-3 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                isCurrent
                  ? 'bg-cyan-950/40 border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/50'
                  : 'bg-[#060a12]/80 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                    isCurrent ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    PASO {st.num}
                  </span>
                  {st.icon}
                </div>
                <h4 className="text-xs font-bold text-white mb-1 leading-tight">
                  {st.title}
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                  {st.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-cyan-400 font-semibold">
                <span>{isCurrent ? 'Paso Activo' : 'Ir a este paso'}</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Expandable Glossary */}
      {showGlossary && (
        <div className="mt-4 pt-4 border-t border-slate-800 animate-fadeIn">
          <h4 className="text-xs font-bold text-cyan-300 font-mono uppercase mb-3 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Glosario Básico de Ciberseguridad en Lenguaje Claro</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {glossaryItems.map((item, i) => (
              <div key={i} className="bg-[#060a12] border border-slate-800 p-3 rounded-lg text-xs">
                <span className="font-bold text-cyan-400 block mb-1 font-mono">
                  {item.term}
                </span>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  {item.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
