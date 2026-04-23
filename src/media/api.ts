import type {
  LoadAndPlayOptions,
  MediaSessionSnapshot,
  MediaSessionSource,
  MusicPlaybackSnapshot,
} from "./types";

export interface ShellMediaApi {
  // Central engine ── 跨 app 单例
  loadAndPlay: (url: string, opts: LoadAndPlayOptions) => Promise<void>;
  pause: () => void;
  resume: () => void;
  seek: (time: number) => void;
  stop: () => void;
  setVolume: (vol: number) => void;
  setInitialVolume: (vol: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getIsPlaying: () => boolean;
  getActiveProvider: () => string | null;
  getAnalyser: () => AnalyserNode | null;
  getSnapshot: () => MusicPlaybackSnapshot;
  /** 订阅引擎状态变化（每次 snapshot 改变都触发）。返回 unsubscribe。 */
  subscribe: (listener: () => void) => () => void;
  /** 当前曲目播放结束回调。返回 unsubscribe。 */
  onEnded: (cb: () => void) => () => void;

  // Media session（跨 app 注册 + 系统级播放器互斥）
  registerSession: (source: MediaSessionSource) => () => void;
  /** 局部更新已注册 source 的元数据（不触发 React 重渲染）。 */
  updateSession: (id: string, patch: Partial<MediaSessionSource>) => void;
  requestPlay: (id: string, provider?: string) => void;
  notifyPause: (id: string, provider?: string) => void;
  notifyClose: (id: string, provider?: string) => void;
  /**
   * 读取 host 当前媒体会话快照（活跃源 + 持久化播放数据）。
   * 跨 app 只读访问：apple-music 需根据 host 活跃源判断是否在播放自己。
   */
  getSessionSnapshot: () => MediaSessionSnapshot;
  /** 订阅会话快照变化（activeSource / rawPlaybackData 任一变动都触发）。 */
  subscribeSession: (listener: () => void) => () => void;
  /**
   * 通知 host 当前源状态需要持久化。只对 active source 生效。
   * `immediate: true` 跳过 debounce（用于 play/pause/next 等关键动作）。
   */
  notifySaveNeeded: (
    id: string,
    provider?: string,
    immediate?: boolean,
  ) => void;
}
