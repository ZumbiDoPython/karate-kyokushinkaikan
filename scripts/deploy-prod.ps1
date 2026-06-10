# Deploy produção — Firebase Hosting + Firestore rules
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

if ($env:CI) { Remove-Item Env:CI }

Write-Host "Preferências: Gemini=n, telemetria=n" -ForegroundColor Cyan
node scripts/firebase-login-no-gemini.js
if ($LASTEXITCODE -ne 0) {
  Write-Host "Login cancelado ou falhou. Tente de novo." -ForegroundColor Red
  exit 1
}

Write-Host "Build de produção..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Deploy kyokushinkaikan-brasil..." -ForegroundColor Cyan
npx firebase deploy --only hosting,firestore:rules --project kyokushinkaikan-brasil

Write-Host "Concluído." -ForegroundColor Green
