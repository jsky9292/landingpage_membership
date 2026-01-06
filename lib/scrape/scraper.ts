/**
 * 웹사이트 스크래핑 모듈
 * monet-registry에서 이식됨
 */

import puppeteer from "puppeteer-core";
import type { Page } from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import * as fs from "fs";
import * as path from "path";
import { analyzeDOM } from "./html-analyzer";
import { extractFramerSiteData } from "./framer-extractor";
import type {
  ScrapeOptions,
  ScrapeResult,
  DOMNode,
  DOMSection,
  ImageInfo,
  FontInfo,
  VideoInfo,
  FramerInfo,
} from "./types";

const DEFAULT_VIEWPORT = { width: 1440, height: 900 };
const DEFAULT_MAX_HEIGHT = 5400;
const DEFAULT_WAIT_TIME = 3000;

/**
 * URL에서 도메인 추출 및 정리
 */
function extractDomain(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, "").replace(/\./g, "-");
  } catch {
    return "unknown";
  }
}

/**
 * URL에서 파일 확장자 추출
 */
function getExtensionFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    const ext = path.extname(pathname).toLowerCase();
    return ext || ".png";
  } catch {
    return ".png";
  }
}

/**
 * 이미지 URL을 절대 경로로 변환
 */
function resolveUrl(baseUrl: string, relativeUrl: string): string {
  try {
    return new URL(relativeUrl, baseUrl).href;
  } catch {
    return relativeUrl;
  }
}

/**
 * 파일 다운로드
 */
async function downloadFile(
  url: string,
  outputPath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` };
    }

    const buffer = await response.arrayBuffer();
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * 페이지에서 이미지 URL 추출
 */
async function extractImages(
  page: Page,
  baseUrl: string,
  sections: DOMSection[]
): Promise<Omit<ImageInfo, "localPath" | "downloaded" | "error">[]> {
  const rawImages = await page.evaluate(() => {
    const images: Array<{
      src: string;
      type: "img" | "background" | "svg";
      alt?: string;
      width?: number;
      height?: number;
      top: number;
    }> = [];

    // <img> 태그
    document.querySelectorAll("img").forEach((img) => {
      const src = img.src || img.dataset.src || img.dataset.lazySrc;
      if (src && !src.startsWith("data:")) {
        const rect = img.getBoundingClientRect();
        images.push({
          src,
          type: "img",
          alt: img.alt || undefined,
          width: img.naturalWidth || img.width || undefined,
          height: img.naturalHeight || img.height || undefined,
          top: rect.top + window.scrollY,
        });
      }
    });

    // CSS background-image
    const allElements = document.querySelectorAll("*");
    allElements.forEach((el) => {
      const style = window.getComputedStyle(el);
      const bgImage = style.backgroundImage;
      if (bgImage && bgImage !== "none") {
        const urlMatch = bgImage.match(/url\(["']?([^"')]+)["']?\)/);
        if (urlMatch && urlMatch[1] && !urlMatch[1].startsWith("data:")) {
          const rect = el.getBoundingClientRect();
          images.push({
            src: urlMatch[1],
            type: "background",
            top: rect.top + window.scrollY,
          });
        }
      }
    });

    return images;
  });

  const uniqueUrls = new Set<string>();
  const result: Omit<ImageInfo, "localPath" | "downloaded" | "error">[] = [];

  for (const img of rawImages) {
    const absoluteUrl = resolveUrl(baseUrl, img.src);
    if (uniqueUrls.has(absoluteUrl)) continue;
    uniqueUrls.add(absoluteUrl);

    let sectionIndex = -1;
    for (const section of sections) {
      if (
        img.top >= section.rect.top &&
        img.top < section.rect.top + section.rect.height
      ) {
        sectionIndex = section.index;
        break;
      }
    }

    result.push({
      originalUrl: absoluteUrl,
      type: img.type,
      sectionIndex,
      alt: img.alt,
      width: img.width,
      height: img.height,
    });
  }

  return result;
}

/**
 * 페이지에서 폰트 정보 추출
 */
async function extractFonts(
  page: Page,
  baseUrl: string
): Promise<Omit<FontInfo, "localPath" | "downloaded" | "error">[]> {
  const rawFonts = await page.evaluate(() => {
    const fonts: Array<{
      family: string;
      url?: string;
      source: "google-fonts" | "adobe-fonts" | "custom" | "system";
      weights: string[];
      styles: string[];
      format?: string;
    }> = [];

    const seenFamilies = new Set<string>();

    // Google Fonts 링크에서 추출
    document.querySelectorAll('link[href*="fonts.googleapis.com"]').forEach((link) => {
      const href = link.getAttribute("href");
      if (href) {
        const familyMatch = href.match(/family=([^&]+)/);
        if (familyMatch) {
          const families = familyMatch[1].split("|");
          for (const familyStr of families) {
            const [name, weights] = familyStr.split(":");
            const family = name.replace(/\+/g, " ");
            if (!seenFamilies.has(family)) {
              seenFamilies.add(family);
              fonts.push({
                family,
                url: href,
                source: "google-fonts",
                weights: weights ? weights.split(",") : ["400"],
                styles: ["normal"],
              });
            }
          }
        }
      }
    });

    return fonts;
  });

  return rawFonts.map((font) => ({
    ...font,
    url: font.url ? resolveUrl(baseUrl, font.url) : undefined,
  }));
}

/**
 * 페이지에서 비디오 정보 추출
 */
async function extractVideos(
  page: Page,
  baseUrl: string,
  sections: DOMSection[]
): Promise<Omit<VideoInfo, "thumbnailPath" | "thumbnailDownloaded" | "error">[]> {
  const rawVideos = await page.evaluate(() => {
    const videos: Array<{
      src: string;
      platform: "youtube" | "html5";
      type: "iframe" | "video";
      embedCode?: string;
      posterUrl?: string;
      width?: number;
      height?: number;
      top: number;
    }> = [];

    // YouTube iframe 추출
    document.querySelectorAll("iframe").forEach((iframe) => {
      const src = iframe.src || iframe.dataset.src;
      if (src && (src.includes("youtube.com/embed") || src.includes("youtu.be"))) {
        const rect = iframe.getBoundingClientRect();
        videos.push({
          src,
          platform: "youtube",
          type: "iframe",
          embedCode: iframe.outerHTML,
          width: iframe.width ? parseInt(iframe.width as unknown as string) : rect.width,
          height: iframe.height ? parseInt(iframe.height as unknown as string) : rect.height,
          top: rect.top + window.scrollY,
        });
      }
    });

    // HTML5 video 태그 추출
    document.querySelectorAll("video").forEach((video) => {
      let src = video.src;
      if (!src) {
        const source = video.querySelector("source");
        if (source) {
          src = source.src || source.getAttribute("src") || "";
        }
      }

      if (src && !src.startsWith("data:")) {
        const rect = video.getBoundingClientRect();
        videos.push({
          src,
          platform: "html5",
          type: "video",
          posterUrl: video.poster || undefined,
          width: video.videoWidth || video.width || rect.width,
          height: video.videoHeight || video.height || rect.height,
          top: rect.top + window.scrollY,
        });
      }
    });

    return videos;
  });

  const uniqueUrls = new Set<string>();
  const result: Omit<VideoInfo, "thumbnailPath" | "thumbnailDownloaded" | "error">[] = [];

  for (const video of rawVideos) {
    const absoluteUrl = resolveUrl(baseUrl, video.src);
    if (uniqueUrls.has(absoluteUrl)) continue;
    uniqueUrls.add(absoluteUrl);

    let sectionIndex = -1;
    for (const section of sections) {
      if (
        video.top >= section.rect.top &&
        video.top < section.rect.top + section.rect.height
      ) {
        sectionIndex = section.index;
        break;
      }
    }

    // YouTube 썸네일 URL 생성
    let posterUrl = video.posterUrl ? resolveUrl(baseUrl, video.posterUrl) : undefined;
    let videoId: string | undefined;

    if (video.platform === "youtube") {
      const embedMatch = absoluteUrl.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
      if (embedMatch) videoId = embedMatch[1];
      if (videoId && !posterUrl) {
        posterUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
    }

    result.push({
      originalUrl: absoluteUrl,
      platform: video.platform,
      type: video.type,
      videoId,
      embedCode: video.embedCode,
      posterUrl,
      sectionIndex,
      width: video.width,
      height: video.height,
    });
  }

  return result;
}

/**
 * 이미지 다운로드
 */
async function downloadImages(
  images: Omit<ImageInfo, "localPath" | "downloaded" | "error">[],
  outputDir: string
): Promise<ImageInfo[]> {
  const imagesDir = path.join(outputDir, "images");
  fs.mkdirSync(imagesDir, { recursive: true });

  const results: ImageInfo[] = [];

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const ext = getExtensionFromUrl(img.originalUrl);
    const filename = `image-${i}${ext}`;
    const localPath = `images/${filename}`;
    const fullPath = path.join(outputDir, localPath);

    const { success, error } = await downloadFile(img.originalUrl, fullPath);

    results.push({
      ...img,
      localPath: success ? localPath : undefined,
      downloaded: success,
      error,
    } as ImageInfo);
  }

  return results;
}

/**
 * 폰트 정보 수집 (다운로드 없이)
 */
function collectFonts(
  fonts: Omit<FontInfo, "localPath" | "downloaded" | "error">[]
): FontInfo[] {
  return fonts.map((font) => ({
    ...font,
    downloaded: false,
  } as FontInfo));
}

/**
 * 비디오 정보 수집 (썸네일 다운로드 없이)
 */
function collectVideos(
  videos: Omit<VideoInfo, "thumbnailPath" | "thumbnailDownloaded" | "error">[]
): VideoInfo[] {
  return videos.map((video) => ({
    ...video,
    thumbnailDownloaded: false,
  } as VideoInfo));
}

/**
 * 웹사이트 스크래핑 실행
 */
export async function scrapeWebsite(
  options: ScrapeOptions
): Promise<ScrapeResult> {
  const {
    url,
    maxHeight = DEFAULT_MAX_HEIGHT,
    waitTime = DEFAULT_WAIT_TIME,
    viewport = DEFAULT_VIEWPORT,
  } = options;

  const domain = extractDomain(url);
  const timestamp = new Date().toISOString().split("T")[0];
  const outputDir =
    options.outputDir ||
    path.join(process.cwd(), `public/scraped/${domain}-${timestamp}`);

  fs.mkdirSync(outputDir, { recursive: true });
  fs.mkdirSync(path.join(outputDir, "sections"), { recursive: true });

  console.log(`[Scraping] ${url}`);
  console.log(`[Output] ${outputDir}`);

  // Vercel/AWS Lambda 환경에서는 @sparticuz/chromium 사용
  const isVercel = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;

  const browser = await puppeteer.launch({
    args: isVercel
      ? chromium.args
      : ["--no-sandbox", `--window-size=${viewport.width},${viewport.height}`],
    defaultViewport: viewport,
    executablePath: isVercel
      ? await chromium.executablePath()
      : process.platform === 'win32'
        ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
        : process.platform === 'darwin'
          ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
          : '/usr/bin/google-chrome',
    headless: isVercel ? chromium.headless : true,
  });

  try {
    const page = await browser.newPage();

    console.log("[1/7] Loading page...");
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await new Promise((r) => setTimeout(r, waitTime));

    const pageTitle = await page.title();
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
    const captureHeight = Math.min(bodyHeight, maxHeight);

    console.log(`[2/7] Taking full page screenshot...`);
    await page.setViewport({ width: viewport.width, height: captureHeight });
    await page.screenshot({
      path: path.join(outputDir, "full-page.png"),
      fullPage: true,
    });

    console.log("[3/7] Extracting HTML...");
    const html = await page.content();
    fs.writeFileSync(path.join(outputDir, "page.html"), html);

    console.log("[4/7] Analyzing DOM structure...");
    const domTree: DOMNode = await page.evaluate(`
      (function() {
        function getElementInfo(el) {
          var rect = el.getBoundingClientRect();
          return {
            tag: el.tagName.toLowerCase(),
            id: el.id || null,
            className: typeof el.className === "string" ? el.className : null,
            rect: {
              top: rect.top + window.scrollY,
              left: rect.left,
              width: rect.width,
              height: rect.height
            },
            children: Array.from(el.children)
              .filter(function(c) { return c.getBoundingClientRect().height > 50; })
              .map(getElementInfo)
          };
        }
        return getElementInfo(document.body);
      })()
    `) as DOMNode;

    fs.writeFileSync(
      path.join(outputDir, "dom-tree.json"),
      JSON.stringify(domTree, null, 2)
    );

    const sections: DOMSection[] = analyzeDOM(domTree);
    fs.writeFileSync(
      path.join(outputDir, "sections.json"),
      JSON.stringify(sections, null, 2)
    );

    console.log(`[5/7] Capturing ${sections.length} section screenshots...`);
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      await page.evaluate((top: number) => {
        window.scrollTo(0, top);
      }, section.rect.top);

      await new Promise((r) => setTimeout(r, 300));

      try {
        // Validate clip dimensions
        const clipY = Math.max(0, section.rect.top);
        const clipHeight = Math.min(
          Math.ceil(section.rect.height),
          captureHeight - clipY
        );

        if (clipHeight > 0) {
          await page.screenshot({
            path: path.join(outputDir, "sections", `section-${i}.png`),
            clip: {
              x: 0,
              y: clipY,
              width: viewport.width,
              height: clipHeight,
            },
          });
        } else {
          console.warn(`Warning: Section ${i} has invalid dimensions, skipping screenshot`);
        }
      } catch (err) {
        console.warn(`Warning: Failed to capture section ${i}:`, err);
      }

      try {
        const snippet = await page.evaluate((selector: string) => {
          const el = document.querySelector(selector);
          return el ? el.outerHTML : "";
        }, section.selector);

        if (snippet) {
          fs.writeFileSync(
            path.join(outputDir, "sections", `section-${i}.html`),
            snippet
          );
        }
      } catch (err) {
        console.warn(`Warning: Failed to extract HTML for section ${i}:`, err);
      }
    }

    console.log("[6/7] Extracting assets...");
    const rawImages = await extractImages(page, url, sections);
    const images = await downloadImages(rawImages, outputDir);
    fs.writeFileSync(
      path.join(outputDir, "images.json"),
      JSON.stringify(images, null, 2)
    );

    const rawFonts = await extractFonts(page, url);
    const fonts = collectFonts(rawFonts);
    fs.writeFileSync(
      path.join(outputDir, "fonts.json"),
      JSON.stringify(fonts, null, 2)
    );

    const rawVideos = await extractVideos(page, url, sections);
    const videos = collectVideos(rawVideos);
    fs.writeFileSync(
      path.join(outputDir, "videos.json"),
      JSON.stringify(videos, null, 2)
    );

    console.log("[7/7] Detecting Framer site...");
    let framerInfo: FramerInfo | undefined;
    const framerData = await extractFramerSiteData(page);

    if (framerData.isFramerSite) {
      console.log("Framer site detected!");
      framerInfo = framerData;
      fs.writeFileSync(
        path.join(outputDir, "framer.json"),
        JSON.stringify(framerInfo, null, 2)
      );
    }

    await browser.close();

    const imageStats = {
      total: images.length,
      downloaded: images.filter((i) => i.downloaded).length,
      failed: images.filter((i) => !i.downloaded).length,
    };
    const fontStats = {
      total: fonts.length,
      downloaded: 0,
      failed: 0,
    };
    const videoStats = {
      total: videos.length,
      thumbnailsDownloaded: 0,
      failed: 0,
    };

    const result: ScrapeResult = {
      success: true,
      outputDir,
      sections,
      images,
      fonts,
      videos,
      framer: framerInfo,
      metadata: {
        url,
        domain,
        timestamp: new Date().toISOString(),
        pageTitle,
        totalHeight: bodyHeight,
        imageStats,
        fontStats,
        videoStats,
      },
    };

    fs.writeFileSync(
      path.join(outputDir, "metadata.json"),
      JSON.stringify(result.metadata, null, 2)
    );

    console.log(`[Success] Scraped ${sections.length} sections, ${imageStats.downloaded}/${imageStats.total} images`);

    return result;
  } catch (error) {
    await browser.close();
    return {
      success: false,
      outputDir,
      sections: [],
      images: [],
      fonts: [],
      videos: [],
      metadata: {
        url,
        domain,
        timestamp: new Date().toISOString(),
        pageTitle: "",
        totalHeight: 0,
        imageStats: { total: 0, downloaded: 0, failed: 0 },
        fontStats: { total: 0, downloaded: 0, failed: 0 },
        videoStats: { total: 0, thumbnailsDownloaded: 0, failed: 0 },
      },
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// Export types
export type { ScrapeOptions, ScrapeResult, DOMSection, ImageInfo, FontInfo, VideoInfo, FramerInfo };
