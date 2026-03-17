import * as esbuild from "esbuild";

const watch = process.argv.includes("--watch");

const config = {
  bundle: true,
  format: "esm",
  target: "chrome120",
  sourcemap: true,
  minify: !watch,
};

const entries = [
  { entryPoints: ["src/background/service-worker.ts"], outfile: "dist/service-worker.js" },
  { entryPoints: ["src/content/content-script.ts"], outfile: "dist/content-script.js", format: "iife" },
  { entryPoints: ["src/offscreen/offscreen.ts"], outfile: "dist/offscreen.js" },
  { entryPoints: ["src/popup/popup.ts"], outfile: "dist/popup.js" },
];

async function build() {
  for (const entry of entries) {
    const opts = { ...config, ...entry };
    if (entry.format) opts.format = entry.format;
    if (watch) {
      const ctx = await esbuild.context(opts);
      await ctx.watch();
      console.log(`Watching ${entry.entryPoints[0]}...`);
    } else {
      await esbuild.build(opts);
      console.log(`Built ${entry.outfile}`);
    }
  }
}

build().catch((e) => { console.error(e); process.exit(1); });
