# 图像生成接口对接文档

> **Base URL**: `https://your-api-endpoint.com`  
> **鉴权**: 所有接口均需在请求头携带 `Authorization: Bearer <your_api_key>`

---

## ⚡ NewAPI 快速上手（推荐）

> 如果你是通过 **NewAPI / One API** 等中转平台接入，只需以下两步，文生图和图生图都能直接用，无需关心接口细节。

### 第一步：添加渠道

| 配置项 | 值 |
|---|---|
| **渠道类型** | `GPT 图像`（不是「OpenAI」） |
| **模型** | 点击「获取模型」自动填入 |
| **Base URL** | `https://your-api-endpoint.com` |
| **API Key** | 你的 Key |

> [!TIP]
> 填入 Base URL 和 Key 后，点击「**获取模型**」按钮，会自动拉取下方所有模型名，无需手动填写。

### 第二步：使用

NewAPI 会**自动路由**：
- 用户只发文字 → NewAPI 调用 `/v1/images/generations`（文生图）
- 用户上传图片 → NewAPI 自动转成 multipart 调用 `/v1/images/edits`（图生图）

**无需额外配置，文生图和图生图都支持。**

---

## 模型列表

| 模型名 | 接口格式 | 质量档位 | 特点 |
|---|---|---|---|
| `gemini-3-pro-image-preview` | **Gemini 格式** | — | 支持多参考图，画质最优 |
| `gemini-3.1-flash-image-preview` | **Gemini 格式** | — | 速度快，支持 thinking/search |
| `gpt-image-2` | **OpenAI 格式** | **Medium**（默认）| 标准质量，推荐日常使用 |
| `gpt-image-2-Low` | **OpenAI 格式** | **Low** | 速度最快，成本最低 |
| `gpt-image-2-Med` | **OpenAI 格式** | **Medium** | 同 `gpt-image-2` |
| `gpt-image-2-High` | **OpenAI 格式** | **High** | 最高画质，耗时较长 |

> **质量由模型名决定**，`quality` 参数传入后无效，以模型名为准。

---

## 接口一：OpenAI 兼容格式（gpt-image-2）

### 端点

```
POST /v1/images/generations
```

### 请求头

```http
Authorization: Bearer sk-xxxxxxxxxxxxxxxx
Content-Type: application/json
```

### 请求参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---|---|---|
| `prompt` | string | ✅ | - | 图片描述文字 |
| `model` | string | ✅ | `gpt-image-2` | 见上方模型表，**模型名决定质量档位** |
| `size` | string | ❌ | `1024x1024` | 填入下方尺寸表中的 `WxH` 值，或直接填比例字符串如 `"16:9"`（默认 1K） |
| `quality` | string | ❌ | — | **此参数已被忽略**，质量由模型名控制 |
| `response_format` | string | ❌ | `b64_json` | `url`（返回 CDN 链接，**需配置 R2**）或 `b64_json`（返回 base64） |
| `output_format` | string | ❌ | `png` | 输出格式：`png` / `jpeg` |
| `n` | int | ❌ | `1` | 固定为 1（不支持批量） |

> **图生图**：上传参考图时，NewAPI 会自动将请求路由到 `/v1/images/edits`（multipart），无需额外配置。

---

### gpt-image-2 完整尺寸参考表

> 直接把下方 `size` 值填入请求即可，系统自动解析比例和清晰度。也支持直接填比例字符串如 `"16:9"`（默认 1K 档）。

| `size` 参数值 | 比例 | 清晰度档位 | 实际输出像素 |
|---|---|---|---|
| `1536x512` | 3:1 | 1K | 1536×512 |
| `3072x1024` | 3:1 | 2K | 3072×1024 |
| `4992x1664` | 3:1 | 4K | 4992×1664 |
| `1344x576` | 21:9 | 1K | 1344×576 ✅ |
| `2048x878` | 21:9 | 2K | 2048×878 |
| `4400x1888` | 21:9 | 4K | 4400×1888 |
| `1280x720` | 16:9 | 1K | 1280×720 ✅ |
| `2048x1152` | 16:9 | 2K | 2048×1152 ✅ |
| `3840x2160` | 16:9 | 4K | 3840×2160 ✅ |
| `1024x768` | 4:3 | 1K | 1024×768 ✅ |
| `2048x1536` | 4:3 | 2K | 2048×1536 |
| `3328x2496` | 4:3 | 4K | 3328×2496 |
| `1136x752` | 3:2 | 1K | 1136×752 |
| `2048x1366` | 3:2 | 2K | 2048×1366 |
| `3520x2352` | 3:2 | 4K | 3520×2352 |
| `1024x1024` | 1:1 | 1K | 1024×1024 ✅ |
| `2048x2048` | 1:1 | 2K | 2048×2048 ✅ |
| `2880x2880` | 1:1 | 4K | 2880×2880 ✅ |
| `752x1136` | 2:3 | 1K | 752×1136 |
| `1366x2048` | 2:3 | 2K | 1366×2048 |
| `2352x3520` | 2:3 | 4K | 2352×3520 |
| `768x1024` | 3:4 | 1K | 768×1024 |
| `1536x2048` | 3:4 | 2K | 1536×2048 |
| `2496x3328` | 3:4 | 4K | 2496×3328 |
| `720x1280` | 9:16 | 1K | 720×1280 |
| `1152x2048` | 9:16 | 2K | 1152×2048 |
| `2160x3840` | 9:16 | 4K | 2160×3840 |
| `512x1536` | 1:3 | 1K | 512×1536 |
| `1024x3072` | 1:3 | 2K | 1024×3072 |
| `1664x4992` | 1:3 | 4K | 1664×4992 |

> ✅ = 通过实际抓包验证的真实像素值；其余为推算值，误差在 ±16 像素内

---

### 示例 1：文生图（16:9 2K）— 返回 URL

```json
{
    "model": "gpt-image-2",
    "prompt": "一位穿着白色连衣裙的女孩站在向日葵花田中，阳光明媚，电影质感",
    "size": "2048x1152",
    "response_format": "url"
}
```

> 需要服务器端已配置 Cloudflare R2 存储，图片将上传至 R2 并返回 CDN 链接。

**响应**
```json
{
    "created": 1778221524,
    "data": [
        {
            "url": "https://cdn.example.com/images/xxxxxxxxxxxxxxxx.png",
            "b64_json": null,
            "revised_prompt": "一位穿着白色连衣裙的女孩站在向日葵花田中，阳光明媚，电影质感"
        }
    ]
}
```

---

### 示例 2：高质量 + 竖版（9:16 1K）

```json
{
    "model": "gpt-image-2-High",
    "prompt": "赛博朋克风格的东京夜景，霓虹灯，雨夜",
    "size": "720x1280"
}
```

> 使用 `gpt-image-2-High` 模型名即可锁定高质量输出，无需传 `quality` 参数。

---

### 示例 3：只传比例字符串（默认 1K）

```json
{
    "model": "gpt-image-2",
    "prompt": "极简主义的山水画",
    "size": "16:9"
}
```

> 等同于 `"size": "1280x720"`（16:9 1K）

---

### 示例 4：返回 base64（默认行为，`response_format` 可省略）

```json
{
    "model": "gpt-image-2",
    "prompt": "一只橘猫坐在窗台上看雨",
    "size": "1024x1024"
}
```

> 不传 `response_format` 时默认返回 base64（`b64_json`），显式传 `"response_format": "b64_json"` 效果相同。

---

### 错误响应

| HTTP 状态码 | 含义 |
|---|---|
| `400` | 参数错误（不支持的模型、格式错误） |
| `401` | API Key 无效或缺失 |
| `500` | 生成失败（账号余额不足、内容被过滤等） |
| `503` | 没有可用账号（后台账号已全部耗尽） |

```json
{
    "detail": "图片生成失败: 任务不存在（realm 或 action 已失效）: 404"
}
```

---

## 接口二：Google Gemini 原生格式

适用于直接配置为 **Google Gemini 渠道类型** 的 NewAPI / Cherry Studio 场景。

### 端点

```
POST /v1beta/models/{model}:generateContent
POST /v1beta/models/{model}:streamGenerateContent   # SSE 流式（内容相同）
POST /v1/models/{model}:generateContent             # Cherry Studio 兼容
POST /v1/models/{model}:streamGenerateContent
```

**模型路径格式**：支持带或不带 `models/` 前缀：
- `gemini-3-pro-image-preview`
- `models/gemini-3-pro-image-preview`

### 鉴权（三种方式任选一种）

```http
# 方式 1：x-goog-api-key Header（标准 Gemini 格式）
x-goog-api-key: sk-xxxxxxxxxxxxxxxx

# 方式 2：URL Query 参数
POST /v1beta/models/gemini-3-pro-image-preview:generateContent?key=sk-xxxxxxxxxxxxxxxx

# 方式 3：Authorization Bearer（OpenAI 格式兼容）
Authorization: Bearer sk-xxxxxxxxxxxxxxxx
```

### 请求体格式

```json
{
    "contents": [
        {
            "role": "user",
            "parts": [
                {"text": "图片描述文字"}
            ]
        }
    ],
    "generationConfig": {
        "responseModalities": ["IMAGE", "TEXT"],
        "aspectRatio": "16:9",
        "resolution": "2K"
    }
}
```

### generationConfig 参数说明

| 参数 | 类型 | 说明 |
|---|---|---|
| `aspectRatio` | string | 比例字符串，如 `"16:9"`、`"1:1"`、`"3:4"` 等 |
| `resolution` | string | 清晰度档位：`"1K"`, `"2K"`, `"4K"` |
| `imageSize` | string | 兼容参数，直接指定像素如 `"1280x720"`（会自动推断比例和档位） |
| `responseModalities` | array | 填 `["IMAGE"]` 或 `["IMAGE","TEXT"]`，不影响实际结果 |

> [!IMPORTANT]
> `imageConfig` 嵌套写法（NewAPI 的 GPT 图像渠道会自动生成此格式）也完全支持：
> ```json
> "generationConfig": {
>     "imageConfig": {
>         "aspect_ratio": "16:9",
>         "resolution": "4K"
>     }
> }
> ```
> `imageConfig` 下支持的字段：`resolution`、`imageSize`、`image_size`、`size`、`aspectRatio`、`aspect_ratio`

**支持的比例**：

| aspectRatio | 1K 像素 | 2K 像素 | 4K 像素 |
|---|---|---|---|
| `1:1` | 1024×1024 | 2048×2048 | 2880×2880 |
| `16:9` | 1280×720 | 2048×1152 | 3840×2160 |
| `9:16` | 720×1280 | 1152×2048 | 2160×3840 |
| `4:3` | 1024×768 | 2048×1536 | 3328×2496 |
| `3:4` | 768×1024 | 1536×2048 | 2496×3328 |
| `3:2` | 1136×752 | 2048×1366 | 3520×2352 |
| `2:3` | 752×1136 | 1366×2048 | 2352×3520 |
| `21:9` | 1344×576 | 2048×878 | 4400×1888 |
| `5:4` | 1024×832 | 2048×1638 | 3216×2576 |
| `4:5` | 832×1024 | 1638×2048 | 2576×3216 |
| `4:1` | 1024×256 | 2048×512 | 5760×1440 |
| `1:4` | 256×1024 | 512×2048 | 1440×5760 |
| `8:1` | 1024×128 | 2048×256 | 8192×1024 |
| `1:8` | 128×1024 | 256×2048 | 1024×8192 |

---

### 示例 1：文生图（Pro 模型，高质量）

```http
POST /v1beta/models/gemini-3-pro-image-preview:generateContent
x-goog-api-key: sk-xxxxxxxxxxxxxxxx
Content-Type: application/json

{
    "contents": [
        {
            "role": "user",
            "parts": [
                {"text": "一只赛博朋克风格的猫，霓虹灯背景，高细节"}
            ]
        }
    ],
    "generationConfig": {
        "aspectRatio": "1:1",
        "resolution": "2K"
    }
}
```

**响应**
```json
{
    "candidates": [
        {
            "content": {
                "parts": [
                    {
                        "inlineData": {
                            "mimeType": "image/jpeg",
                            "data": "iVBORw0KGgoAAAANSUhEUgAA..."
                        }
                    }
                ],
                "role": "model"
            },
            "finishReason": "STOP",
            "index": 0
        }
    ],
    "usageMetadata": {
        "promptTokenCount": 10,
        "candidatesTokenCount": 1750,
        "totalTokenCount": 1760
    },
    "modelVersion": "gemini-3-pro-image-preview"
}
```

> **注意**：Gemini 格式**固定返回 `inlineData`（base64 内嵌）**，没有 URL 选项。如需 URL 格式，请改用接口一（gpt-image-2）。

---

### 示例 2：文生图（Flash 模型，快速）

```json
{
    "contents": [{"role": "user", "parts": [{"text": "最近热门的科技产品发布会场景，未来感十足"}]}],
    "generationConfig": {
        "aspectRatio": "16:9",
        "resolution": "1K"
    }
}
```

---

### 示例 3：参考图生图（inlineData）

```json
{
    "contents": [
        {
            "role": "user",
            "parts": [
                {
                    "inlineData": {
                        "mimeType": "image/jpeg",
                        "data": "/9j/4AAQSkZJRgABAQAA..."
                    }
                },
                {"text": "将这张图片转换为浮世绘风格，保留人物构图"}
            ]
        }
    ],
    "generationConfig": {
        "aspectRatio": "3:4",
        "resolution": "1K"
    }
}
```

---

### 示例 4：参考图生图（fileData URL）

```json
{
    "contents": [
        {
            "role": "user",
            "parts": [
                {
                    "fileData": {
                        "fileUri": "https://example.com/reference.jpg",
                        "mimeType": "image/jpeg"
                    }
                },
                {"text": "参考这张图的构图，重新画一张写实风格的场景"}
            ]
        }
    ],
    "generationConfig": {
        "aspectRatio": "16:9",
        "resolution": "2K"
    }
}
```

---

### 示例 5：通过 imageConfig 嵌套指定分辨率

```json
{
    "contents": [{"role": "user", "parts": [{"text": "一片星空下的草原"}]}],
    "generationConfig": {
        "imageConfig": {
            "aspect_ratio": "16:9",
            "resolution": "4K"
        }
    }
}
```

---

## 接口三：multipart/form-data 上传（图生图专用）

> [!IMPORTANT]
> 如果您通过 **NewAPI 等中转平台**调用且需要上传参考图，必须使用此接口。OpenAI 格式的 `reference_images` 字段会被中转平台过滤，只有 multipart 文件上传能正常透传。

仅支持 `gpt-image-2` 系列模型。

### 端点

```
POST /v1/images/edits
```

### 请求字段（multipart/form-data）

| 字段 | 类型 | 说明 |
|---|---|---|
| `prompt` | string | 图片描述 |
| `model` | string | 模型名，如 `gpt-image-2`（Medium）/ `gpt-image-2-High` 等，**质量由模型名决定** |
| `image` | file | 参考图文件（可多次添加 `image` 字段以传多张图，最多 10 张） |
| `size` | string | 尺寸，填入上方尺寸表中的值，如 `2048x1152`（16:9 2K）或直接填 `"16:9"` |
| `quality` | string | **已被忽略**，质量由模型名控制 |
| `response_format` | string | `url` 或 `b64_json` |

**示例 1：curl（单张参考图，16:9 2K）**
```bash
curl -X POST https://your-api-endpoint.com/v1/images/edits \
  -H "Authorization: Bearer sk-xxxxxxxxxxxxxxxx" \
  -F "model=gpt-image-2" \
  -F "prompt=将这张图改为水彩风格" \
  -F "image=@/path/to/reference.jpg" \
  -F "size=2048x1152" \
  -F "response_format=b64_json"
```

**示例 2：curl（多张参考图）**
```bash
curl -X POST https://your-api-endpoint.com/v1/images/edits \
  -H "Authorization: Bearer sk-xxxxxxxxxxxxxxxx" \
  -F "model=gpt-image-2" \
  -F "prompt=融合两张图的风格，生成新的场景" \
  -F "image=@/path/to/ref1.jpg" \
  -F "image=@/path/to/ref2.jpg" \
  -F "size=1024x1024"
```

**示例 3：Python requests**
```python
import requests

url = "https://your-api-endpoint.com/v1/images/edits"
headers = {"Authorization": "Bearer sk-xxxxxxxxxxxxxxxx"}

files = [
    ("image", ("ref1.jpg", open("/path/to/ref1.jpg", "rb"), "image/jpeg")),
    ("image", ("ref2.jpg", open("/path/to/ref2.jpg", "rb"), "image/jpeg")),
]
data = {
    "model": "gpt-image-2",
    "prompt": "将这张图改为油画风格",
    "size": "1024x1024",
    "response_format": "b64_json",
}
resp = requests.post(url, headers=headers, files=files, data=data, timeout=120)

result = resp.json()
b64_image = result["data"][0]["b64_json"]
```

---

## 注意事项

> [!IMPORTANT]
> - 单次请求只生成 **1 张图**，`n` 参数无效
> - 参考图数量最多支持 **10 张**
> - 生图耗时通常 **15~90 秒**，请务必设置足够长的超时时间（建议 **120 秒**以上）

> [!TIP]
> - 通过 NewAPI 调用时，**用 `size` 字段传比例和分辨率**（如 `"2048x1152"` = 16:9 2K），不要用 `aspect_ratio` / `resolution`（会被过滤）
> - 需要 URL 返回时（仅接口一支持），务必确认后台已配置对象存储（如 R2），否则自动降级返回 base64
> - `gemini-3.1-flash-image-preview` 速度最快，适合高并发场景（仅 Gemini 格式）
> - `gemini-3-pro-image-preview` 画质最优，适合精品输出（仅 Gemini 格式）
> - `gpt-image-2` 与 OpenAI 原生格式完全兼容，支持 URL 返回（仅接口一/三）
