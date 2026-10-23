# FocusStudy Shortcut Creator
$desktop = [Environment]::GetFolderPath("Desktop")
$exePath = Join-Path $PSScriptRoot "dist\FocusStudy.exe"
$shortcutPath = Join-Path $desktop "FocusStudy.lnk"

# Check if exe exists
if (!(Test-Path $exePath)) {
    Write-Host "❌ FocusStudy.exe not found! Run 'npm run build' first." -ForegroundColor Red
    exit 1
}

# Create shortcut
$ws = New-Object -ComObject WScript.Shell
$shortcut = $ws.CreateShortcut($shortcutPath)
$shortcut.TargetPath = $exePath
$shortcut.WorkingDirectory = (Split-Path $exePath)
$shortcut.Description = "تطبيق التركيز والدراسة"
$shortcut.Save()

Write-Host "✅ Shortcut created: $shortcutPath" -ForegroundColor Green
