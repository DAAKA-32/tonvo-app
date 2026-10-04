/**
 * AudioWorklet for AssemblyAI live streaming (src/services/assemblyai-stream.ts).
 *
 * Downsamples the input to `targetRate` mono and posts PCM16 little-endian
 * chunks of `chunkMs` to the main thread, which forwards them to the socket.
 *
 * Served as a static file on purpose: worklet modules are governed by the CSP
 * `script-src`, which allows 'self' but not blob: URLs.
 */
class AAIPump extends AudioWorkletProcessor {
  constructor(opts) {
    super();
    this.targetRate = opts.processorOptions.targetRate;
    this.chunkSamples = Math.round(this.targetRate * (opts.processorOptions.chunkMs / 1000));
    this.buffer = new Float32Array(0);
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || input.length === 0 || !input[0]) return true;
    const channelData = input[0];

    // Downsample (linear) from sampleRate (global) to targetRate
    const ratio = sampleRate / this.targetRate;
    const downsampledLen = Math.floor(channelData.length / ratio);
    const downsampled = new Float32Array(downsampledLen);
    for (let i = 0; i < downsampledLen; i++) {
      const srcIdx = i * ratio;
      const i0 = Math.floor(srcIdx);
      const i1 = Math.min(i0 + 1, channelData.length - 1);
      const frac = srcIdx - i0;
      downsampled[i] = channelData[i0] * (1 - frac) + channelData[i1] * frac;
    }

    // Append to ring buffer
    const merged = new Float32Array(this.buffer.length + downsampled.length);
    merged.set(this.buffer, 0);
    merged.set(downsampled, this.buffer.length);
    this.buffer = merged;

    // Emit chunks of chunkSamples
    while (this.buffer.length >= this.chunkSamples) {
      const chunk = this.buffer.slice(0, this.chunkSamples);
      this.buffer = this.buffer.slice(this.chunkSamples);

      // Float32 [-1,1] → Int16 little-endian
      const pcm16 = new Int16Array(chunk.length);
      for (let i = 0; i < chunk.length; i++) {
        const s = Math.max(-1, Math.min(1, chunk[i]));
        pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
      }
      this.port.postMessage(pcm16.buffer, [pcm16.buffer]);
    }
    return true;
  }
}

registerProcessor("aai-pump", AAIPump);
