import React, { useState } from 'react';
import { 
  MapPin, 
  Search, 
  ExternalLink, 
  ShieldCheck, 
  Compass, 
  Server, 
  Navigation, 
  Layers, 
  RefreshCw, 
  Building2, 
  Globe, 
  Radio, 
  CheckCircle2, 
  AlertCircle,
  Maximize2
} from 'lucide-react';
import { OperatorSession } from '../types/vega';

interface GeoMapsIntelProps {
  operatorSession: OperatorSession | null;
  defaultQuery?: string;
}

interface MapsLink {
  uri: string;
  title: string;
  placeId?: string;
  address?: string;
}

export const GeoMapsIntel: React.FC<GeoMapsIntelProps> = ({ operatorSession, defaultQuery = '' }) => {
  const [searchQuery, setSearchQuery] = useState(defaultQuery || 'Equinix Data Center Querétaro México');
  const [useDeviceLocation, setUseDeviceLocation] = useState(false);
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [intelResult, setIntelResult] = useState<string>('');
  const [mapsLinks, setMapsLinks] = useState<MapsLink[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedMapEmbed, setSelectedMapEmbed] = useState<string | null>(null);

  const predefinedTargets = [
    { name: 'Equinix IBX Data Center (Querétaro)', query: 'Equinix IBX Data Center Queretaro Mexico' },
    { name: 'AWS US-East-1 (Northern Virginia)', query: 'Amazon Web Services Data Center Ashburn Virginia' },
    { name: 'Google Cloud Santiago Data Center', query: 'Google Cloud Data Center Quilicura Santiago Chile' },
    { name: 'KIO Networks Datacenter México', query: 'KIO Networks Data Center Ciudad de Mexico' },
    { name: 'Telefónica Data Center Madrid', query: 'Telefonica Data Center Alcala de Henares Madrid' },
    { name: 'Sede Bancaria / Corporativa Monterrey', query: 'Torre KOI San Pedro Garza Garcia Monterrey' }
  ];

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocalización no soportada por el navegador.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        });
        setUseDeviceLocation(true);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setErrorMsg('No se pudo obtener la posición del dispositivo. Por favor ingresa la ubicación manualmente.');
      }
    );
  };

  const handleExecuteSearch = async (queryToSearch?: string) => {
    const q = (queryToSearch || searchQuery).trim();
    if (!q) {
      setErrorMsg('Debe ingresar un objetivo o ubicación a consultar.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/intel/maps-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          location: useDeviceLocation && coords ? coords : undefined,
          operatorId: operatorSession?.operatorId || 'AdminCEO',
          role: operatorSession?.role || 'AUDITOR_CHIEF'
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Error al consultar Google Maps Data.');
      } else {
        setIntelResult(data.text || 'Sin información pericial.');
        setMapsLinks(data.mapsLinks || []);
        if (data.mapsLinks && data.mapsLinks.length > 0) {
          setSelectedMapEmbed(data.mapsLinks[0].uri);
        } else {
          setSelectedMapEmbed(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`);
        }
      }
    } catch (err: any) {
      console.error('Error in maps grounding query:', err);
      setErrorMsg('Error de red al consultar el motor de Google Maps Data.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0a1628] to-slate-900 border border-blue-900/40 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Geo-Inteligencia & Reconocimiento Físico con Google Maps Data
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800 font-bold flex items-center gap-1">
                  <Globe className="w-3 h-3 text-cyan-400" />
                  MAPS GROUNDING • gemini-3.5-flash
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Verificación física en terreno y georreferenciación de datacenters, instalaciones de red, proveedores de tránsito y sedes corporativas con datos actualizados de Google Maps.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleGetLocation}
              className={`text-xs font-mono px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
                useDeviceLocation && coords
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{useDeviceLocation && coords ? 'GPS Activo' : 'Usar GPS Local'}</span>
            </button>
          </div>
        </div>

        {/* Quick Targets Pills */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <label className="text-[10px] font-mono text-slate-400 uppercase block mb-2 font-semibold">
            Objetivos de Infraestructura Típicos para Análisis Pericial:
          </label>
          <div className="flex flex-wrap gap-2">
            {predefinedTargets.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSearchQuery(item.query);
                  handleExecuteSearch(item.query);
                }}
                className="text-[11px] font-mono bg-[#060a14] hover:bg-blue-950/60 text-slate-300 hover:text-blue-300 border border-slate-800 hover:border-blue-700 px-2.5 py-1 rounded transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Server className="w-3 h-3 text-blue-400" />
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="bg-[#0b101e] border border-slate-800 rounded-xl p-4">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleExecuteSearch();
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar dirección, centro de datos, empresa o infraestructura objetivo..."
              className="w-full bg-[#060a14] border border-slate-700 rounded-lg pl-9 pr-3 py-2.5 text-xs text-slate-200 font-mono focus:border-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-lg text-xs font-mono flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all cursor-pointer disabled:opacity-50 shrink-0"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Consultando Google Maps...</span>
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4" />
                <span>Analizar Terreno con Google Maps Data</span>
              </>
            )}
          </button>
        </form>

        {errorMsg && (
          <div className="mt-3 p-2.5 rounded-lg bg-red-950/60 border border-red-800 text-xs font-mono text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Main Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Forensic Geospatial Report (7 cols) */}
        <div className="lg:col-span-7 bg-[#0b101e] border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Informe Pericial de Infraestructura y Terreno (OSINT)
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800">
                Modelo: gemini-3.5-flash
              </span>
            </div>

            <div className="mt-4 bg-[#060a14] border border-slate-800/90 rounded-xl p-4 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed min-h-[300px]">
              {intelResult ? (
                intelResult
              ) : (
                <span className="text-slate-500 italic">
                  Ingresa un centro de datos, empresa o dirección objetivo y pulsa "Analizar Terreno con Google Maps Data" para recibir el desglose pericial de coordenadas, instalaciones y perímetro de seguridad con el motor de Google Maps.
                </span>
              )}
            </div>
          </div>

          {/* Mandatory Google Maps Grounding Links */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <h4 className="text-[11px] font-mono text-blue-400 uppercase font-bold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Enlaces Oficiales de Google Maps Grounding ({mapsLinks.length})</span>
            </h4>

            {mapsLinks.length > 0 ? (
              <div className="space-y-1.5">
                {mapsLinks.map((link, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#060a14] border border-slate-800 hover:border-blue-700 transition-colors text-xs font-mono"
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="text-slate-200 font-semibold truncate">{link.title}</span>
                      {link.address && <span className="text-slate-500 text-[10px] truncate">({link.address})</span>}
                    </div>

                    <a
                      href={link.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] flex items-center gap-1 shrink-0 cursor-pointer shadow-sm shadow-blue-500/20"
                    >
                      <span>Abrir en Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] font-mono text-slate-500 italic">
                Los enlaces directos a Google Maps se desplegarán aquí tras la ejecución de la consulta.
              </p>
            )}
          </div>
        </div>

        {/* Right: Embedded Interactive Map & Satellite Perimeter (5 cols) */}
        <div className="lg:col-span-5 bg-[#0b101e] border border-slate-800 rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Visor Satelital de Coordenadas
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Visualización Geoespacial
              </span>
            </div>

            {/* Embedded Google Map Preview */}
            <div className="mt-4 bg-[#060a14] border border-slate-800 rounded-xl overflow-hidden h-[340px] relative shadow-inner">
              <iframe
                title="Google Maps Location View"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={`https://maps.google.com/maps?q=${encodeURIComponent(searchQuery)}&t=m&z=14&output=embed`}
              />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs font-mono text-slate-400">
            <div className="flex items-center justify-between">
              <span>ESTÁNDAR PERICIAL:</span>
              <span className="text-slate-200">ISO/IEC 27037 Reconocimiento Físico</span>
            </div>
            <div className="flex items-center justify-between">
              <span>TRAZABILIDAD:</span>
              <span className="text-blue-400 font-semibold">Registrado en Bitácora Forense</span>
            </div>
            {selectedMapEmbed && (
              <a
                href={selectedMapEmbed}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 py-2 rounded-lg text-xs font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Explorar Coordenadas en Pantalla Completa</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
