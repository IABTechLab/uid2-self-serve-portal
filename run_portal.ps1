# Change to uid2-admin directory, and push location to stack
Push-Location -Path "../uid2-admin" -ErrorAction Stop

# Run admin docker & application
try {
    Write-Host "Running docker compose for uid2-admin..."
    docker compose up -d
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Docker compose failed in uid2-admin with exit code $LASTEXITCODE"
        exit 1
    }

    Write-Host "Running admin application..."
    Start-Process "mvn" -ArgumentList "clean compile exec:java", "-Dvertx-config-path=conf/local-config.json", "-Dvertx.logger-delegate-factory-class-name=io.vertx.core.logging.SLF4JLogDelegateFactory", "-Dlogback.configurationFile=conf/logback.xml" -WindowStyle Hidden
} catch {
    Write-Error ("An error occurred: " + $_.Exception.Message)
    exit 1
} finally {
    # Always go back to self-serve-portal directory, regardless of success or failure
    Pop-Location
}

# Run portal docker & application
try {
    Write-Host "Running docker compose for uid2-self-serve-portal..."
    docker compose up -d
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Docker compose failed in uid2-self-serve-portal with exit code $LASTEXITCODE"
        exit 1
    }
    
    Write-Host "Running npm run dev..."
    npm run dev
    if ($LASTEXITCODE -ne 0) {
        Write-Error "npm run dev failed with exit code $LASTEXITCODE"
        exit 1
    }
} catch {
    Write-Error ("An error occurred: " + $_.Exception.Message)
    exit 1
}
