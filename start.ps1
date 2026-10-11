$ErrorActionPreference = 'Stop'
$appDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$venvPython = Join-Path $appDir '.venv\Scripts\python.exe'

if (-not (Test-Path $venvPython)) {
    Write-Host 'Creating the app environment...' -ForegroundColor Cyan
    python -m venv (Join-Path $appDir '.venv')
    & $venvPython -m pip install --upgrade pip
    & $venvPython -m pip install -r (Join-Path $appDir 'requirements.txt')
}

if (-not (Test-Path (Join-Path $appDir '.env')) -and (Test-Path (Join-Path $appDir '.env.example'))) {
    Copy-Item (Join-Path $appDir '.env.example') (Join-Path $appDir '.env')
    Write-Host 'AI is in preview mode. Add your OpenAI API key to floorplan-studio\.env to enable plan analysis.' -ForegroundColor Yellow
}

Write-Host 'Opening AITS Floorplan Studio at http://127.0.0.1:8765' -ForegroundColor Green
Start-Process 'http://127.0.0.1:8765'
& $venvPython -m uvicorn server:app --host 127.0.0.1 --port 8765 --app-dir $appDir
