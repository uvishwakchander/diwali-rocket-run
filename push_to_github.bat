@echo off
echo ========================================================
echo   Diwali Rocket Run - Push to GitHub Repository
echo   Target: https://github.com/uvishwakchander/diwali-rocket-run
echo ========================================================
echo.

cd /d "%~dp0"

echo 1. Initializing Git repository...
git init

echo.
echo 2. Setting branch to main...
git branch -M main

echo.
echo 3. Staging all files...
git add .

echo.
echo 4. Creating initial commit...
git commit -m "Initial commit: Diwali Rocket Run 3D Game (CDC2 Chennai to BDC14 Bangalore)"

echo.
echo 5. Linking remote repository...
git remote remove origin 2>nul
git remote add origin https://github.com/uvishwakchander/diwali-rocket-run.git

echo.
echo 6. Pushing files to GitHub...
echo (If prompted, please log into your GitHub account in the pop-up browser window)
echo.
git push -u origin main --force

echo.
echo ========================================================
if %ERRORLEVEL% EQU 0 (
    echo SUCCESS: Files pushed to https://github.com/uvishwakchander/diwali-rocket-run
    echo.
    echo Next Step:
    echo Enable GitHub Pages in your repo Settings -^> Pages -^> Branch: main
    echo Your game will be live at: https://uvishwakchander.github.io/diwali-rocket-run/
) else (
    echo NOTE: If the push failed, please ensure you created the empty repo at:
    echo https://github.com/new with repository name: diwali-rocket-run
)
echo ========================================================
echo.
pause
