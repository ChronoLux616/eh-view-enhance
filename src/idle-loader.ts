import { conf } from "./config";
import EBUS from "./event-bus";
import { IMGFetcherQueue } from "./fetcher-queue";
import { FetchState } from "./img-fetcher";
import { evLog } from "./utils/ev-log";

export class IdleLoader {
  queue: IMGFetcherQueue;
  processingIndexList: number[];
  restartId?: number;
  maxWaitMS: number;
  minWaitMS: number;
  onFailedCallback?: () => void;
  autoLoad: boolean = false;
  constructor(queue: IMGFetcherQueue) {
    //图片获取器队列
    this.queue = queue;
    //当前处理的索引列表
    this.processingIndexList = [0];
    //中止后的用于重新启动的延迟器的id
    this.restartId;
    this.maxWaitMS = 1000;
    this.minWaitMS = 300;
    this.autoLoad = conf.autoLoad;
    EBUS.subscribe("ifq-on-do", (currIndex, _queue, downloading) => {
      if (downloading) return;
      this.abort(currIndex);
    });
    EBUS.subscribe("imf-on-finished", (index) => {
      // this.processingIndexList not include index mean curr task dont go continue, it aborted
      if (!this.processingIndexList.includes(index)) return;
      this.wait().then(() => {
        this.checkProcessingIndex();
        this.start();
      });
    });
  }

  onFailed(cb: () => void) {
    this.onFailedCallback = cb;
  }

  start() {
    // 如果被中止了，则停止
    if (!this.autoLoad) return;
    // 如果已经没有要处理的列表
    if (this.processingIndexList.length === 0) {
      return;
    }
    if (this.queue.length === 0) {
      return;
    }
    evLog("info", "Idle Loader start at:" + this.processingIndexList.toString());
    for (const processingIndex of this.processingIndexList) {
      this.queue[processingIndex].start(processingIndex);
    }
  }

  checkProcessingIndex() {
    if (this.queue.length === 0) {
      return;
    }
    // Skip found Fetcher
    let foundFetcherIndex = new Set<Number>();
    let hasFailed = false;
    for (let i = 0; i < this.processingIndexList.length; i++) {
      let processingIndex = this.processingIndexList[i];
      const imf = this.queue[processingIndex];
      if (imf.stage === FetchState.FAILED) {
        hasFailed = true;
      }
      // img fetcher still fetching, or not yet fetching, continue.
      if (imf.lock || imf.stage === FetchState.URL) {
        continue;
      }
      // find unfinished imgFetcher
      for (
        let j = Math.min(processingIndex + 1, this.queue.length - 1), limit = this.queue.length;
        (j < limit);
        j++
      ) {
        const imf = this.queue[j];
        // find img fetcher that hasn't been fetching
        if (!imf.lock && imf.stage === FetchState.URL && !foundFetcherIndex.has(j)) {
          foundFetcherIndex.add(j);
          this.processingIndexList[i] = j;
          break;
        }
        if (imf.stage === FetchState.FAILED) {
          hasFailed = true;
        }
        // begin from the frist, stop at the processingIndex
        if (j >= this.queue.length - 1) {
          limit = processingIndex;
          j = 0;
        }
      }
      // can not find any img fetcher that hasn't been fetching
      if (foundFetcherIndex.size === 0) {
        this.processingIndexList.length = 0;
        if (hasFailed && this.onFailedCallback) {
          this.onFailedCallback();
          this.onFailedCallback = undefined;
        }
        return;
      }
    }
  }

  async wait(): Promise<boolean> {
    const { maxWaitMS, minWaitMS } = this;
    return new Promise(function(resolve) {
      const time = Math.floor(Math.random() * maxWaitMS + minWaitMS);
      window.setTimeout(() => resolve(true), time);
    });
  }

  abort(newIndex?: number) {
    // set empty to abort the old task
    this.processingIndexList = [];
    if (!this.autoLoad) return;
    // evLog(`终止空闲自加载, 下次将从第${newIndex + 1}张开始加载`);
    // 中止空闲加载后，会在等待一段时间后再次重启空闲加载
    window.clearTimeout(this.restartId);
    if (newIndex !== undefined) {
      this.restartId = window.setTimeout(() => {
        // Double check if we are downloading
        // In case we change to a Big image, and click Download button before conf.restartIdleLoader seconds
        if (this.queue.downloading?.()) return;
        this.processingIndexList = [newIndex];
        this.checkProcessingIndex();
        this.start();
      }, conf.restartIdleLoader);
    }
  }
}

