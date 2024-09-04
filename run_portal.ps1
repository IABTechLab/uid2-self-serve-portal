# Change to uid2-admin directory, run docker compose and then maven compile
Set-Location -Path "../uid2-admin" -ErrorAction Stop
docker compose up -d
if ($LASTEXITCODE -ne 0) {
    Write-Error "Docker compose failed in uid2-admin"
    exit 1
}

Start-Process "mvn" -ArgumentList "clean compile exec:java", "-Dvertx-config-path=conf/local-config.json", "-Dvertx.logger-delegate-factory-class-name=io.vertx.core.logging.SLF4JLogDelegateFactory", "-Dlogback.configurationFile=conf/logback.xml" -WindowStyle Hidden
if ($LASTEXITCODE -ne 0) {
    Write-Error "Maven clean compile for admin failed."
    exit 1
}

# Change back to the uid2-self-serve-portal directory, run docker compose and npm command
Set-Location -Path "..\uid2-self-serve-portal" -ErrorAction Stop
docker compose up -d
if ($LASTEXITCODE -ne 0) {
    Write-Error "Docker compose failed in uid2-self-serve-portal."
    exit 1
}

npm run dev
if ($LASTEXITCODE -ne 0) {
    Write-Error "npm run dev failed."
    exit 1
}
