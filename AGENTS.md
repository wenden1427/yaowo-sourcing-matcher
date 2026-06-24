用中文语言回答我。

## 项目背景

本目录是独立的 Claude Code 项目：**Claude sourcing matcher**。

用途：维护最新的匹配货源项目，包括 1688 搜图、商品找同款、CLIP/AI 筛选、黑左 AI 参考实现和相关逆向分析资料。

## 上下文记忆

每次对话开始时，先读取本项目的 `context_store/INDEX.md` 了解项目全貌。需要详细信息时使用：

```powershell
python "E:\Claude sourcing matcher\context_store\search.py" <关键词>
```

不要把旧历史内容或归档目录一次性加载到上下文。旧 Claude Code 会话已经归档到 `C:\Users\Administrator\.claude\projects_archive\split-2026-06-11`。

## 主要路径

- 1688 找货/搜图参考代码：`legacy_code/`
- 逆向和分析脚本：`reverse_engineering/`
- 文档资料：`docs/`
- 历史上下文：`context_store/`
- 旧压缩包：`archives/`

## 外部运行项目

如果需要查看实际运行包，先确认是否仍在以下位置：

- `E:\ai-test\1688-product-find-gui`
- `E:\ai-test\【有货源】黑左AI`

## CodeGraph

结构性问题优先使用 `codegraph_*` 工具；查字符串、日志、配置文本时再用 `rg`。

## Web Search

搜索需要最新资料时，不要固定只加 `2026`；应优先使用“最新”“current”“2025 2026”“recent”等能覆盖当前年份和近两年资料的查询词。只有在用户明确要求 2026 年资料，或问题确实只关心 2026 年事件/政策/价格/版本时，才把 `2026` 作为限定词。
