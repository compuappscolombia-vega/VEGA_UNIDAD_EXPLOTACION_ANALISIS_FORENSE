export type ModuleTab = 
  | 'vulnerability_radar' 
  | 'ai_pentest' 
  | 'script_forge' 
  | 'forensic_suite' 
  | 'multimedia_lab' 
  | 'geo_maps_intel'
  | 'mitre_matrix' 
  | 'audit_reports'
  | 'audit_logs'
  | 'operator_management'
  | 'deploy_export';

export type UserMode = 'guided' | 'expert';

export interface OperatorSession {
  isAuthenticated: boolean;
  operatorId: string;
  fullName?: string;
  role: 'AUDITOR_CHIEF' | 'SECURITY_ENGINEER' | 'FORENSIC_EXPERT';
  isCEO?: boolean;
  token?: string;
  loginTime: string;
}

export interface StoredOperator {
  operatorId: string;
  fullName: string;
  role: 'AUDITOR_CHIEF' | 'SECURITY_ENGINEER' | 'FORENSIC_EXPERT';
  isCEO: boolean;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  lastLogin: string | null;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  operatorId: string;
  role: string;
  actionType: 'AUTH' | 'SCAN' | 'AI_ANALYSIS' | 'SCRIPT_FORGE' | 'FORENSICS' | 'REPORT' | 'SYSTEM' | 'DOWNLOAD';
  actionDetail: string;
  target?: string;
  severity: 'INFO' | 'NOTICE' | 'WARNING' | 'CRITICAL';
  entryHash: string;
  previousHash: string;
}

export interface TargetProfile {
  id: string;
  name: string;
  ipOrHost: string;
  scopeType: 'authorized_external' | 'authorized_internal' | 'cloud_infrastructure' | 'web_application';
  osGuessed: string;
  openPorts: number[];
  services: { port: number; service: string; version: string; status: 'open' | 'filtered' }[];
  status: 'idle' | 'scanning' | 'analyzed';
}

export interface CveItem {
  id: string;
  cveId: string;
  title: string;
  description: string;
  cvss: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  affectedComponent: string;
  exploitAvailable: boolean;
  mitreTactic: string;
  remediation: string;
  vector: string;
}

export interface GeneratedScript {
  scriptName: string;
  language: 'Python' | 'Bash' | 'PowerShell' | 'Go';
  toolType: string;
  code: string;
  instructions: string;
  mitreRef: string;
  defenseWarning: string;
  timestamp: string;
}

export interface ForensicArtifact {
  id: string;
  caseId: string;
  filename: string;
  type: 'log' | 'memory_dump' | 'pcap' | 'payload_sample' | 'executable';
  sha256: string;
  md5: string;
  collectedAt: string;
  investigator: string;
  verdict: 'BENIGN' | 'SUSPICIOUS' | 'MALICIOUS' | 'CRITICAL_EVIDENCE';
  details: string;
}

export interface TimelineEvent {
  id: string;
  time: string;
  actor: string;
  action: string;
  significance: string;
  category: 'recon' | 'initial_access' | 'execution' | 'persistence' | 'exfil';
}

export interface ChainOfCustody {
  caseNumber: string;
  organization: string;
  leadInvestigator: string;
  evidenceId: string;
  itemDescription: string;
  sourceDevice: string;
  collectionLocation: string;
  hashSha256: string;
  hashMd5: string;
  transfers: {
    date: string;
    releasedBy: string;
    receivedBy: string;
    purpose: string;
  }[];
}
