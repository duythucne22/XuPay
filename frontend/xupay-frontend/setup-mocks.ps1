# Quick setup script for MSW and mock infrastructure (Windows)

Write-Host "Installing MSW..." -ForegroundColor Green
npm install msw@latest --save-dev

Write-Host "`nInitializing MSW service worker..." -ForegroundColor Green
npx msw init public/ --save

Write-Host "`n✅ MSW setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Copy .env.local.example to .env.local"
Write-Host "2. Set NEXT_PUBLIC_USE_MOCKS=true in .env.local"
Write-Host "3. Run: npm run dev"
Write-Host "4. Check browser console for '[MSW] Mock Service Worker started ✅'"
