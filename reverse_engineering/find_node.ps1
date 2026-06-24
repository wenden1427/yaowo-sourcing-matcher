Get-Command node -ErrorAction SilentlyContinue | Format-List
Get-Command npx -ErrorAction SilentlyContinue | Format-List
Get-Command npm -ErrorAction SilentlyContinue | Format-List
if (Test-Path "C:\Program Files\nodejs\npx.exe") { Write-Host "Found: C:\Program Files\nodejs\npx.exe" }
if (Test-Path "$env:APPDATA\npm\npx.cmd") { Write-Host "Found: $env:APPDATA\npm\npx.cmd" }
if (Test-Path "$env:LOCALAPPDATA\fnm_multishells") { Get-ChildItem "$env:LOCALAPPDATA\fnm_multishells" -Recurse -Filter npx.cmd -ErrorAction SilentlyContinue | Select-Object FullName }
Write-Host "Checking winget for node..."
winget list --name node 2>$null | Select-Object -First 5
