import { CveItem } from '../types/vega';

export const INITIAL_CVES: CveItem[] = [
  {
    id: 'cve-1',
    cveId: 'CVE-2024-3400',
    title: 'Palo Alto PAN-OS Command Injection Vulnerability',
    description: 'Inyección de comandos en la funcionalidad GlobalProtect de PAN-OS que permite a atacantes no autenticados ejecutar código arbitrario con privilegios de root.',
    cvss: 10.0,
    severity: 'CRITICAL',
    affectedComponent: 'Palo Alto PAN-OS 10.2 / 11.0 / 11.1',
    exploitAvailable: true,
    mitreTactic: 'T1190 - Exploit Public-Facing Application',
    remediation: 'Aplicar hotfix oficial del fabricante y desactivar telemetría de dispositivo temporalmente.',
    vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H'
  },
  {
    id: 'cve-2',
    cveId: 'CVE-2024-21887',
    title: 'Ivanti Connect Secure Command Injection',
    description: 'Vulnerabilidad de inyección de comandos en componentes web de Ivanti Connect Secure y Policy Secure permitiendo RCE sin autenticación.',
    cvss: 9.1,
    severity: 'CRITICAL',
    affectedComponent: 'Ivanti Connect Secure 9.x / 22.x',
    exploitAvailable: true,
    mitreTactic: 'T1059.004 - Unix Shell Command Execution',
    remediation: 'Descargar e importar el paquete de mitigación XML provisto por Ivanti y rotar secretos.',
    vector: 'CVSS:3.1/AV:N/AC:L/PR:H/UI:N/S:C/C:H/I:H/A:H'
  },
  {
    id: 'cve-3',
    cveId: 'CVE-2023-46604',
    title: 'Apache ActiveMQ Insecure Deserialization RCE',
    description: 'Deserialización insegura de datos no confiables en OpenWire protocol permitiendo ejecución remota de código en brokers ActiveMQ.',
    cvss: 9.8,
    severity: 'CRITICAL',
    affectedComponent: 'Apache ActiveMQ < 5.15.16',
    exploitAvailable: true,
    mitreTactic: 'T1203 - Exploitation for Client Execution',
    remediation: 'Actualizar ActiveMQ a la versión 5.15.16, 5.16.7 o 5.18.3.',
    vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H'
  },
  {
    id: 'cve-4',
    cveId: 'CVE-2023-38606',
    title: 'Apple iOS/macOS Kernel Memory Manipulation (Operation Triangulation)',
    description: 'Manipulación de registros MMIO del kernel para saltar protecciones de integridad de memoria sin interacción del usuario.',
    cvss: 8.8,
    severity: 'HIGH',
    affectedComponent: 'Apple iOS < 16.6, macOS Ventura < 13.5',
    exploitAvailable: true,
    mitreTactic: 'T1068 - Exploitation for Privilege Escalation',
    remediation: 'Actualizar sistemas operativos a las versiones securizadas de Apple.',
    vector: 'CVSS:3.1/AV:L/AC:L/PR:L/UI:N/S:C/C:H/I:H/A:H'
  },
  {
    id: 'cve-5',
    cveId: 'CVE-2024-4577',
    title: 'PHP-CGI Windows Argument Injection RCE',
    description: 'Regla de conversión de mejores ajustes en Windows que permite a atacantes eludir la protección CVE-2012-1823 mediante inyección de argumentos en PHP-CGI.',
    cvss: 9.8,
    severity: 'CRITICAL',
    affectedComponent: 'PHP 8.1.*, 8.2.*, 8.3.* on Windows Apache',
    exploitAvailable: true,
    mitreTactic: 'T1190 - Exploit Public-Facing Application',
    remediation: 'Actualizar PHP a 8.1.29, 8.2.20 o 8.3.8, o agregar reglas mod_rewrite en Apache.',
    vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H'
  },
  {
    id: 'cve-6',
    cveId: 'CVE-2024-6387',
    title: 'regreSSHion: OpenSSH Remote Unauthenticated Code Execution',
    description: 'Condición de carrera en el manejador de señales (SIGALRM) de sshd en sistemas Linux basados en glibc permitiendo RCE sin autenticación.',
    cvss: 8.1,
    severity: 'HIGH',
    affectedComponent: 'OpenSSH 8.5p1 a 9.7p1',
    exploitAvailable: true,
    mitreTactic: 'T1210 - Exploitation of Remote Services',
    remediation: 'Actualizar OpenSSH a versión 9.8p1 o posterior, o configurar LoginGraceTime en 0.',
    vector: 'CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:H'
  }
];

export const MITRE_TACTICS_DATA = [
  {
    tactic: 'TA0001 - Initial Access',
    name: 'Acceso Inicial',
    color: 'blue',
    techniques: [
      { id: 'T1190', name: 'Exploit Public-Facing Application', description: 'Explotación de fallos en software expuesto a internet (Apache, Nginx, VPNs).', detection: 'WAF logs, IDS alerts, core dump inspect.' },
      { id: 'T1133', name: 'External Remote Services', description: 'Acceso mediante VPN, Citrix o RDP expuestos con credenciales filtradas.', detection: 'MFA logs, conexiones desde IPs anómalas.' },
      { id: 'T1566', name: 'Phishing con Simulación Autorizada', description: 'Campañas dirigidas para auditoría de concientización y entrega de cargas.', detection: 'Cabeceras SPF/DKIM/DMARC y registros EDR.' }
    ]
  },
  {
    tactic: 'TA0002 - Execution',
    name: 'Ejecución',
    color: 'cyan',
    techniques: [
      { id: 'T1059.001', name: 'PowerShell Execution', description: 'Ejecución de scripts ofuscados sin escribir en disco (in-memory).', detection: 'Script Block Logging (Event 4104), AMSI events.' },
      { id: 'T1059.004', name: 'Unix Shell & Bash', description: 'Invocación de reverse shells mediante /dev/tcp o sockets POSIX.', detection: 'Auditd execve, auditd socket tracing.' },
      { id: 'T1203', name: 'Exploitation for Client Execution', description: 'Explotación de vulnerabilidades en analizadores de documentos o navegadores.', detection: 'Monitoreo de procesos hijos de soffice, acrobat o chrome.' }
    ]
  },
  {
    tactic: 'TA0003 - Persistence',
    name: 'Persistencia',
    color: 'amber',
    techniques: [
      { id: 'T1053', name: 'Scheduled Task / Cron Job', description: 'Mantenimiento de acceso tras reinicios del sistema mediante cron o tareas programadas.', detection: 'Monitoreo de /etc/cron.* y Event ID 4698.' },
      { id: 'T1547.001', name: 'Registry Run Keys / Startup Folder', description: 'Persistencia en Windows modificando claves HKCU/HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run.', detection: 'Sysmon Event ID 12 y 13.' }
    ]
  },
  {
    tactic: 'TA0004 - Privilege Escalation',
    name: 'Elevación de Privilegios',
    color: 'rose',
    techniques: [
      { id: 'T1068', name: 'Exploitation for Privilege Escalation', description: 'Aprovechamiento de vulnerabilidades en el kernel (Dirty COW, PwnKit, eBPF).', detection: 'Monitoreo de cambios UID/GID a 0.' },
      { id: 'T1548.003', name: 'Sudo and Sudo Caching', description: 'Abuso de binarios con permisos sudo mal configurados (GTFOBins).', detection: 'Auth.log: sudo COMMAND executed by user.' }
    ]
  },
  {
    tactic: 'TA0005 - Defense Evasion',
    name: 'Evasión de Defensas',
    color: 'violet',
    techniques: [
      { id: 'T1027', name: 'Obfuscated / Encrypted Information', description: 'Codificación multinivel en Base64, compresión gzip y XOR dinámico.', detection: 'Cálculo de entropía de ficheros y reglas YARA.' },
      { id: 'T1562.001', name: 'Disable or Modify Security Tools', description: 'Suspensión temporal de telemetría de agentes EDR/antivirus.', detection: 'Alertas de Heartbeat caídas y Event ID 7036.' }
    ]
  },
  {
    tactic: 'TA0006 - Exfiltration',
    name: 'Exfiltración',
    color: 'indigo',
    techniques: [
      { id: 'T1048.003', name: 'Exfiltration Over Alternative Protocol (DNS/ICMP)', description: 'Canalización de datos confidenciales en consultas DNS subterráneas o payloads ICMP echo.', detection: 'Volumen anormal de peticiones DNS con alta entropía.' },
      { id: 'T1567', name: 'Exfiltration Over Web Service', description: 'Envío de artefactos cifrados hacia almacenes cloud legítimos.', detection: 'Monitoreo de tráfico saliente a dominios S3 o Blob Storage.' }
    ]
  }
];
