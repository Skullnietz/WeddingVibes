const { build } = require('esbuild');

build({
    entryPoints: ['server/_core/index.ts'],
    bundle: true,
    platform: 'node',
    format: 'esm',
    outdir: 'dist',
    packages: 'external',
    /** 
     * Bundle these specific packages into the final index.js file instead of 
     * leaving them as external node_modules imports. This is required because
     * Hostinger's lsnode.js CommonJS runner fails to resolve dynamic ESM 
     * sub-dependencies like mysql2 and drizzle-orm at runtime. 
     */
    external: [
        // Tell esbuild to keep all other packages external...
    ],
    // ...but force it to bundle these tricky database drivers
    plugins: [
        {
            name: 'bundle-mysql-drivers',
            setup(build) {
                build.onResolve({ filter: /^(mysql2|drizzle-orm\/mysql2)/ }, args => {
                    return { external: false };
                });
            },
        },
    ],
}).catch(() => process.exit(1));
