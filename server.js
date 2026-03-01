// Pass-through entry for Hostinger Deployment (CommonJS compatible wrapper)
async function start() {
    await import('./dist/index.js');
}

start().catch(console.error);
