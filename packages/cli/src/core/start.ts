/**
 * Production server for LootiScript projects
 * 
 * Serves the built production output using Vite's preview server.
 */

import path from 'path';
import fs from 'fs-extra';
import pc from 'picocolors';
import { preview } from 'vite';
import type { PreviewServer } from 'vite';

import { loadConfig } from './config-loader';
import {
    BUILD_OUTPUT_DIR,
    DEFAULT_PORT,
    DEFAULT_HOST,
    FONT_BITCELL,
    FONT_CONTENT_TYPE,
    FONT_CACHE_CONTROL,
} from '../utils';

export interface StartOptions {
    port?: number;
    host?: string | boolean;
}

/**
 * Start production server for built project
 * 
 * @param projectPath - Root path of the project
 * @param options - Server options (port, host)
 * @returns Vite preview server instance
 */
export async function start(
    projectPath: string = process.cwd(), 
    options: StartOptions = {}
): Promise<PreviewServer> {
    const config = await loadConfig(projectPath);
    const distDir = path.join(projectPath, BUILD_OUTPUT_DIR);
    
    // Check if build exists
    if (!(await fs.pathExists(distDir))) {
        console.error(pc.red('\n✗ No build found. Please run `l8b build` first.\n'));
        process.exit(1);
    }
    
    const indexHtml = path.join(distDir, 'index.html');
    if (!(await fs.pathExists(indexHtml))) {
        console.error(pc.red('\n✗ No index.html found in build output. Please run `l8b build` first.\n'));
        process.exit(1);
    }
    
    // Get port and host from config or options
    const port = options.port || config.dev?.port || DEFAULT_PORT;
    const host = options.host !== undefined ? options.host : (config.dev?.host ?? DEFAULT_HOST);
    
    console.log(pc.cyan('\n  🚀 Starting production server...\n'));
    console.log(pc.gray(`  Project: ${projectPath}\n`));
    
    try {
        const server = await preview({
            root: distDir,
            server: {
                port,
                host: typeof host === 'boolean' ? (host ? '0.0.0.0' : 'localhost') : host,
                strictPort: false,
            },
            preview: {
                port,
                host: typeof host === 'boolean' ? (host ? '0.0.0.0' : 'localhost') : host,
            },
            plugins: [
                {
                    name: 'l8b-preview-font-server',
                    configurePreviewServer(server) {
                        // Add middleware to serve fonts explicitly
                        server.middlewares.use(async (req, res, next) => {
                            // Handle font requests
                            const fontUrl = `/fonts/${FONT_BITCELL}`;
                            if (req.url && (req.url === fontUrl || req.url.startsWith(fontUrl))) {
                                const fontPath = path.join(distDir, 'fonts', FONT_BITCELL);
                                if (await fs.pathExists(fontPath)) {
                                    try {
                                        const fontData = await fs.readFile(fontPath);
                                        res.setHeader('Content-Type', FONT_CONTENT_TYPE);
                                        res.setHeader('Cache-Control', FONT_CACHE_CONTROL);
                                        res.end(fontData);
                                        return;
                                    } catch (error) {
                                        console.error('[L8B CLI] Error serving font:', error);
                                    }
                                }
                            }
                            next();
                        });
                    },
                },
            ],
        });
        
        console.log('\n🚀 Production server running!\n');
        server.printUrls();
        
        /**
         * Cleanup function for graceful shutdown
         */
        const cleanup = async () => {
            console.log('\n\nShutting down server...');
            try {
                // Vite preview returns a VitePreviewServer
                // Close the underlying http server if available
                if (server.httpServer) {
                    await new Promise<void>((resolve, reject) => {
                        server.httpServer!.close((err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    });
                }
                process.exit(0);
            } catch (error) {
                console.error('Error during cleanup:', error);
                process.exit(1);
            }
        };
        
        process.on('SIGTERM', cleanup);
        process.on('SIGINT', cleanup);
        
        // Handle uncaught errors
        process.on('unhandledRejection', (reason) => {
            console.error('Unhandled rejection:', reason);
        });
        
        return server;
    } catch (error) {
        console.error(pc.red('\n✗ Error starting server:\n'));
        console.error(error);
        throw error;
    }
}

