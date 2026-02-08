# Script PowerShell pour configurer la base de données PostgreSQL
Write-Host "🔄 Configuration de la base de données PostgreSQL..." -ForegroundColor Cyan
Write-Host ""

# Vérifier si PostgreSQL est installé
Write-Host "1️⃣ Vérification de PostgreSQL..." -ForegroundColor Yellow
$pgService = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue

if ($pgService) {
    Write-Host "   ✅ Service PostgreSQL trouvé: $($pgService.Name)" -ForegroundColor Green
    
    # Vérifier si le service est démarré
    if ($pgService.Status -eq "Running") {
        Write-Host "   ✅ PostgreSQL est démarré" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️ PostgreSQL n'est pas démarré. Démarrage..." -ForegroundColor Yellow
        Start-Service -Name $pgService.Name
        Start-Sleep -Seconds 3
        Write-Host "   ✅ PostgreSQL démarré" -ForegroundColor Green
    }
} else {
    Write-Host "   ❌ Service PostgreSQL non trouvé" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Solutions:" -ForegroundColor Yellow
    Write-Host "   1. Installez PostgreSQL depuis https://www.postgresql.org/download/windows/"
    Write-Host "   2. Ou utilisez une base de données distante (Neon, Supabase, etc.)"
    Write-Host "   3. Configurez DATABASE_URL dans config.env"
    exit 1
}

Write-Host ""
Write-Host "2️⃣ Test de connexion à PostgreSQL..." -ForegroundColor Yellow

# Charger les variables d'environnement
$envFile = Join-Path $PSScriptRoot "config.env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
        }
    }
}

$dbHost = $env:DB_HOST ?? "localhost"
$dbPort = $env:DB_PORT ?? "5432"
$dbUser = $env:DB_USER ?? "postgres"
$dbPassword = $env:DB_PASSWORD ?? ""

Write-Host "   Host: $dbHost"
Write-Host "   Port: $dbPort"
Write-Host "   User: $dbUser"
Write-Host "   Password: $(if ($dbPassword) { '***' } else { '(vide)' })"
Write-Host ""

Write-Host "3️⃣ Création de la base de données 'diangou'..." -ForegroundColor Yellow
Write-Host "   💡 Exécutez cette commande dans psql ou pgAdmin:" -ForegroundColor Cyan
Write-Host "   CREATE DATABASE diangou;" -ForegroundColor White
Write-Host ""
Write-Host "   Ou utilisez cette commande PowerShell:" -ForegroundColor Cyan
$psqlPath = "psql"
if (Get-Command psql -ErrorAction SilentlyContinue) {
    Write-Host "   psql -U $dbUser -c 'CREATE DATABASE diangou;'" -ForegroundColor White
} else {
    Write-Host "   ⚠️ psql n'est pas dans le PATH" -ForegroundColor Yellow
    Write-Host "   Trouvez psql.exe dans votre installation PostgreSQL et exécutez:" -ForegroundColor Yellow
    Write-Host "   C:\Program Files\PostgreSQL\XX\bin\psql.exe -U $dbUser -c 'CREATE DATABASE diangou;'" -ForegroundColor White
}

Write-Host ""
Write-Host "4️⃣ Après avoir créé la base, testez avec:" -ForegroundColor Yellow
Write-Host "   node test-db-connection.js" -ForegroundColor White
Write-Host ""

