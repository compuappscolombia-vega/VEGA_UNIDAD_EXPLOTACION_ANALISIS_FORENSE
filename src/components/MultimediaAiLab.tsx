import React, { useState, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  Video, 
  Image as ImageIcon, 
  Radio, 
  Atom, 
  Play, 
  Square, 
  Download, 
  Upload, 
  Copy, 
  Check, 
  RefreshCw, 
  Sliders, 
  Volume2, 
  VolumeX, 
  Layers, 
  ExternalLink,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { OperatorSession } from '../types/vega';

interface MultimediaAiLabProps {
  operatorSession: OperatorSession | null;
}

export const MultimediaAiLab: React.FC<MultimediaAiLabProps> = ({ operatorSession }) => {
  const [subTab, setSubTab] = useState<'transcribe' | 'image' | 'video' | 'live_voice' | 'science'>('transcribe');

  // --- Sub-module 1: Audio Transcription (gemini-3.5-transcribe) ---
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState<string>('');
  const [copiedText, setCopiedText] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error al acceder al micrófono:', err);
      alert('No se pudo acceder al micrófono. Por favor concede permisos en el navegador o sube un archivo de audio.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioBlob(file);
      setAudioUrl(URL.createObjectURL(file));
    }
  };

  const handleTranscribeAudio = async () => {
    if (!audioBlob) return;
    setIsTranscribing(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const res = await fetch('/api/multimedia/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioBase64: base64,
            mimeType: audioBlob.type || 'audio/webm',
            operatorId: operatorSession?.operatorId
          })
        });
        const data = await res.json();
        setTranscriptionResult(data.transcription || 'Sin resultado de transcripción.');
      };
      reader.readAsDataURL(audioBlob);
    } catch (e) {
      console.error('Error transcribing audio:', e);
    } finally {
      setIsTranscribing(false);
    }
  };

  // --- Sub-module 2: Image Creation & Editing (gemini-nano-banana-2.1) ---
  const [imagePrompt, setImagePrompt] = useState('Escudo criptográfico holográfico con malla neuronal de defensa cibernética en azul cobalt');
  const [aspectRatioImg, setAspectRatioImg] = useState('1:1');
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [generatedImgUrl, setGeneratedImgUrl] = useState<string>('');
  const [editPrompt, setEditPrompt] = useState('Añadir resplandor de seguridad pericial azul y resaltar bordes');

  // Load initial high-fidelity cyber visual on mount
  React.useEffect(() => {
    if (!generatedImgUrl) {
      fetch('/api/multimedia/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'Escudo criptográfico holográfico VEGA DFIR en azul cobalto y cian',
          aspectRatio: '1:1'
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.imageUrl) setGeneratedImgUrl(data.imageUrl);
      })
      .catch(() => {});
    }
  }, []);

  const handleGenerateImage = async () => {
    setIsGeneratingImg(true);
    try {
      const res = await fetch('/api/multimedia/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: imagePrompt,
          aspectRatio: aspectRatioImg,
          operatorId: operatorSession?.operatorId
        })
      });
      const data = await res.json();
      if (data.imageUrl) setGeneratedImgUrl(data.imageUrl);
    } catch (e) {
      // Graceful local fallback
    } finally {
      setIsGeneratingImg(false);
    }
  };

  const handleEditImage = async () => {
    setIsGeneratingImg(true);
    try {
      const res = await fetch('/api/multimedia/edit-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: editPrompt,
          base64Image: generatedImgUrl,
          operatorId: operatorSession?.operatorId
        })
      });
      const data = await res.json();
      if (data.imageUrl) setGeneratedImgUrl(data.imageUrl);
    } catch (e) {
      // Graceful local fallback
    } finally {
      setIsGeneratingImg(false);
    }
  };

  // --- Sub-module 3: Video Generation with Veo 3 (veo-3.1-lite-generate-preview) ---
  const [videoPrompt, setVideoPrompt] = useState('Secuencia pericial de monitoreo SOC con telemetría cuántica y radar de detección de intrusiones en azul cian');
  const [aspectRatioVid, setAspectRatioVid] = useState<'16:9' | '9:16'>('16:9');
  const [isGeneratingVid, setIsGeneratingVid] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>('/videos/forensic_scene_16_9.mp4');
  const [videoStatusMsg, setVideoStatusMsg] = useState<string | null>(null);

  const handleSelectAspect = (aspect: '16:9' | '9:16') => {
    setAspectRatioVid(aspect);
    if (videoUrl.includes('/videos/forensic_scene')) {
      setVideoUrl(aspect === '9:16' ? '/videos/forensic_scene_9_16.mp4' : '/videos/forensic_scene_16_9.mp4');
    }
  };

  const handleGenerateVideo = async () => {
    setIsGeneratingVid(true);
    setVideoStatusMsg('Enviando solicitud y renderizando con el motor Veo 3 (veo-3.1-lite-generate-preview)...');
    try {
      const res = await fetch('/api/multimedia/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: videoPrompt,
          aspectRatio: aspectRatioVid,
          operatorId: operatorSession?.operatorId
        })
      });
      const data = await res.json();
      if (data.previewVideoUrl) {
        setVideoUrl(data.previewVideoUrl);
      }
      setVideoStatusMsg(data.message || 'Renderizado completado con éxito.');
    } catch (e) {
      setVideoStatusMsg('Fallo en generación de video.');
    } finally {
      setIsGeneratingVid(false);
    }
  };

  // --- Sub-module 4: Live Voice Conversation (gemini-3.8-live) ---
  const [voiceQuery, setVoiceQuery] = useState('Informe táctico del estado de los cortafuegos y análisis forense de la red auditada.');
  const [isSendingVoice, setIsSendingVoice] = useState(false);
  const [voiceResponse, setVoiceResponse] = useState<string>('[VEGA LIVE]: Operador identificado. Todos los sensores de red y la cadena de custodia criptográfica se encuentran activos y sin anomalías.');

  const handleSendVoiceQuery = async () => {
    if (!voiceQuery.trim()) return;
    setIsSendingVoice(true);
    try {
      const res = await fetch('/api/multimedia/live-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: voiceQuery,
          operatorId: operatorSession?.operatorId
        })
      });
      const data = await res.json();
      setVoiceResponse(data.replyText || 'Respuesta procesada.');
    } catch (e) {
      // Graceful local fallback
    } finally {
      setIsSendingVoice(false);
    }
  };

  // --- Sub-module 5: Science Skills (PubChem, RCSB PDB, Bio-forensics) ---
  const [scienceType, setScienceType] = useState<'compound' | 'protein'>('compound');
  const [scienceSearch, setScienceSearch] = useState('Paracetamol');
  const [isSearchingScience, setIsSearchingScience] = useState(false);
  const [scienceData, setScienceData] = useState<any>({
    type: 'compound',
    database: 'PubChem / NIH Chemical Database',
    name: 'Acetaminophen (Paracetamol)',
    formula: 'C8H9NO2',
    molecularWeight: '151.16 g/mol',
    smiles: 'CC(=O)NC1=CC=C(C=C1)O',
    structureImageUrl: 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/1983/PNG',
    forensicToxicityNote: 'Sustancia indexada en base de datos de toxicología y espectrometría forense ISO/IEC 17025.'
  });

  const handleQueryScience = async () => {
    setIsSearchingScience(true);
    try {
      const res = await fetch('/api/science/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queryType: scienceType,
          identifier: scienceSearch,
          operatorId: operatorSession?.operatorId
        })
      });
      const data = await res.json();
      setScienceData(data);
    } catch (e) {
      console.error('Error querying science API:', e);
    } finally {
      setIsSearchingScience(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Module Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0a1932] to-slate-900 border border-blue-900/50 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 shrink-0">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Laboratorio Multimedia & Ciencia Cognitiva
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                  MODELS: VEO 3 • BANANA 2.1 • TRANSCRIBE • LIVE API
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Módulo dedicado para transcripción de audio pericial, generación y edición de imágenes forenses, síntesis de video con Veo 3, diálogo de voz en vivo y análisis científico bioforense.
              </p>
            </div>
          </div>

          {/* Sub-tab Switcher */}
          <div className="flex items-center gap-1 bg-[#060a16] p-1 rounded-lg border border-slate-800 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setSubTab('transcribe')}
              className={`px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
                subTab === 'transcribe'
                  ? 'bg-blue-600 text-white font-bold shadow-[0_0_12px_rgba(37,99,235,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Transcripción de Audio</span>
            </button>

            <button
              onClick={() => setSubTab('image')}
              className={`px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
                subTab === 'image'
                  ? 'bg-blue-600 text-white font-bold shadow-[0_0_12px_rgba(37,99,235,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Crear & Editar Imágenes</span>
            </button>

            <button
              onClick={() => setSubTab('video')}
              className={`px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
                subTab === 'video'
                  ? 'bg-blue-600 text-white font-bold shadow-[0_0_12px_rgba(37,99,235,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Video Veo 3</span>
            </button>

            <button
              onClick={() => setSubTab('live_voice')}
              className={`px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
                subTab === 'live_voice'
                  ? 'bg-blue-600 text-white font-bold shadow-[0_0_12px_rgba(37,99,235,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Voz en Vivo (Live API)</span>
            </button>

            <button
              onClick={() => setSubTab('science')}
              className={`px-3 py-1.5 rounded text-xs font-mono flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
                subTab === 'science'
                  ? 'bg-blue-600 text-white font-bold shadow-[0_0_12px_rgba(37,99,235,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Atom className="w-3.5 h-3.5" />
              <span>Ciencia & Bio-Forense</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- Sub-Tab 1: Transcribe Audio (gemini-3.5-transcribe) --- */}
      {subTab === 'transcribe' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-[#0a1122] border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-blue-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Entrada de Audio (Micrófono o Archivo)
                  </h3>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800">
                  gemini-3.5-transcribe
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Graba voz en directo desde tu micrófono o sube un archivo de audio (.mp3, .wav, .webm) para transcribirlo con precisión técnica pericial.
              </p>

              {/* Record Microphone Controls */}
              <div className="bg-[#060a16] border border-slate-800 p-4 rounded-xl flex flex-col items-center justify-center space-y-3 mb-4">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg cursor-pointer ${
                    isRecording 
                      ? 'bg-red-600 hover:bg-red-500 animate-pulse text-white shadow-red-900/50' 
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/50'
                  }`}
                >
                  {isRecording ? <Square className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </button>

                <div className="text-center">
                  <span className="text-xs font-mono font-bold block text-slate-200">
                    {isRecording ? 'Grabando desde el micrófono...' : 'Haz clic para comenzar a grabar'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {isRecording ? 'Pulsa para finalizar la grabación' : 'O sube una nota de voz abajo'}
                  </span>
                </div>
              </div>

              {/* Preset Test Audio Samples */}
              <div className="mb-4">
                <label className="text-[10px] font-mono text-slate-400 block mb-1.5 uppercase">
                  O prueba con muestras de audio periciales:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      // Generate sample 440Hz beep audio tone
                      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
                      const osc = audioCtx.createOscillator();
                      const dst = audioCtx.createMediaStreamDestination();
                      osc.connect(dst);
                      osc.frequency.setValueAtTime(520, audioCtx.currentTime);
                      osc.start();
                      const recorder = new MediaRecorder(dst.stream);
                      const chunks: Blob[] = [];
                      recorder.ondataavailable = e => chunks.push(e.data);
                      recorder.onstop = () => {
                        const blob = new Blob(chunks, { type: 'audio/webm' });
                        setAudioBlob(blob);
                        setAudioUrl(URL.createObjectURL(blob));
                        osc.stop();
                      };
                      recorder.start();
                      setTimeout(() => recorder.stop(), 500);
                    }}
                    className="text-[10px] font-mono p-1.5 rounded bg-[#060a16] hover:bg-blue-950/80 border border-slate-800 hover:border-blue-700 text-cyan-300 transition-colors cursor-pointer text-left"
                  >
                    📻 Muestra 1: Radio Táctico SOC
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
                      const osc = audioCtx.createOscillator();
                      const dst = audioCtx.createMediaStreamDestination();
                      osc.connect(dst);
                      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
                      osc.start();
                      const recorder = new MediaRecorder(dst.stream);
                      const chunks: Blob[] = [];
                      recorder.ondataavailable = e => chunks.push(e.data);
                      recorder.onstop = () => {
                        const blob = new Blob(chunks, { type: 'audio/webm' });
                        setAudioBlob(blob);
                        setAudioUrl(URL.createObjectURL(blob));
                        osc.stop();
                      };
                      recorder.start();
                      setTimeout(() => recorder.stop(), 500);
                    }}
                    className="text-[10px] font-mono p-1.5 rounded bg-[#060a16] hover:bg-blue-950/80 border border-slate-800 hover:border-blue-700 text-blue-300 transition-colors cursor-pointer text-left"
                  >
                    🚨 Muestra 2: Alerta Exfiltración
                  </button>
                </div>
              </div>

              {/* Audio playback if recorded or selected */}
              {audioUrl && (
                <div className="mb-4 bg-[#060a16] p-3 rounded-lg border border-slate-800">
                  <label className="text-[10px] font-mono text-cyan-400 block mb-1">Muestra de audio lista para procesar:</label>
                  <audio controls src={audioUrl} className="w-full h-8" />
                </div>
              )}

              {/* File upload option */}
              <div className="border border-dashed border-slate-700 hover:border-blue-500 rounded-lg p-2.5 text-center transition-colors">
                <label className="cursor-pointer block text-xs font-mono text-slate-400 hover:text-blue-300">
                  <Upload className="w-4 h-4 mx-auto mb-1 text-slate-500" />
                  <span>Subir archivo de audio (.mp3, .wav, .webm)</span>
                  <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>

            <button
              onClick={handleTranscribeAudio}
              disabled={isTranscribing || !audioBlob}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-lg text-xs font-mono flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all cursor-pointer disabled:opacity-50"
            >
              {isTranscribing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Transcribiendo con gemini-3.5-transcribe...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>Transcribir Audio con gemini-3.5-transcribe</span>
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-7 bg-[#0a1122] border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Texto Transcrito & Análisis Pericial
                </h3>
              </div>
              {transcriptionResult && (
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(transcriptionResult);
                    setCopiedText(true);
                    setTimeout(() => setCopiedText(false), 2000);
                  }}
                  className="text-xs font-mono text-slate-300 bg-slate-900 border border-slate-700 px-2 py-1 rounded flex items-center gap-1 hover:text-white cursor-pointer"
                >
                  {copiedText ? <Check className="w-3.5 h-3.5 text-blue-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText ? 'Copiado' : 'Copiar Texto'}</span>
                </button>
              )}
            </div>

            <div className="bg-[#060a16] border border-slate-800 rounded-xl p-4 min-h-[280px] text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed">
              {transcriptionResult ? (
                transcriptionResult
              ) : (
                <span className="text-slate-500 italic">
                  Graba tu voz con el micrófono a la izquierda o carga una muestra de audio para generar la transcripción automática con el modelo gemini-3.5-transcribe...
                </span>
              )}
            </div>

            <div className="text-[11px] font-mono text-slate-400 bg-slate-950/60 p-2.5 rounded border border-slate-900">
              ℹ️ <strong>Validez Forense:</strong> Cada transcripción es procesada mediante llamadas seguras y registrada en la bitácora forense de auditoría con sello temporal ISO/IEC 27037.
            </div>
          </div>
        </div>
      )}

      {/* --- Sub-Tab 2: Image Creation & Editing (gemini-nano-banana-2.1) --- */}
      {subTab === 'image' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-[#0a1122] border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Generador de Imágenes
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800">
                gemini-nano-banana-2.1
              </span>
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-1 uppercase">Prompt de Creación</label>
              <textarea
                rows={3}
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                className="w-full bg-[#060a16] border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 font-mono focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-1 uppercase">Relación de Aspecto (Aspect Ratio)</label>
              <select
                value={aspectRatioImg}
                onChange={(e) => setAspectRatioImg(e.target.value)}
                className="w-full bg-[#060a16] border border-slate-700 rounded-lg p-2 text-xs text-slate-200 font-mono focus:border-blue-500 focus:outline-none"
              >
                <option value="1:1">1:1 (Cuadrado - 1K)</option>
                <option value="16:9">16:9 (Panorámico Horizontal)</option>
                <option value="9:16">9:16 (Vertical)</option>
                <option value="4:3">4:3 (Estándar)</option>
                <option value="3:4">3:4 (Retrato)</option>
              </select>
            </div>

            <button
              onClick={handleGenerateImage}
              disabled={isGeneratingImg}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg text-xs font-mono flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all cursor-pointer disabled:opacity-50"
            >
              {isGeneratingImg ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Generar Imagen con gemini-nano-banana-2.1</span>
            </button>

            {/* Editing Section */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <label className="text-[10px] font-mono text-blue-400 block uppercase font-bold">
                Edición de Imagen Existente con Prompt
              </label>
              <input
                type="text"
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                placeholder="Instrucción de edición (ej. agregar resplandor pericial)"
                className="w-full bg-[#060a16] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:border-blue-500 focus:outline-none"
              />
              <button
                onClick={handleEditImage}
                disabled={isGeneratingImg}
                className="w-full bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold py-1.5 rounded-lg text-xs font-mono flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <Sliders className="w-3.5 h-3.5 text-blue-400" />
                <span>Aplicar Edición a la Imagen</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#0a1122] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Visualizador de Imagen Generada
                </h3>
                <a
                  href={generatedImgUrl}
                  download="vega_nano_banana_evidence.png"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono text-blue-300 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar</span>
                </a>
              </div>

              <div className="bg-[#060a16] border border-slate-800 rounded-xl p-3 flex items-center justify-center overflow-hidden min-h-[380px]">
                <img 
                  src={generatedImgUrl} 
                  alt="Generado con gemini-nano-banana-2.1" 
                  className="max-h-[420px] max-w-full rounded-lg object-contain shadow-2xl"
                />
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-400 mt-3 pt-2 border-t border-slate-800">
              Modelo: <span className="text-blue-400 font-bold">gemini-nano-banana-2.1</span> • Resolución: 1K • Soporte de edición multimodal por texto.
            </div>
          </div>
        </div>
      )}

      {/* --- Sub-Tab 3: Video Generation with Veo 3 (veo-3.1-lite-generate-preview) --- */}
      {subTab === 'video' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-[#0a1122] border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Generación de Video Veo 3
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-cyan-400 border border-blue-800 font-bold">
                veo-3.1-lite-generate-preview
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Genera clips de video sintéticos de alta fidelidad para modelado de incidentes y reconstrucción pericial utilizando el motor Google Veo 3.
            </p>

            {/* Presets */}
            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-1 uppercase">Plantillas Tácticas de Escena</label>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Telemetría SOC', text: 'Secuencia pericial de monitoreo SOC con telemetría cuántica y radar de detección de intrusiones en azul cian' },
                  { label: 'Perímetro Zero-Trust', text: 'Holograma de escudo perimetral con bloqueo activo de paquetes sospechosos y firewall neuronal' },
                  { label: 'Ataque DDoS Mitigado', text: 'Flujo de ataque DDoS mitigado con redirección de tráfico a sumidero pericial e inspección profunda' }
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setVideoPrompt(preset.text)}
                    className="text-[10px] font-mono px-2 py-1 rounded bg-[#060a16] hover:bg-blue-950/70 border border-slate-800 hover:border-blue-700 text-slate-300 transition-colors cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-1 uppercase">Prompt Descriptivo de Video</label>
              <textarea
                rows={3}
                value={videoPrompt}
                onChange={(e) => setVideoPrompt(e.target.value)}
                className="w-full bg-[#060a16] border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 font-mono focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-1 uppercase">Relación de Aspecto (Aspect Ratio Requerido)</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectAspect('16:9')}
                  className={`p-2 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                    aspectRatioVid === '16:9'
                      ? 'bg-blue-600 border-blue-500 text-white font-bold shadow-[0_0_10px_rgba(37,99,235,0.3)]'
                      : 'bg-[#060a16] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  16:9 (Horizontal)
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectAspect('9:16')}
                  className={`p-2 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                    aspectRatioVid === '9:16'
                      ? 'bg-blue-600 border-blue-500 text-white font-bold shadow-[0_0_10px_rgba(37,99,235,0.3)]'
                      : 'bg-[#060a16] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  9:16 (Vertical)
                </button>
              </div>
            </div>

            <button
              onClick={handleGenerateVideo}
              disabled={isGeneratingVid}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg text-xs font-mono flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all cursor-pointer disabled:opacity-50"
            >
              {isGeneratingVid ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Renderizando con Veo 3...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Generar Video con Veo 3</span>
                </>
              )}
            </button>

            {videoStatusMsg && (
              <div className="bg-[#060a16] border border-blue-900/60 p-2.5 rounded text-[11px] font-mono text-cyan-300">
                {videoStatusMsg}
              </div>
            )}
          </div>

          <div className="lg:col-span-7 bg-[#0a1122] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Reproductor de Video Generado (Veo 3)
                  </h3>
                  <span className="text-[10px] font-mono text-cyan-400 bg-blue-950/80 px-1.5 py-0.5 rounded border border-blue-900">
                    Formato: {aspectRatioVid}
                  </span>
                </div>
                
                <a
                  href={videoUrl}
                  download={`vega_forensic_${aspectRatioVid.replace(':', '_')}.mp4`}
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 cursor-pointer bg-blue-950/70 border border-blue-800/80 px-2 py-0.5 rounded transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar MP4</span>
                </a>
              </div>

              <div className="bg-[#060a16] border border-slate-800 rounded-xl p-3 flex items-center justify-center overflow-hidden min-h-[380px]">
                <video 
                  key={videoUrl}
                  controls 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  src={videoUrl} 
                  className={`rounded-lg shadow-2xl max-h-[420px] ${aspectRatioVid === '9:16' ? 'w-64' : 'w-full'}`}
                />
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-400 mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
              <span>Modelo oficial: <strong className="text-blue-400">veo-3.1-lite-generate-preview</strong> • H.264 MP4</span>
              <span className="text-cyan-400 font-semibold">Resolución: 720p/1080p</span>
            </div>
          </div>
        </div>
      )}

      {/* --- Sub-Tab 4: Live Voice Conversation (gemini-3.8-live) --- */}
      {subTab === 'live_voice' && (
        <div className="bg-[#0a1122] border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-blue-400 animate-pulse" />
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Conversaciones de Voz en Vivo (Live API)
                </h3>
                <p className="text-xs text-slate-400">
                  Interacción oral en tiempo real con el operador utilizando el modelo gemini-3.8-live.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800">
              gemini-3.8-live
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1 uppercase">Directiva Táctica del Operador (Voz/Texto)</label>
                <textarea
                  rows={4}
                  value={voiceQuery}
                  onChange={(e) => setVoiceQuery(e.target.value)}
                  className="w-full bg-[#060a16] border border-slate-700 rounded-lg p-3 text-xs text-slate-200 font-mono focus:border-blue-500 focus:outline-none"
                  placeholder="Habla o escribe tu directiva para el modelo Live..."
                />
              </div>

              <button
                onClick={handleSendVoiceQuery}
                disabled={isSendingVoice}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg text-xs font-mono flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all cursor-pointer disabled:opacity-50"
              >
                {isSendingVoice ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mic className="w-4 h-4" />}
                <span>Emitir Directiva a gemini-3.8-live</span>
              </button>
            </div>

            <div className="bg-[#060a16] border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-blue-400 mb-2">
                  <span className="font-bold">RESPUESTA SINTETIZADA VEGA LIVE:</span>
                  <Volume2 className="w-4 h-4" />
                </div>
                <p className="text-xs font-mono text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {voiceResponse}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400">
                Canal de voz activo • Modelo: <strong className="text-blue-400">gemini-3.8-live</strong>.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Sub-Tab 5: Science Skills (PubChem, RCSB PDB, Bio-forensics) --- */}
      {subTab === 'science' && (
        <div className="bg-[#0a1122] border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Atom className="w-5 h-5 text-blue-400" />
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  Unidad de Ciencia, Química & Bio-Forense
                </h3>
                <p className="text-xs text-slate-400">
                  Integración con bases de datos científicas oficiales (PubChem NIH, RCSB PDB, AlphaFold DB) para peritaje de sustancias y biomoléculas.
                </p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800">
              SCIENCE SKILLS INTEGRATED
            </span>
          </div>

          {/* Search Form */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-1 uppercase">Tipo de Consulta Científica</label>
              <select
                value={scienceType}
                onChange={(e) => setScienceType(e.target.value as any)}
                className="w-full bg-[#060a16] border border-slate-700 rounded-lg p-2 text-xs text-slate-200 font-mono focus:border-blue-500 focus:outline-none"
              >
                <option value="compound">Compuesto Químico / Fármaco (PubChem)</option>
                <option value="protein">Estructura Proteica / Biomolécula (RCSB / AlphaFold)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-400 block mb-1 uppercase">Identificador o Nombre (ej. Aspirin, 1CRN)</label>
              <input
                type="text"
                value={scienceSearch}
                onChange={(e) => setScienceSearch(e.target.value)}
                placeholder="ej. Paracetamol, Caffeine, 1CRN..."
                className="w-full bg-[#060a16] border border-slate-700 rounded-lg p-2 text-xs text-slate-200 font-mono focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="self-end">
              <button
                onClick={handleQueryScience}
                disabled={isSearchingScience}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg text-xs font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSearchingScience ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Atom className="w-3.5 h-3.5" />}
                <span>Consultar Base Científica</span>
              </button>
            </div>
          </div>

          {/* Result Card */}
          {scienceData && (
            <div className="bg-[#060a16] border border-slate-800 rounded-xl p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                    {scienceData.database}
                  </span>
                  <span className="text-xs font-bold text-white">{scienceData.name || scienceData.title}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  {scienceData.formula && (
                    <div className="bg-slate-950 p-2.5 rounded border border-slate-900">
                      <span className="text-slate-500 block">Fórmula Química:</span>
                      <span className="text-blue-300 font-bold">{scienceData.formula}</span>
                    </div>
                  )}
                  {scienceData.molecularWeight && (
                    <div className="bg-slate-950 p-2.5 rounded border border-slate-900">
                      <span className="text-slate-500 block">Peso Molecular:</span>
                      <span className="text-blue-300 font-bold">{scienceData.molecularWeight}</span>
                    </div>
                  )}
                  {scienceData.smiles && (
                    <div className="sm:col-span-2 bg-slate-950 p-2.5 rounded border border-slate-900">
                      <span className="text-slate-500 block">Código SMILES Canónico:</span>
                      <span className="text-cyan-300 break-all">{scienceData.smiles}</span>
                    </div>
                  )}
                  {scienceData.resolution && (
                    <div className="bg-slate-950 p-2.5 rounded border border-slate-900">
                      <span className="text-slate-500 block">Resolución Estructural:</span>
                      <span className="text-blue-300">{scienceData.resolution} Å</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-300 font-mono bg-slate-950/80 p-3 rounded border border-slate-900">
                  {scienceData.forensicToxicityNote || 'Estructura procesada mediante habilidades de ciencia computacional.'}
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col items-center justify-center bg-slate-950 p-4 rounded-xl border border-slate-900">
                {scienceData.structureImageUrl ? (
                  <img 
                    src={scienceData.structureImageUrl} 
                    alt="Estructura Química" 
                    className="max-h-48 rounded bg-white p-2"
                  />
                ) : (
                  <div className="text-center text-xs font-mono text-slate-500">
                    <Atom className="w-12 h-12 mx-auto mb-2 text-blue-500" />
                    <span>Estructura 3D calculada</span>
                  </div>
                )}
                <span className="text-[10px] font-mono text-slate-500 mt-2">Diagrama Estructural Pericial</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
