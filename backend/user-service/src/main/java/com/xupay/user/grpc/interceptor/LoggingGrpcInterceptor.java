package com.xupay.user.grpc.interceptor;

import io.grpc.*;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.server.interceptor.GrpcGlobalServerInterceptor;
import org.springframework.stereotype.Component;

/**
 * gRPC Interceptor for Logging
 * Logs all gRPC calls with method name, duration, and status
 */
@Component
@GrpcGlobalServerInterceptor
@Slf4j
public class LoggingGrpcInterceptor implements ServerInterceptor {

    @Override
    public <ReqT, RespT> ServerCall.Listener<ReqT> interceptCall(
            ServerCall<ReqT, RespT> call,
            Metadata headers,
            ServerCallHandler<ReqT, RespT> next) {
        
        String methodName = call.getMethodDescriptor().getFullMethodName();
        long startTime = System.currentTimeMillis();
        
        log.info("gRPC call started: {}", methodName);
        
        // Wrap the ServerCall to log on completion
        ServerCall<ReqT, RespT> wrappedCall = new ForwardingServerCall.SimpleForwardingServerCall<>(call) {
            @Override
            public void close(Status status, Metadata trailers) {
                long duration = System.currentTimeMillis() - startTime;
                
                if (status.isOk()) {
                    log.info("gRPC call completed successfully: {} | Duration: {}ms", methodName, duration);
                } else {
                    log.warn("gRPC call failed: {} | Status: {} | Description: {} | Duration: {}ms", 
                            methodName, status.getCode(), status.getDescription(), duration);
                }
                
                super.close(status, trailers);
            }
        };
        
        return next.startCall(wrappedCall, headers);
    }
}
