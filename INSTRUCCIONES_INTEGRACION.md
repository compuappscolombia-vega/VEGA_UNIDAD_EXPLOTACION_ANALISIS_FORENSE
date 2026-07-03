# VEGA IA - Integración Multi-Proveedor (Gemini + Grok + Copilot + Groq)

## Estado actual
- Refactorizado para soportar **4 proveedores** (orquestador por defecto):
  - `orchestrator` → VEGA consulta a Gemini + Groq + Grok en paralelo y sintetiza la respuesta final
  - `groq`     → Groq (Llama 3.3 70B etc.)
  - `gemini`   → Google Gemini Pro (usando el nuevo paquete google-genai)
  - `grok`     → xAI Grok (grok-2)

## 1. Instalar dependencias

```powershell
cd C:\grokAgente\vega-original
pip install -r requirements.txt
```

## 2. Configurar las API Keys (IMPORTANTE)

**Nunca dejes las keys en el código.**

### Opción recomendada (más fácil): Usar archivo .env

1. Copia el archivo `.env.example` y renómbralo a `.env`
2. Edita el `.env` y pon tus keys reales.
3. Instala la dependencia:

```powershell
pip install python-dotenv
```

Al ejecutar `python vega_core.py`, las keys se cargarán automáticamente desde el `.env`.

### Opción alternativa: Variables de entorno

### En PowerShell (sesión actual):
```powershell
$env:GROQ_API_KEY = "tu_key_groq"
$env:GEMINI_API_KEY = "tu_key_gemini"
$env:XAI_API_KEY = "tu_key_xai"
$env:AZURE_OPENAI_KEY = "tu_key_azure"
$env:AZURE_OPENAI_ENDPOINT = "https://tu-recurso.openai.azure.com/"
$env:VEGA_PROVIDER = "groq"          # o gemini | grok | azure
```

### Forma permanente (Windows):
```powershell
setx GROQ_API_KEY "tu_key_groq"
setx GEMINI_API_KEY "tu_key_gemini"
setx XAI_API_KEY "tu_key_xai"
setx VEGA_PROVIDER "groq"
```

Reinicia el terminal/PowerShell después de usar `setx`.

## 3. Ejecutar

```powershell
cd C:\grokAgente\vega-original

# Instalar dependencias (incluyendo python-dotenv recomendado)
pip install -r requirements.txt

# Ejecutar
python vega_core.py
```

En la interfaz verás un **selector de proveedor** (arriba del input). Puedes cambiar en tiempo real.

## 4. Notas importantes

- El prompt maestro original ("SANTO GRIAL") se mantiene para todos los proveedores.
- Algunos proveedores (Gemini especialmente) pueden tener filtros de seguridad más estrictos aunque uses el mismo prompt.
- Para **Azure / Copilot**:
  - Ajusta `AZURE_DEPLOYMENT_NAME` si tu deployment no se llama `gpt-4o`.
  - La configuración del cliente Azure puede requerir ajustes según tu recurso (api-version).

- Historial de chat se mantiene en memoria (máx ~20 mensajes).

## 5. Para volver a empaquetar (PyInstaller)

```powershell
pip install pyinstaller
pyinstaller vega_core.spec
```

O genera uno nuevo:
```powershell
pyinstaller --onefile --windowed --icon=logo_compuapps.ico --add-data "fondo_vega.png;." --add-data "logo_compuapps.png;." vega_core.py
```

## Seguridad
La API key antigua fue eliminada del código. Usa siempre variables de entorno.

¡Listo para usar Gemini Pro, Grok (xAI), Azure/Copilot y Groq!
