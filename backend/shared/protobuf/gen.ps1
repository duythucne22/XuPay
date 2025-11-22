#!/usr/bin/env pwsh

# Set execution policy if needed
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force

$rootDir = Resolve-Path "$PSScriptRoot/../../.."
$protoDir = $PSScriptRoot
# Changed 'proto' to 'protobuf' to match your source folder name
$goOut = "$rootDir/backend/shared/protobuf/gen/go"
$javaOut = "$rootDir/backend/shared/protobuf/gen/java"
$tsOut = "$rootDir/frontend/design-system/src/proto"

# Create output directories
New-Item -Path $goOut -ItemType Directory -Force | Out-Null
New-Item -Path $javaOut -ItemType Directory -Force | Out-Null
New-Item -Path $tsOut -ItemType Directory -Force | Out-Null

Write-Host "Generating Go code..." -ForegroundColor Green
# We must generate each file into its own subdirectory because they have different packages
Get-ChildItem "$protoDir/*.proto" | ForEach-Object {
    $fileName = $_.BaseName # e.g., "payment"
    $fileOutDir = "$goOut/$fileName"
    
    # Create specific subdirectory for the package (e.g., gen/go/payment)
    New-Item -Path $fileOutDir -ItemType Directory -Force | Out-Null

    Write-Host "  -> Generating $fileName..." -ForegroundColor Gray
    protoc --go_out=$fileOutDir --go_opt=paths=source_relative `
           --go-grpc_out=$fileOutDir --go-grpc_opt=paths=source_relative `
           --proto_path=$protoDir `
           $_.FullName
}

Write-Host "Generating Java code..." -ForegroundColor Green
protoc --java_out=$javaOut `
       --proto_path=$protoDir `
       "$protoDir/*.proto"

# Note: Java gRPC usually requires a plugin path or Maven/Gradle plugin. 
# Skipping --grpc-java_out for raw protoc unless you have the plugin binary path.

Write-Host "Generating TypeScript code..." -ForegroundColor Green
# Ensure you have installed ts-proto: npm install ts-proto
$tsProtoPlugin = "$rootDir/frontend/design-system/node_modules/.bin/protoc-gen-ts_proto.cmd"

if (Test-Path $tsProtoPlugin) {
    protoc --plugin=protoc-gen-ts_proto=$tsProtoPlugin `
           --ts_proto_out=$tsOut `
           --ts_proto_opt=esModuleInterop=true `
           --proto_path=$protoDir `
           "$protoDir/*.proto"
} else {
    Write-Host "⚠️  TypeScript plugin not found at $tsProtoPlugin. Skipping TS generation." -ForegroundColor Yellow
}

Write-Host "✅ Code generation completed successfully!" -ForegroundColor Cyan