# PowerShell script to deploy to Vercel

Write-Host "Preparing project for Vercel deployment..." -ForegroundColor Green

# Check if Vercel CLI is installed
$vercelInstalled = $null
try {
    $vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue
} catch {
    # Command not found, will install it
}

if ($null -eq $vercelInstalled) {
    Write-Host "Installing Vercel CLI globally..." -ForegroundColor Yellow
    npm install -g vercel
}

# Run Vercel deployment
Write-Host "Running Vercel deployment..." -ForegroundColor Green
vercel

Write-Host "`nDeployment process initiated. Follow the instructions in the terminal." -ForegroundColor Cyan
Write-Host "Note: You'll need to authenticate with Vercel if this is your first time using the CLI." -ForegroundColor Yellow