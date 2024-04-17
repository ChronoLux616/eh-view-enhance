import { conf } from "./config";
import { DownloadState } from "./img-fetcher";
import { Chapter } from "./page-fetcher";

const DEFAULT_THUMBNAIL = "data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";

const DEFAULT_NODE_TEMPLATE = document.createElement("div");
DEFAULT_NODE_TEMPLATE.classList.add("img-node");
DEFAULT_NODE_TEMPLATE.innerHTML = `<a><img decoding="async" loading="lazy" title="untitle.jpg" src="${DEFAULT_THUMBNAIL}" /></a>`;

const OVERLAY_TIP = document.createElement("div");
OVERLAY_TIP.classList.add("overlay-tip");
OVERLAY_TIP.innerHTML = `<span>GIF</span>`;

export interface VisualNode {
  create(): HTMLElement;
  render(): void;
}

export default class ImageNode {
  root?: HTMLElement;
  src: string;
  href: string;
  title: string;
  onclick?: (event: MouseEvent) => void;
  imgElement?: HTMLImageElement;
  delaySRC?: Promise<string>;
  private blobUrl?: string;
  private mimeType?: string;
  private size?: number;
  private downloadBar?: HTMLElement;
  private rendered: boolean = false;
  constructor(src: string, href: string, title: string, delaySRC?: Promise<string>) {
    this.src = src;
    this.href = href;
    this.title = title;
    this.delaySRC = delaySRC;
  }

  create(): HTMLElement {
    this.root = DEFAULT_NODE_TEMPLATE.cloneNode(true) as HTMLElement;
    const anchor = this.root.firstElementChild as HTMLAnchorElement;
    anchor.href = this.href;
    anchor.target = "_blank";
    this.imgElement = anchor.firstElementChild as HTMLImageElement;
    this.imgElement.setAttribute("title", this.title);
    if (this.onclick) {
      this.imgElement.addEventListener("click", (event) => {
        event.preventDefault();
        this.onclick!(event);
      });
    }
    this.imgElement.addEventListener("mouseover", () => {
      if (!conf.keepSmallThumbnail) return;
      if (!this.blobUrl) return;
      if (this.mimeType?.startsWith("video")) return;
      if (this.imgElement!.src === this.blobUrl) return;
      this.imgElement!.src = this.blobUrl;
    });
    this.imgElement.addEventListener("mouseout", () => {
      if (!conf.keepSmallThumbnail) return;
      if (this.imgElement!.src === this.src) return;
      this.imgElement!.src = this.src || this.blobUrl || DEFAULT_THUMBNAIL;
    })
    return this.root;
  }

  render() {
    if (!this.imgElement) return;
    this.rendered = true;
    let justThumbnail = conf.keepSmallThumbnail || !this.blobUrl;
    if (this.mimeType === "image/gif") {
      const tip = OVERLAY_TIP.cloneNode(true);
      tip.firstChild!.textContent = "GIF";
      this.root?.appendChild(tip);
      // if gif size over 20MB, then don't render it
      justThumbnail = this.size != undefined && this.size > 10 * 1024 * 1024;
    }
    if (this.mimeType?.startsWith("video")) {
      const tip = OVERLAY_TIP.cloneNode(true);
      tip.firstChild!.textContent = this.mimeType.split("/")[1].toUpperCase();
      this.root?.appendChild(tip);
      justThumbnail = true;
    }

    const delaySRC = this.delaySRC;
    this.delaySRC = undefined;
    if (delaySRC) delaySRC.then(src => (this.src = src) && this.render());

    if (justThumbnail) {
      this.imgElement.src = this.src || this.blobUrl || DEFAULT_THUMBNAIL;
      return;
    }
    this.imgElement.src = this.blobUrl || this.src || DEFAULT_THUMBNAIL;
  }

  unrender() {
    if (!this.rendered || !this.imgElement) return;
    this.imgElement.src = this.src;
  }

  onloaded(blobUrl: string, mimeType: string, size: number) {
    this.blobUrl = blobUrl;
    this.mimeType = mimeType;
    this.size = size;
  }

  progress(state: DownloadState) {
    if (!this.root) return;
    if (state.readyState === 4) {
      if (this.downloadBar && this.downloadBar.parentNode) {
        // this.downloadBar.remove(); // in steam, it randomly throw parentNode is null
        this.downloadBar.parentNode.removeChild(this.downloadBar);
      }
      return;
    }
    if (!this.downloadBar) {
      const downloadBar = document.createElement("div");
      downloadBar.classList.add("download-bar");
      downloadBar.innerHTML = `<div style="width: 0%"></div>`;
      this.downloadBar = downloadBar;
      this.root.firstElementChild!.appendChild(this.downloadBar);
    }
    if (this.downloadBar) {
      (this.downloadBar.firstElementChild as HTMLDivElement).style.width = (state.loaded / state.total) * 100 + "%";
    }
  }

  changeStyle(fetchStatus?: "fetching" | "fetched" | "failed") {
    if (!this.root) return;
    switch (fetchStatus) {
      case "fetching":
        this.root.classList.add("img-fetching");
        this.root.classList.remove("img-fetched");
        this.root.classList.remove("img-fetch-failed");
        break
      case "fetched":
        this.root.classList.add("img-fetched");
        this.root.classList.remove("img-fetching");
        this.root.classList.remove("img-fetch-failed");
        break;
      case "failed":
        this.root.classList.add("img-fetch-failed");
        this.root.classList.remove("img-fetching");
        break;
      default:
        this.root.classList.remove("img-fetched");
        this.root.classList.remove("img-fetch-failed");
        this.root.classList.remove("img-fetching");
    }
  }

  equal(ele: HTMLElement) {
    if (ele === this.root) {
      return true;
    }
    if (ele === this.root?.firstElementChild) {
      return true;
    }
    if (ele === this.imgElement) {
      return true;
    }
    return false;
  }

}


export class ChapterNode implements VisualNode {
  chapter: Chapter;
  index: number;
  constructor(chapter: Chapter, index: number) {
    this.chapter = chapter;
    this.index = index;
  }

  create(): HTMLElement {
    const element = DEFAULT_NODE_TEMPLATE.cloneNode(true) as HTMLElement;
    const anchor = element.firstElementChild as HTMLAnchorElement;
    if (this.chapter.thumbimg) {
      const img = anchor.firstElementChild as HTMLImageElement;
      img.src = this.chapter.thumbimg;
      img.title = this.chapter.title.toString();
    }
    // create title element
    const description = document.createElement("div");
    description.classList.add("ehvp-chapter-description");
    if (Array.isArray(this.chapter.title)) {
      description.innerHTML = this.chapter.title.map((t) => `<span>${t}</span>`).join("<br>");
    } else {
      description.innerHTML = `<span>${this.chapter.title}</span>`;
    }
    anchor.appendChild(description);

    anchor.onclick = (event) => {
      event.preventDefault();
      this.chapter.onclick?.(this.index);
    };
    return element;
  }

  render(): void { }
}
