#!/bin/bash

# Generate Java code
protoc --java_out=backend/java-services/shared-lib/src/main/java --proto_path=backend/shared/protobuf backend/shared/protobuf/*.proto

# Generate Go code
protoc --go_out=backend/go-services/shared-utils --go-grpc_out=backend/go-services/shared-utils --proto_path=backend/shared/protobuf backend/shared/protobuf/*.proto

echo "Protobuf code generated successfully!"