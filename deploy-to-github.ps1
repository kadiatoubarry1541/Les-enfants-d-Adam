# Script de déploiement sur GitHub
# Usage: .\deploy-to-github.ps1 -RepoName "nom-du-depot"

param(
    [Parameter(Mandatory=$true)]
    [string]$RepoName
)

Write-Host "🚀 Déploiement sur GitHub..." -ForegroundColor Green
Write-Host ""

# Vérifier que Git est initialisé
if (-not (Test-Path .git)) {
    Write-Host "❌ Erreur: Git n'est pas initialisé dans ce répertoire" -ForegroundColor Red
    exit 1
}

# Vérifier que le remote n'existe pas déjà
$remoteExists = git remote get-url origin 2>$null
if ($remoteExists) {
    Write-Host "⚠️  Le remote 'origin' existe déjà: $remoteExists" -ForegroundColor Yellow
    $overwrite = Read-Host "Voulez-vous le remplacer? (o/n)"
    if ($overwrite -ne "o" -and $overwrite -ne "O") {
        Write-Host "❌ Opération annulée" -ForegroundColor Red
        exit 1
    }
    git remote remove origin
}

# Ajouter le remote
$remoteUrl = "https://github.com/kadiatoubarry1541/$RepoName.git"
Write-Host "📡 Ajout du remote: $remoteUrl" -ForegroundColor Cyan
git remote add origin $remoteUrl

# Vérifier que la branche est 'main'
$currentBranch = git branch --show-current
if ($currentBranch -ne "main") {
    Write-Host "🔄 Renommage de la branche '$currentBranch' en 'main'..." -ForegroundColor Cyan
    git branch -M main
}

# Afficher les instructions
Write-Host ""
Write-Host "✅ Configuration terminée!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Prochaines étapes:" -ForegroundColor Yellow
Write-Host "1. Créez le dépôt '$RepoName' sur GitHub: https://github.com/new" -ForegroundColor White
Write-Host "2. NE créez PAS de README, .gitignore ou LICENSE (on en a déjà)" -ForegroundColor White
Write-Host "3. Une fois créé, exécutez cette commande:" -ForegroundColor White
Write-Host ""
Write-Host "   git push -u origin main" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎉 Votre projet sera alors en ligne!" -ForegroundColor Green

