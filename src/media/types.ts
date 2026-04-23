export type MediaSourceType = "video" | "music" | "audio";

export interface MediaSessionQueueItem {
  id: string;
  title: string;
  artist?: string;
  artwork?: string;
  duration?: number;
}

export interface MusicPlaybackSnapshot {
  /** 当前 active provider id（如 `"apple-music"`）；null 表示无活跃源。 */
  activeProvider: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
}

export interface LoadAndPlayOptions {
  /** App / 业务层的 provider 名（用于互斥与 active 判断）。 */
  provider: string;
  /** 当前播放音轨 id（用于 onEnded 时判断是否仍是当前曲目）。 */
  trackId?: string;
  /** 起始播放位置（秒）。 */
  startTime?: number;
  /** 自定义请求头（用于鉴权 / Range）。 */
  headers?: Record<string, string>;
  /** 是否以 HLS 形式播放（m3u8）。 */
  hls?: boolean;
}

export interface MediaSessionSource {
  id: string;
  type: MediaSourceType;
  provider?: string;
  trackId?: string;
  /** UI 显示用的 label（如 "Apple Music"）。 */
  label?: string;
  title: string;
  artist?: string;
  album?: string;
  artwork?: string;
  isPlaying: boolean;
  getCurrentTime: () => number;
  getDuration: () => number;
  volume: number;
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  next?: () => void;
  previous?: () => void;
  getAnalyser?: () => AnalyserNode | null;
  queue: MediaSessionQueueItem[];
  currentIndex: number;
  skipToIndex?: (index: number) => void;
  removeFromQueue?: (index: number) => void;
  /**
   * Returns the current playback state for persistence. Host's media center
   * (single write authority) calls this when notifySaveNeeded fires. Shape
   * must match host PlaybackStateData["music"]; we keep it `unknown` here to
   * avoid coupling the SDK to host internals.
   */
  buildPersistState?: () => unknown;
}

/** host 侧共享给 bundle 的媒体会话只读快照。 */
export interface MediaSessionSnapshot {
  activeSource: MediaSessionSource | null;
  /**
   * 从服务端拉回的持久化播放数据，由 host 定义具体类型。
   * 对 SDK 是 opaque —— bundle 自行 cast 到业务类型（如 apple-music 的
   * `PlaybackStateData`）。
   */
  rawPlaybackData: unknown;
  /** host 初次加载完成后置 true。 */
  rawPlaybackDataReady: boolean;
}
