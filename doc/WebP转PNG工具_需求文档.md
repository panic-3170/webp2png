# 纯前端小工具站 — 需求文档（PRD）

> 项目代号：**ToolKit.run**（域名占位，可替换）
> 文档版本：v1.0
> 编写日期：2026-06-16
> 文档定位：首发产品 PRD + 整体站点的可复用架构说明

***

## 1. 项目概述

### 1.1 一句话定位

**一个"打开即用、零上传、零注册"的小工具聚合站，靠 Google AdSense / Ezoic 广告变现。**

### 1.2 商业逻辑

- **痛点侧**：用户有"小而具体"的格式/转换/处理需求（图片、PDF、文本、编码等），但绝大多数在线工具都强制要求**上传文件到服务器**——既慢，又涉及隐私顾虑。
- **解法侧**：用浏览器的 `Canvas` / `FileReader` / `WebAssembly` / `WebCodecs` 等**纯前端能力**完成所有处理，文件不出本机。
- **变现侧**：单页单工具 SEO 流量大、单次访问时长适中（30s–2min），非常适合 AdSense / Ezoic 这类按曝光+点击计费的广告产品。**零服务器成本 + 零带宽成本 = 毛利接近广告收入本身**。

### 1.3 为什么"纯前端"是关键

| 维度  | 后端方案           | 纯前端方案                                        |
| --- | -------------- | -------------------------------------------- |
| 服务器 | 需要（成本随流量线性增长）  | 仅静态托管（Vercel/Netlify/Cloudflare Pages 免费档够用） |
| 带宽  | 文件来回传输，按 GB 计费 | 0 带宽成本                                       |
| 隐私  | 用户担心上传泄露       | "文件不离开你的电脑" 卖点                               |
| 速度  | 受网络影响          | 本机处理，几乎瞬时                                    |
| 合规  | GDPR/数据合规复杂    | 不收集文件，仅需站点级 Cookie 同意                        |
| 扩展性 | 加工具要加后端        | 模板化生成新工具页                                    |

***

## 2. 目标用户与场景

### 2.1 用户画像

- **海外流量为主**（80%+）：设计师、运营、博主、跨境电商从业者、开发者。
- **搜索意图明确**：搜索词如 `webp to png transparent`、`merge pdf online free`、`compress jpg`。
- **决策快**：进站 ≤ 5 秒判断"能不能用"，能用就动手，不用就走——**首屏 + 首屏上一屏广告位极其重要**。

### 2.2 典型场景

1. 设计师在 Figma/PS 导出 WebP 后，需要透明背景 PNG 给客户。
2. 跨境电商运营要把多张白底图批量抠图换背景（未来工具）。
3. 博主需要把 HEIC 手机照片转 JPG（未来工具）。
4. 用户在公共电脑/网吧/手机上，不想上传文件。

***

## 3. 首发产品：WebP → 透明 PNG 转换器

### 3.1 核心功能（MVP）

| 编号 | 功能             | 说明                                                    |
| -- | -------------- | ----------------------------------------------------- |
| F1 | 拖拽 / 点击上传 WebP | 支持 `.webp`，单文件 ≤ 20MB（v1）；v2 改为多文件批量                  |
| F2 | 浏览器本地解码        | 用 `createImageBitmap` + `OffscreenCanvas`，保留 alpha 通道 |
| F3 | 实时预览对比         | 左原图 / 右转换后，标尺显示尺寸、原始大小、转换后大小                          |
| F4 | 一键下载 PNG       | 文件名 `原名-transparent.png`，通过 `Blob` + `a.download` 触发  |
| F5 | 批量转换（v1.1）     | 多文件队列，进度条，逐个下载或打包 ZIP（用 `JSZip`）                      |
| F6 | 错误兜底           | 非 WebP / 解码失败时给友好提示，不弹原生 alert                        |

### 3.2 关键交互流程

```
[落地页 SEO 文案 + 工具卡片]
    ↓
[拖拽区 / 文件选择] → 选择文件
    ↓
[本地解码] → 500ms 内进入预览态
    ↓
[左原图 | 右PNG] + 元信息 + [下载] 按钮
    ↓
[完成] → 推荐位："你可能还需要：HEIC→JPG / 抠图去背景 / 图片压缩"
```

### 3.3 非功能需求

- **性能**：5MB 以内 WebP 解码到预览 ≤ 1.5 秒（Mid-tier Android Chrome 90+）。
- **可用性**：首屏 LCP ≤ 1.8s（用 prerender / 静态 HTML）。
- **兼容性**：Chrome 90+、Edge 90+、Safari 15.4+（OffscreenCanvas 支持）、Firefox 90+。
- **可访问性**：拖拽区支持键盘聚焦与回车触发；按钮有可见 focus ring。

***

## 4. 技术架构

### 4.1 技术选型

| 层      | 选型                                               | 理由                                    |
| ------ | ------------------------------------------------ | ------------------------------------- |
| 框架     | **Astro**（首选）或纯 HTML+JS                          | 静态生成（SSG），对 SEO 极友好；可零 JS hydration   |
| 样式     | Tailwind CSS                                     | 工具体积小，便于复制模板出多个工具                     |
| 核心 JS  | 原生 ES2022 + `OffscreenCanvas`                    | 不引框架，浏览器原生能力足够                        |
| 批量打包   | JSZip（按需懒加载）                                     | 仅在用户触发批量下载时加载                         |
| 图片处理备选 | `@jsquash/webp` / `libwebp.js`（WASM）             | createImageBitmap 失败时回退               |
| 托管     | Cloudflare Pages                                 | 免费、全球 CDN、自动 HTTPS                    |
| 监控     | Cloudflare Analytics（无 Cookie）+ Plausible（自托管可选） | **避免 Google Analytics 影响 AdSense 审核** |
| 广告     | Google AdSense（首发）→ 3 个月后接 Ezoic                 | Ezoic 准入更友好，但审核期长                     |
| 表单/反馈  | Formspree 或 Cloudflare Workers                   | 收集 bug 报告                             |

### 4.2 目录结构（Astro 示例）

```
/
├── src/
│   ├── pages/
│   │   ├── index.astro                 # 首页（工具导航）
│   │   ├── webp-to-png.astro           # 工具页（首发）
│   │   ├── heic-to-jpg.astro           # 工具页（v1.2）
│   │   └── about.astro
│   ├── components/
│   │   ├── ToolLayout.astro            # 工具页通用壳（含广告位）
│   │   ├── Dropzone.astro
│   │   └── AdSlot.astro                # AdSense 广告位组件
│   ├── lib/
│   │   ├── converters/
│   │   │   └── webpToPng.ts
│   │   └── utils/
│   ├── content/
│   │   └── tools/                      # 工具元数据（Markdown/MDX）
│   └── layouts/
├── public/
│   └── favicon.svg
├── astro.config.mjs
└── package.json
```

### 4.3 核心代码骨架（webpToPng.ts 伪代码）

```typescript
export async function webpFileToPngBlob(file: File): Promise<Blob> {
  // 1. 校验
  if (!file.type.includes('webp')) throw new Error('不是 WebP 文件');

  // 2. 解码（保留 alpha）
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });

  // 3. 离屏渲染
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(bitmap, 0, 0);

  // 4. 导出 PNG
  return await canvas.convertToBlob({ type: 'image/png' });
}
```

### 4.4 关键决策记录（ADR）

- **为什么不用 Next.js？** 客户端纯处理，SSR/CSR 切换无意义；Astro 静态产物更利于 SEO 与 LCP。
- **为什么不上 Service Worker？** MVP 阶段不需要离线；后续可加 PWA。
- **为什么不用 React？** 无状态、SEO 内容为主，框架成本不划算；如后期 UI 复杂再升级到 Astro+React Islands。

***

## 5. UI / UX 设计规范

### 5.1 页面结构（工具页通用）

```
┌─────────────────────────────────────┐
│  Header：Logo  |  其他工具  |  About │   ← 顶部 728x90 广告位
├─────────────────────────────────────┤
│                                     │
│   H1: WebP to Transparent PNG       │   ← SEO 关键词
│   副标题：100% 本地处理，文件不上传   │
│                                     │
│   ┌─────────────────────────────┐   │
│   │  [拖拽 WebP 到这里 / 点击]   │   │   ← 拖拽区（首屏必现）
│   └─────────────────────────────┘   │
│                                     │
│   （处理后展示预览）                  │
│   ┌────────┬────────┐              │
│   │ 原图    │ PNG    │              │
│   └────────┴────────┘              │
│   [下载 PNG]                         │
├─────────────────────────────────────┤
│  FAQ（结构化数据，SEO 关键）          │
├─────────────────────────────────────┤
│  相关工具推荐                        │   ← 中部 300x250 广告位
├─────────────────────────────────────┤
│  Footer                             │
└─────────────────────────────────────┘
   ← 侧边栏 sticky 300x600 广告位（桌面）
```

### 5.2 设计原则

- **首屏即工具**：用户来"做事"，不是来"看介绍"。Hero 段不超过 1 屏。
- **不打断流程**：广告位在工具**完成态之后**或**两侧**；绝不能挡在拖拽区上方。
- **广告与内容视觉分离**：用浅灰背景块包裹 `<AdSlot>`，明确"这是赞助内容"，反而提升点击率与用户体验。
- **暗色模式**：跟随系统，减少眼疲劳（设计/运营人群刚需）。

### 5.3 广告位规划（AdSense）

| 位置         | 尺寸                  | 触发条件   | 预期 CTR        |
| ---------- | ------------------- | ------ | ------------- |
| 顶部 Header  | 728x90 / responsive | 所有页    | 0.5–1%        |
| 工具完成区下方    | 336x280             | 用户下载后  | **2–4%**（黄金位） |
| 内容中部       | 300x250 长方形         | 滚动 50% | 0.3–0.8%      |
| 侧边栏 sticky | 300x600             | 桌面端固定  | 1–2%          |
| 站内链接/相关工具  | 原生广告                | 工具完成态  | 1–2%          |

> **关键洞察**：工具类站点最大收益位是"用户任务完成后"的"下一步"位——此刻用户停留意愿最强。

***

## 6. SEO 与流量策略

### 6.1 关键词矩阵

| 工具         | 目标关键词（英文为主）               | 月搜索量级 | 难度     |
| ---------- | ------------------------- | ----- | ------ |
| WebP → PNG | `webp to png transparent` | 50w+  | 中      |
| WebP → JPG | `webp to jpg`             | 30w+  | 中      |
| HEIC → JPG | `heic to jpg`             | 20w+  | 中高     |
| PDF 合并     | `merge pdf`               | 200w+ | 高（不优先） |
| 图片压缩       | `compress jpg`            | 100w+ | 高      |
| SVG → PNG  | `svg to png`              | 10w+  | 低      |
| Base64 编解码 | `base64 decode`           | 50w+  | 高      |

**首发选择 WebP→PNG 的理由**：搜索量大、纯前端可行、竞争中等、用户停留时间长（上传+下载）、广告单价高（设计师/电商人群）。

### 6.2 页面 SEO 要素

- `<title>`：`WebP to Transparent PNG Converter — Free & Private | ToolKit`
- `<meta description>`：150 字内含关键词 + 卖点
- **H1**：必须含主关键词，且唯一
- **结构化数据**：`FAQPage` + `SoftwareApplication`（JSON-LD）
- **OG / Twitter Card**：自动截图转换效果作为分享图
- **Canonical**：自指，防聚合内容稀释
- **Hreflang**：首期仅英文，后期加西/法/日/中（不同语种不同子目录）

### 6.3 内容矩阵（每工具 1 篇长文 + 1 篇 FAQ）

- 1500–2500 词英文长文：`How to Convert WebP to Transparent PNG`（教程型长尾）
- 6–10 条 FAQ（结构化数据）
- 1 个 30 秒演示视频（嵌入 YouTube，自带 SEO 权重）

### 6.4 外链策略

- 提交到 ProductHunt、AlternativeTo、SourceForge、Slant
- 主动联系设计类博客（"我们做了一个免费替代品"）
- Reddit: r/webdev, r/graphic\_design, r/InternetIsBeautiful（注意规则）
- 工具互链（"ConvertKit / TinyPNG" 等品牌的"替代品"页）

***

## 7. 隐私与合规

### 7.1 隐私优势

- **核心卖点**："Your files never leave your device."（你的文件从不上传）
- 在首页、工具页、隐私页三处显式声明

### 7.2 必备合规

- **GDPR / CCPA**：Cookie 同意条（AdSense 必需），允许拒绝。
- **隐私政策页**：使用静态模板生成器（TermsFeed / Iubenda 免费版）。
- **不收集文件内容**：不向任何后端发送文件数据；本地 IndexedDB 也只存用户**显式选择保存的历史**。
- **儿童保护**：不做 13 岁以下定向，符合 COPPA。

### 7.3 AdSense 合规要点

- 站点不能有"成人/赌博/侵权/药物"内容
- 工具必须**真的能用**，不能纯挂羊头
- 内容原创度 ≥ 80%（不抄竞品文案）
- 拥有独立域名（不用 `*.github.io`）
- 至少 6–8 周持续有内容更新

***

## 8. 指标与成功标准

### 8.1 北极星指标

**月活用户完成工具任务数（MAU-Completed-Tasks）**

### 8.2 KPI 阶梯（6 个月）

| 时间     | UV/月      | 完成转换数   | 广告 RPM | 月收入估算   |
| ------ | --------- | ------- | ------ | ------- |
| M1（上线） | 5,000     | 1,500   | $2     | $10     |
| M3     | 50,000    | 15,000  | $5     | $250    |
| M6     | 300,000   | 90,000  | $8     | $2,400  |
| M12    | 1,500,000 | 450,000 | $10    | $15,000 |

> RPM 估算基于工具类站点中位数（图片处理类 $5–12，PDF/设计类 $8–18）。
> 实际兑现需 Ezoic 接入与流量放大。

### 8.3 健康度指标

- 跳出率 ≤ 40%（工具站基准）
- 任务完成率（上传→下载）≥ 60%
- Core Web Vitals 全部绿
- AdSense CTR 1.5–3%，RPM 稳定增长

***

## 9. 路线图

### Phase 0 — 准备（Week 1–2）

- [ ] 域名注册 + Cloudflare 托管
- [ ] AdSense 申请（同步进行，审核 2 周+）
- [ ] 隐私政策 / 关于页面 / 联系页
- [ ] 站点 ICP / GDPR Cookie 横幅

### Phase 1 — MVP（Week 2–3）

- [ ] WebP → 透明 PNG 工具
- [ ] 首页 + 工具页 SEO 文案
- [ ] FAQ + 结构化数据
- [ ] 接入 AdSense（通过审核后）

### Phase 2 — 扩量（Week 4–10）

- [ ] WebP → JPG
- [x] HEIC → JPG
- [ ] SVG → PNG
- [ ] 站内互链 + 工具导航页
- [ ] ProductHunt 发布 + Reddit 推广

### Phase 3 — 矩阵化（Month 3–6）

- [ ] 接入 Ezoic
- [ ] 视频工具（MP4 → GIF、WebM 转 MP4）
- [ ] 文本工具（Base64、JSON 格式化、URL 编解码）
- [ ] 多语种（西/法/日/中）

### Phase 4 — 平台化（Month 6+）

- [ ] 工具评论联盟（与 SaaS 厂商分成）
- [ ] 简单付费墙（"无广告 Pro" $2/月）
- [ ] 开放 API（开发者集成）

***

## 10. 风险与应对

| 风险                | 影响      | 应对                                 |
| ----------------- | ------- | ---------------------------------- |
| AdSense 审核不通过     | 致命      | 站点先有 20+ 篇原创内容再申请                  |
| 浏览器 API 兼容性       | 部分用户用不了 | Feature detection + 友好降级 + WASM 兜底 |
| 大文件处理卡顿           | 体验差     | 限制单文件 ≤ 20MB；提示"用桌面浏览器"            |
| 竞品（同模式）挤压流量       | 中       | 拼内容深度 + 拼长尾关键词覆盖                   |
| Ezoic 接入后 LCP 退化  | 收入反降    | 用 Ezoic 的"placeholders"控速加载        |
| 法规变化（欧盟 ePrivacy） | 中       | 默认拒绝非必要 Cookie，符合最严标准              |

***

## 11. 成本估算（月度）

| 项目                 | 费用           |
| ------------------ | ------------ |
| 域名                 | $1/mo（年付均摊）  |
| Cloudflare Pages   | $0（免费档够用）    |
| AdSense / Ezoic 抽成 | 广告收入的 10–25% |
| 监控（Plausible 自托管）  | $0–$9        |
| 内容外写（可选）           | $50–200（外包）  |
| **总固定成本**          | **< $10/月**  |

**毛利率**：扣除广告平台抽成后 ≈ **80%+**。

***

## 12. 后续可考虑的工具清单（长尾选题池）

按"前端可行性 × 搜索量 × 竞争度"排序：

1. ✅ WebP → PNG（首发）
2. WebP → JPG
3. HEIC → JPG
4. SVG → PNG
5. 图片压缩（无上传，Canvas 降质量）
6. Base64 编解码
7. URL 编解码
8. JSON 格式化 / 校验
9. CSS 压缩 / 美化
10. Markdown → HTML
11. 视频 → GIF（用 ffmpeg.wasm）
12. PDF 合并（用 pdf-lib）
13. 颜色吸取器（屏幕取色）
14. 字体子集化（用 opentype.js）
15. ICO 转换（多尺寸打包）

***

## 13. 验收标准（Definition of Done）

工具页上线需满足：

- [ ] 主功能跑通（上传→预览→下载）
- [ ] Lighthouse：Performance ≥ 90, SEO ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95
- [ ] 移动端 + 桌面端 5 款浏览器实测通过
- [ ] FAQ 结构化数据通过 Google Rich Results Test
- [ ] sitemap.xml / robots.txt 正确
- [ ] 隐私政策 & 关于页可访问
- [ ] AdSense 已嵌入（审核通过后）
- [ ] GA4 / Plausible 事件埋点完成
- [ ] 1 篇配套长文（≥ 1500 词）已发布

***

## 附录 A：参考案例

- **iLoveIMG**（后端方案，但纯前端工具流量的天花板）
- **CloudConvert**（混合方案）
- **Online-Convert / Convertio**
- **TinyPNG**（设计人群高 RPM 标杆）
- **Base64 编解码类小站**（极简单页 + 广告，月 $1k+ 案例多）

> **关键启示**：单页单工具 + 高质量 SEO 长文 + 合理广告位 = 单位流量价值最高的小而美站点。

***

**End of PRD v1.0**
