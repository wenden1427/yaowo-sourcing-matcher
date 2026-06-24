import crypto from "node:crypto";
import fs from "node:fs/promises";

const API_KEY = "12574478";
const JSV = "2.7.2";
const API_VERSION = "1.0";
const HOST = "h5api.m.1688.com";
const TOKEN_API = "mtop.ovs.traffic.landing.seotaglist.queryHotSearchWord";
const UPLOAD_API = "mtop.1688.imageService.putImage";
const UPLOAD_APP_NAME = "searchImageUpload";
const UPLOAD_APP_KEY = "pvvljh1grxcmaay2vgpe9nb68gg9ueg2";

interface H5Token {
  token: string;
  cookie: string;
}

export function signMtopRequest(
  token: string,
  timestamp: string,
  appKey: string,
  data: string,
): string {
  return crypto.createHash("md5").update(`${token}&${timestamp}&${appKey}&${data}`).digest("hex");
}

export function buildYouyuanSearchUrl(imageId: string): string {
  const params = new URLSearchParams({
    tab: "imageSearch",
    imageId,
    imageIdList: imageId,
  });
  return `https://s.1688.com/youyuan/index.htm?${params.toString()}`;
}

export async function uploadImageFile(imagePath: string): Promise<string> {
  return uploadImageBytes(await fs.readFile(imagePath));
}

export async function uploadImageBytes(imageBytes: Buffer | Uint8Array): Promise<string> {
  const h5 = await fetchH5Token();
  const imageBase64 = Buffer.from(imageBytes).toString("base64");
  const timestamp = String(Date.now());
  const data = JSON.stringify(
    {
      imageBase64,
      appName: UPLOAD_APP_NAME,
      appKey: UPLOAD_APP_KEY,
    },
    null,
  ).replace(/\s+/g, "");

  const apiPath = `/h5/${UPLOAD_API.toLowerCase()}/${API_VERSION}/`;
  const url = new URL(`https://${HOST}${apiPath}`);
  url.search = new URLSearchParams({
    jsv: JSV,
    appKey: API_KEY,
    t: timestamp,
    api: UPLOAD_API,
    ecode: "0",
    v: API_VERSION,
    type: "originaljson",
    dataType: "jsonp",
    sign: signMtopRequest(h5.token, timestamp, API_KEY, data),
  }).toString();

  const body = new URLSearchParams({ data });
  const response = await fetch(url, {
    method: "POST",
    headers: {
      ...defaultHeaders(),
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: h5.cookie,
      Referer: "https://www.1688.com/",
    },
    body,
  });

  const result = (await response.json()) as {
    data?: { imageId?: string };
    ret?: unknown;
  };
  const imageId = result.data?.imageId;
  if (!imageId) {
    throw new Error(`上传图片失败：${JSON.stringify(result).slice(0, 500)}`);
  }
  return imageId;
}

async function fetchH5Token(): Promise<H5Token> {
  const timestamp = String(Date.now());
  const url = new URL(`https://${HOST}/h5/${TOKEN_API.toLowerCase()}/${API_VERSION}/`);
  url.search = new URLSearchParams({
    jsv: JSV,
    appKey: API_KEY,
    t: timestamp,
    api: TOKEN_API,
    v: API_VERSION,
    type: "json",
    dataType: "jsonp",
    callback: "mtopjsonp1",
    preventFallback: "true",
    data: "{}",
  }).toString();

  const response = await fetch(url, {
    headers: {
      ...defaultHeaders(),
      Authority: HOST,
      Referer: "https://www.1688.com/",
    },
  });

  const cookie = extractSetCookie(response.headers);
  const tokenCookie = cookie.match(/_m_h5_tk=([^;_]+)/);
  const token = tokenCookie?.[1];
  if (!token) {
    throw new Error("无法获取 1688 h5 token (_m_h5_tk)");
  }
  return { token, cookie };
}

function extractSetCookie(headers: Headers): string {
  const maybeGetSetCookie = headers as Headers & { getSetCookie?: () => string[] };
  const cookies = maybeGetSetCookie.getSetCookie?.();
  if (cookies?.length) return cookies.join("; ");
  return headers.get("set-cookie") ?? "";
}

function defaultHeaders(): Record<string, string> {
  return {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
    Accept: "application/json",
    "Accept-Language": "zh-CN,zh;q=0.9",
  };
}
