const { execSync } = require('child_process');

console.log('Running postinstall permissions fix...');
try {
    // Only attempt to run chmod if not on Windows
    if (process.platform !== 'win32') {
        // Attempt to recursively grant execute permissions to all esbuild binaries in the pnpm cache
        execSync('chmod +x node_modules/.pnpm/@esbuild*/node_modules/@esbuild/*/bin/esbuild 2>/dev/null || true');
        console.log('esbuild permissions patched successfully.');
    } else {
        console.log('Skipping permission patch on Windows.');
    }
} catch (error) {
    console.log('Permission patch skipped or failed (expected if non-Linux/esbuild path varies).');
}
