import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import dotenv from 'dotenv';
import { connectDatabase, disconnectDatabase } from '@/config/database';
import { errorHandler } from '@/middleware/errorHandler';
import { notFoundHandler } from '@/middleware/notFound';
import { logger } from '@/utils/logger';
import { authRoutes } from '@/routes/auth.routes';
import { connectionRoutes } from '@/routes/connection.routes';

dotenv.config();

const fastify = Fastify({
  logger: false,
  trustProxy: true,
  bodyLimit: 1048576,
});

async function setupServer() {
  try {
    await fastify.register(helmet, {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
    });

    await fastify.register(cors, {
      origin: (origin, cb) => {
        if (!origin) {
          cb(null, true);
          return;
        }
        
        try {
          const hostname = new URL(origin).hostname;
          
          if (process.env.NODE_ENV === 'production') {
            const allowedOrigins = process.env.FRONTEND_URL 
              ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
              : [];
            
            if (allowedOrigins.includes(origin)) {
              cb(null, true);
            } else {
              cb(new Error('Not allowed by CORS'), false);
            }
          } else {
            if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
              cb(null, true);
            } else {
              cb(new Error('Not allowed by CORS'), false);
            }
          }
        } catch (error) {
          cb(new Error('Invalid origin'), false);
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    });

    await fastify.register(rateLimit, {
      max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
      timeWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '60000', 10),
      errorResponseBuilder: () => ({
        status: 'error',
        message: 'Muitas requisições. Tente novamente em alguns instantes.',
      }),
    });

    fastify.get('/health', async () => {
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
      };
    });

        await fastify.register(authRoutes, { prefix: '/api/auth' });
        await fastify.register(connectionRoutes, { prefix: '/api/connections' });

        fastify.setNotFoundHandler(notFoundHandler);
        fastify.setErrorHandler(errorHandler);

    await connectDatabase();

    logger.info('Server setup completed successfully');
  } catch (error) {
    logger.error('Failed to setup server', error as Error);
    throw error;
  }
}

async function start() {
  try {
    await setupServer();

    const port = parseInt(process.env.PORT || '3000', 10);
    const host = process.env.HOST || '0.0.0.0';

    await fastify.listen({ port, host });

    logger.info('Server started', {
      port,
      host,
      environment: process.env.NODE_ENV || 'development',
      url: `http://${host}:${port}`,
    });
  } catch (error) {
    logger.error('Failed to start server', error as Error);
    await disconnectDatabase();
    process.exit(1);
  }
}

async function gracefulShutdown(signal: string) {
  logger.info(`Received ${signal}, shutting down gracefully`);

  try {
    await fastify.close();
    await disconnectDatabase();
    logger.info('Server shut down successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown', error as Error);
    process.exit(1);
  }
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', new Error(String(reason)), { promise });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', error);
  gracefulShutdown('uncaughtException');
});

start();
