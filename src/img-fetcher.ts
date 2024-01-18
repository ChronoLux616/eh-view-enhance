import { Matcher } from "./platform/platform";
import { evLog } from "./utils/ev-log";
import { xhrWapper } from "./utils/query";

type DownloadState = {
  total: number;
  loaded: number;
  /**
   * Unsent = 0,
   * Opened = 1,
   * HeadersReceived = 2,
   * Loading = 3,
   * Done = 4
   */
  readyState: 0 | 1 | 2 | 3 | 4;
}

type ResultCallback = (index: number, imgFetcher: IMGFetcher) => void;

export enum FetchState {
  FAILED = 0,
  URL = 1,
  DATA = 2,
  DONE = 3,
}

export type IMGFetcherSettings = {
  matcher: Matcher;
  downloadStateReporter?: (state: DownloadState) => void;
  setNow?: (index: number) => void;
  onClick?: (event: MouseEvent) => void;
}

export class IMGFetcher {
  root: HTMLElement;
  imgElement: HTMLImageElement;
  pageUrl: string;
  bigImageUrl?: string;
  stage: FetchState = FetchState.URL;
  tryTimes: number = 0;
  lock: boolean = false;
  /// 0: not rendered, 1: rendered tumbinal, 2: rendered big image
  rendered: 0 | 1 | 2 = 0;
  data?: Uint8Array;
  contentType?: string;
  blobUrl?: string;
  title: string;
  downloadState: DownloadState;
  onFinishedEventContext: Map<string, ResultCallback>;
  onFailedEventContext: Map<string, ResultCallback>;
  downloadBar?: HTMLElement;
  timeoutId?: number;
  settings: IMGFetcherSettings;

  constructor(node: HTMLElement, settings: IMGFetcherSettings) {
    this.root = node;
    this.imgElement = node.firstChild as HTMLImageElement;
    this.pageUrl = this.imgElement.getAttribute("ahref")!;
    this.title = this.imgElement.getAttribute("title") || "untitle.jpg";
    this.downloadState = { total: 100, loaded: 0, readyState: 0, };
    /**
     * 当获取完成时的回调函数，从其他地方进行事件注册
     */
    this.onFinishedEventContext = new Map();
    this.onFailedEventContext = new Map();
    this.settings = settings;
    this.root.addEventListener("click", (event) => settings.onClick?.(event));
  }

  // 刷新下载状态
  setDownloadState(newState: Partial<DownloadState>) {
    this.downloadState = { ...this.downloadState, ...newState };
    if (this.downloadState.readyState === 4) {
      if (this.downloadBar && this.downloadBar.parentNode) {
        // this.downloadBar.remove(); // in steam, it randomly throw parentNode is null
        this.downloadBar.parentNode.removeChild(this.downloadBar);
      }
      return;
    }
    if (!this.downloadBar) {
      const downloadBar = document.createElement("div");
      downloadBar.classList.add("downloadBar");
      downloadBar.innerHTML = `
      <progress style="position: absolute; width: 100%; height: 7px; left: 0; bottom: 0; border: none;" value="0" max="100" />
      `;
      this.downloadBar = downloadBar;
      this.root.appendChild(this.downloadBar);
    }
    if (this.downloadBar) {
      this.downloadBar.querySelector("progress")!.setAttribute("value", (this.downloadState.loaded / this.downloadState.total) * 100 + "");
    }
    this.settings.downloadStateReporter?.(this.downloadState);
  }

  async start(index: number) {
    if (this.lock) return;
    this.lock = true;
    try {
      this.changeStyle(ChangeStyleAction.ADD);
      await this.fetchImage();
      this.changeStyle(ChangeStyleAction.REMOVE, FetchStatus.SUCCESS);
      this.onFinishedEventContext.forEach((callback) => callback(index, this));
    } catch (error) {
      this.changeStyle(ChangeStyleAction.REMOVE, FetchStatus.FAILED);
      evLog(`IMG-FETCHER ERROR:`, error);
      this.stage = FetchState.FAILED;
      this.onFailedEventContext.forEach((callback) => callback(index, this));
      // TODO: show error on image
    } finally {
      this.lock = false;
    }
  }

  onFinished(eventId: string, callback: ResultCallback) {
    this.onFinishedEventContext.set(eventId, callback);
  }

  onFailed(eventId: string, callback: ResultCallback) {
    this.onFailedEventContext.set(eventId, callback);
  }

  retry() {
    if (this.stage !== FetchState.DONE) {
      this.changeStyle(ChangeStyleAction.REMOVE);
      this.stage = FetchState.URL;
    }
  }

  async fetchImage(): Promise<void> {
    this.tryTimes = 0;
    while (this.tryTimes < 3) {
      switch (this.stage) {
        case FetchState.FAILED:
        case FetchState.URL:
          let url = await this.fetchImageURL();
          if (url !== null) {
            this.bigImageUrl = url;
            this.stage = FetchState.DATA;
          } else {
            this.tryTimes++;
          }
          break;
        case FetchState.DATA:
          const ret = await this.fetchImageData();
          if (ret !== null) {
            [this.data, this.contentType] = ret;
            this.blobUrl = URL.createObjectURL(new Blob([this.data], { type: this.contentType }));
            if (this.rendered === 2) {
              // this.imgElement.onload = () => this.blobUrl && URL.revokeObjectURL(this.blobUrl);
              this.imgElement.src = this.blobUrl;
            }
            this.stage = FetchState.DONE;
          } else {
            this.stage = FetchState.URL;
            this.tryTimes++;
          }
          break;
        case FetchState.DONE:
          return;
      }
    }
    throw new Error(`Fetch image failed, reach max try times, current stage: ${this.stage}`);
  }

  async fetchImageURL(): Promise<string | null> {
    try {
      const imageURL = await this.settings.matcher.matchImgURL(this.pageUrl, this.tryTimes > 0);
      if (!imageURL) {
        evLog("Fetch URL failed, the URL is empty");
        return null;
      }
      return imageURL;
    } catch (error) {
      evLog(`Fetch URL error:`, error);
      return null;
    }
  }

  async fetchImageData(): Promise<[Uint8Array, string] | null> {
    try {
      const data = await this.fetchBigImage();
      if (data == null) {
        throw new Error(`Data is null, image url:${this.bigImageUrl}`);
      }
      const type = data.type;
      return data.arrayBuffer().then((buffer) => [new Uint8Array(buffer), type]);
    } catch (error) {
      evLog(`Fetch image data error:`, error);
      return null;
    }
  }

  render() {
    switch (this.rendered) {
      case 0:
      case 1:
        if (this.blobUrl) {
          this.imgElement.src = this.blobUrl;
        } else {
          this.imgElement.src = this.imgElement.getAttribute("asrc")!;
        }
        this.rendered = 2;
        break;
      case 2:
        break;
    }
  }

  unrender() {
    if (this.rendered === 1 || this.rendered === 0) return;
    this.rendered = 1;
    this.imgElement.src = this.imgElement.getAttribute("asrc")!;
  }

  //立刻将当前元素的src赋值给大图元素
  setNow(index: number) {
    this.settings.setNow?.(index);
    if (this.stage === FetchState.DONE) {
      this.onFinishedEventContext.forEach((callback) => callback(index, this));
    }
  }


  async fetchBigImage(): Promise<Blob | null> {
    if (this.bigImageUrl?.startsWith("blob:")) {
      return await fetch(this.bigImageUrl).then(resp => resp.blob());
    }
    // make fake large image blob
    // if (true) {
    //   return new Blob([new ArrayBuffer(1024 * 1024 * 30)], { type: "image/jpeg" });
    // }
    const imgFetcher = this;
    return new Promise(async (resolve, reject) => {
      xhrWapper(imgFetcher.bigImageUrl!, "blob", {
        onload: function(response) {
          let data = response.response;
          if (data.type === "text/html") {
            // TODO: check response type, e.g. status code
            console.error("warn: fetch big image data type is not blob: ", data);
          }
          try {
            imgFetcher.setDownloadState({ readyState: response.readyState });
          } catch (error) {
            evLog("warn: fetch big image data onload setDownloadState error:", error);
          }
          resolve(data);
        },
        onerror: function(response) {
          reject(`error:${response.error}, response:${response.response}`);
        },
        ontimeout: function() {
          reject("timeout");
        },
        onprogress: function(response) {
          imgFetcher.setDownloadState({ total: response.total, loaded: response.loaded, readyState: response.readyState });
        },
        onloadstart: function() {
          imgFetcher.setDownloadState(imgFetcher.downloadState);
        }
      });
    });
  }

  changeStyle(action: ChangeStyleAction, fetchStatus?: FetchStatus) {
    switch (action) {
      case ChangeStyleAction.ADD:
        this.imgElement.classList.add("fetching");
        break;
      case ChangeStyleAction.REMOVE:
        this.imgElement.classList.remove("fetching");
        break;
    }
    switch (fetchStatus) {
      case FetchStatus.SUCCESS:
        this.imgElement.classList.add("fetched");
        this.imgElement.classList.remove("fetch-failed");
        break;
      case FetchStatus.FAILED:
        this.imgElement.classList.add("fetch-failed");
        this.imgElement.classList.remove("fetched");
        break;
      default:
        this.imgElement.classList.remove("fetched");
        this.imgElement.classList.remove("fetch-failed");
    }
  }
}

enum ChangeStyleAction {
  ADD,
  REMOVE,
}
enum FetchStatus {
  SUCCESS,
  FAILED,
}
