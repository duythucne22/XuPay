package com.fintech.user.config;

import io.grpc.netty.shaded.io.grpc.netty.NettyServerBuilder;
import io.grpc.netty.shaded.io.netty.channel.nio.NioEventLoopGroup;
import io.grpc.netty.shaded.io.netty.channel.socket.nio.NioServerSocketChannel;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.server.serverfactory.GrpcServerConfigurer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class GrpcServerConfig {

    @Bean
    public GrpcServerConfigurer grpcServerConfigurer() {
        return serverBuilder -> {
            if (serverBuilder instanceof NettyServerBuilder) {
                NettyServerBuilder nettyServerBuilder = (NettyServerBuilder) serverBuilder;
                // Use NIO instead of Epoll for Windows compatibility
                nettyServerBuilder
                    .channelType(NioServerSocketChannel.class)
                    .bossEventLoopGroup(new NioEventLoopGroup(1))
                    .workerEventLoopGroup(new NioEventLoopGroup());
                log.info("Configured gRPC server with NIO transport (Windows compatible)");
            }
        };
    }
}