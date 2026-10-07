/**
 * Audio for the try page: a microphone recording or a file, turned into the 16 kHz mono 16-bit
 * WAV the API accepts (functions/_lib/try.ts `wavSeconds`). Browser only.
 */

export const RATE = 16_000;

export class AudioError extends Error {
  constructor(readonly code: 'mic_denied' | 'no_audio_support' | 'too_long' | 'not_audio') {
    super(code);
  }
}

/** 16 kHz mono 16-bit PCM WAV of `samples` (−1…1). */
export function encodeWav(samples: Float32Array): Blob {
  const bytes = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(bytes);
  const tag = (at: number, text: string) => {
    for (let i = 0; i < 4; i++) view.setUint8(at + i, text.charCodeAt(i));
  };
  tag(0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  tag(8, 'WAVE');
  tag(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, RATE, true);
  view.setUint32(28, RATE * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  tag(36, 'data');
  view.setUint32(40, samples.length * 2, true);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i] ?? 0));
    view.setInt16(44 + i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return new Blob([bytes], { type: 'audio/wav' });
}

/** `buffer` mixed down to one channel and resampled to 16 kHz. */
async function toMono16k(buffer: AudioBuffer): Promise<Float32Array> {
  const length = Math.max(1, Math.ceil(buffer.duration * RATE));
  const offline = new OfflineAudioContext(1, length, RATE);
  const source = offline.createBufferSource();
  source.buffer = buffer;
  source.connect(offline.destination);
  source.start();
  return (await offline.startRendering()).getChannelData(0);
}

/** A file the browser can decode, at most `maxSeconds` long, as WAV. */
export async function fileToWav(file: File, maxSeconds: number): Promise<{ wav: Blob; seconds: number }> {
  if (typeof OfflineAudioContext === 'undefined') throw new AudioError('no_audio_support');
  const context = new AudioContext();
  let decoded: AudioBuffer;
  try {
    decoded = await context.decodeAudioData(await file.arrayBuffer());
  } catch {
    throw new AudioError('not_audio');
  } finally {
    void context.close();
  }
  if (decoded.duration > maxSeconds + 0.25) throw new AudioError('too_long');
  return { wav: encodeWav(await toMono16k(decoded)), seconds: decoded.duration };
}

export interface Recording {
  /** Stops and returns the take as WAV. */
  stop(): Promise<{ wav: Blob; seconds: number }>;
  /** Stops and drops the take. */
  cancel(): void;
}

/**
 * Records from the microphone until `stop()`, or until `maxSeconds` have passed, when `onLimit`
 * is called; `onLevel` gets the input level (0…1) and the seconds so far.
 */
export async function record(maxSeconds: number, onLevel: (level: number, seconds: number) => void, onLimit: () => void): Promise<Recording> {
  if (!navigator.mediaDevices?.getUserMedia || typeof AudioContext === 'undefined') throw new AudioError('no_audio_support');
  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true } });
  } catch {
    throw new AudioError('mic_denied');
  }
  const context = new AudioContext();
  const input = context.createMediaStreamSource(stream);
  // ScriptProcessor is deprecated but everywhere; a minute of audio needs nothing finer.
  const processor = context.createScriptProcessor(4096, 1, 1);
  const chunks: Float32Array[] = [];
  let frames = 0;
  let limited = false;
  processor.onaudioprocess = (event) => {
    const data = event.inputBuffer.getChannelData(0);
    chunks.push(new Float32Array(data));
    frames += data.length;
    let peak = 0;
    for (let i = 0; i < data.length; i += 16) peak = Math.max(peak, Math.abs(data[i] ?? 0));
    const seconds = frames / context.sampleRate;
    onLevel(Math.min(1, peak * 1.6), seconds);
    if (!limited && seconds >= maxSeconds) {
      limited = true;
      onLimit();
    }
  };
  input.connect(processor);
  processor.connect(context.destination);
  const close = () => {
    processor.disconnect();
    input.disconnect();
    for (const track of stream.getTracks()) track.stop();
  };
  return {
    async stop() {
      close();
      const all = new Float32Array(Math.min(frames, Math.ceil(maxSeconds * context.sampleRate)));
      let at = 0;
      for (const chunk of chunks) {
        if (at >= all.length) break;
        all.set(chunk.subarray(0, all.length - at), at);
        at += chunk.length;
      }
      const buffer = context.createBuffer(1, Math.max(1, all.length), context.sampleRate);
      buffer.copyToChannel(all, 0);
      void context.close();
      return { wav: encodeWav(await toMono16k(buffer)), seconds: all.length / context.sampleRate };
    },
    cancel() {
      close();
      void context.close();
    },
  };
}
