import type { ToneResult, ConversationSignal, SessionState } from "./types";

// Popup -> Background
export interface StartSessionMsg { type: "START_SESSION"; tabId: number }
export interface StopSessionMsg { type: "STOP_SESSION" }
export interface GetStatusMsg { type: "GET_STATUS" }

// Background -> Content Script
export interface ToneUpdateMsg { type: "TONE_UPDATE"; data: ToneResult }
export interface SessionStartedMsg { type: "SESSION_STARTED" }
export interface SessionStoppedMsg { type: "SESSION_STOPPED" }
export interface ProcessingMsg { type: "PROCESSING" }
export interface SignalDetectedMsg { type: "SIGNAL_DETECTED"; signal: ConversationSignal; label: string }
export interface StatusResponseMsg { type: "STATUS_RESPONSE"; state: SessionState }

// Background -> Offscreen
export interface StartRecordingMsg { type: "START_RECORDING"; streamId: string }
export interface StopRecordingMsg { type: "STOP_RECORDING" }

// Offscreen -> Background
export interface AudioChunkMsg { type: "AUDIO_CHUNK"; data: number[] }

// Content Script -> Background
export interface PlatformDetectedMsg { type: "PLATFORM_DETECTED"; platform: "meet" | "zoom" | "teams" }

export type Message =
  | StartSessionMsg
  | StopSessionMsg
  | GetStatusMsg
  | ToneUpdateMsg
  | SessionStartedMsg
  | SessionStoppedMsg
  | ProcessingMsg
  | SignalDetectedMsg
  | StatusResponseMsg
  | StartRecordingMsg
  | StopRecordingMsg
  | AudioChunkMsg
  | PlatformDetectedMsg;
