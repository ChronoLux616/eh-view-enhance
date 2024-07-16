import { GalleryMeta } from "../download/gallery-meta";
import ImageNode from "../img-node";
import { Chapter, PagesSource } from "../page-fetcher";
import { BaseMatcher, OriginMeta } from "./platform";

const REGEXP_EXTRACT_GALLERY_ID = /koharu.to\/\w+\/(\d+\/\w+)/;

type BookDataDetail = {
  id: string, public_key: string, size: number,
}

type BookData = {
  base: string,
  entries: BookItem[],
}

type BookItem = {
  path: string,
  dimensions: [number, number],
}

type BookTag = {
  name: string,
  count: number,
  namespace?: number,
}

type BookDetail = {
  id: number,
  public_key: string,
  title: string,
  data: Record<string, BookDataDetail>,
  thumbnails: BookData,
  tags: BookTag[],
}

const NAMESPACE_MAP: Record<number, string> = {
  0: "misc",
  1: "artist",
  2: "circle",
  7: "uploader",
  8: "male",
  9: "female",
  10: "mixed",
  11: "language",
};

export class KoharuMatcher extends BaseMatcher {

  originURLMap: Map<string, string> = new Map<string, string>();
  meta?: GalleryMeta;

  galleryMeta(): GalleryMeta {
    return this.meta || new GalleryMeta(window.location.href, "koharu-unknows");
  }

  async *fetchPagesSource(source: Chapter): AsyncGenerator<PagesSource, any, unknown> {
    yield source.source;
  }

  createMeta(detail: BookDetail) {
    const tags: Record<string, any[]> = detail.tags.reduce<Record<string, any[]>>((map, tag) => {
      const category = NAMESPACE_MAP[tag.namespace || 0] || "misc";
      if (!map[category]) map[category] = [];
      map[category].push(tag.name);
      return map;
    }, {});
    this.meta = new GalleryMeta(window.location.href, detail.title);
    this.meta.tags = tags;
  }

  async parseImgNodes(page: PagesSource): Promise<ImageNode[]> {
    const matches = (page as string).match(REGEXP_EXTRACT_GALLERY_ID)
    if (!matches || matches.length < 2) {
      throw new Error("invaild url: " + page);
    }
    const galleryID = matches[1];
    const detailAPI = `https://api.koharu.to/books/detail/${galleryID}`;
    const detail = await window.fetch(detailAPI).then(res => res.json()).then(j => j as BookDetail).catch(reason => new Error(reason.toString()));
    if (detail instanceof Error) {
      throw detail;
    }
    this.createMeta(detail);
    let dataId = Object.keys(detail.data).map(Number).sort((a, b) => b - a)[0];
    // let dataId = 1280;
    const data = detail.data[dataId.toString()];
    // read token from localStorage for fetch data
    const token = JSON.parse(window.localStorage.getItem("token") || "{}")["session"] as string | undefined;
    const body = token && JSON.stringify({ token });
    const dataAPI = `https://api.koharu.to/books/data/${galleryID}/${data.id}/${data.public_key}`;
    const items = await window.fetch(dataAPI, { method: "post", body, }).then(res => res.json()).then(j => j as BookData).catch(reason => new Error(reason.toString()));
    if (items instanceof Error) {
      throw items;
    }
    if (items.entries.length !== detail.thumbnails.entries.length) {
      throw new Error("thumbnails length not match");
    }

    const thumbs = detail.thumbnails.entries;
    const thumbBase = detail.thumbnails.base;
    const itemBase = items.base;
    const pad = items.entries.length.toString().length;
    return items.entries.map((item, i) => {
      const href = `${window.location.origin}/reader/${galleryID}/${i + 1}`;
      const title = (i + 1).toString().padStart(pad, "0") + "." + item.path.split(".").pop();
      this.originURLMap.set(href, itemBase + item.path);
      return new ImageNode(thumbBase + thumbs[i].path, href, title);
    });
  }

  async fetchOriginMeta(href: string): Promise<OriginMeta> {
    return { url: this.originURLMap.get(href)! };
  }

  workURL(): RegExp {
    return /koharu.to\/(g|reader)\/\d+\/\w+/;
  }

}
