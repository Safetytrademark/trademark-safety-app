@echo off
title Trademark Safety App - Backend Server
color 0A

echo.
echo  ========================================
echo   Trademark Safety App - Backend Server
echo  ========================================
echo.

cd /d "%~dp0"

:: Check if node is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo  ERRO: Node.js nao esta instalado!
    echo.
    echo  1. Va para https://nodejs.org
    echo  2. Clique no botao verde "LTS"
    echo  3. Instale e reinicie o computador
    echo  4. Depois abra este arquivo novamente
    echo.
    pause
    exit /b 1
)

echo  Node.js encontrado:
node --version
echo.

:: Install dependencies if needed
if not exist "node_modules" (
    echo  Instalando dependencias (so na primeira vez)...
    npm install
    echo.
)

:: Check if .env exists
if not exist ".env" (
    echo  ERRO: arquivo .env nao encontrado!
    echo  Crie o arquivo .env na pasta backend com suas credenciais.
    echo.
    pause
    exit /b 1
)

echo  Iniciando servidor...
echo  Deixe esta janela aberta enquanto os foremans estao enviando.
echo  Pressione Ctrl+C para parar.
echo.

node server.js

echo.
echo  Servidor parou.
pause
