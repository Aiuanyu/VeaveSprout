# VeaveSprout PoC - 使用說明

## 概述

VeaveSprout 是一個 HTML WYSIWYG 編輯器的概念驗證（Proof of Concept）實作。本專案展示了如何使用純 Web 技術（HTML、CSS、JavaScript）建立一個具備基本 WYSIWYG 功能的編輯器。

## 核心功能

### ✅ 已實作功能

1. **雙欄編輯介面**
   - 左側：WYSIWYG 視覺化編輯器
   - 右側：HTML 原始碼編輯器
   - 雙向即時同步

2. **拖拉排序（Drag & Drop）**
   - 支援所有 `<li>` 元素的拖拉重新排序
   - 視覺化回饋（拖拉時高亮顯示）
   - 支援巢狀列表的拖拉

3. **縮排調整**
   - 增加縮排：將列表項目變成子列表
   - 減少縮排：將列表項目提升到上層
   - 即時更新 HTML 結構

4. **符合 W3C 標準**
   - 使用瀏覽器原生的 `contenteditable` 屬性
   - 使用標準的 Drag and Drop API
   - 產生的 HTML 符合 HTML5 標準

## 快速開始

### 方法一：直接在瀏覽器中開啟

1. 下載或複製此儲存庫
2. 在瀏覽器中開啟 `index.html` 檔案
3. 開始編輯！

**就這麼簡單！** 不需要安裝任何套件或執行建置流程。

### 方法二：使用本地伺服器（推薦）

為了避免某些瀏覽器的安全限制，建議使用本地伺服器：

```bash
# 使用 Python 3
python3 -m http.server 8000

# 或使用 Node.js 的 http-server
npx http-server
```

然後在瀏覽器中訪問 `http://localhost:8000`

## 使用指南

### 基本編輯

1. **在 WYSIWYG 編輯器中編輯**
   - 直接在左側編輯區域輸入文字
   - 可以使用標準的編輯快捷鍵（Ctrl+B 粗體、Ctrl+I 斜體等，取決於瀏覽器）
   - 修改後會即時同步到右側的 HTML 原始碼

2. **在原始碼編輯器中編輯**
   - 直接在右側編輯 HTML 程式碼
   - 修改後會即時反映在左側的視覺化編輯器

### 拖拉排序列表項目

1. 將滑鼠移到任何 `<li>` 元素上
2. 按住滑鼠左鍵開始拖拉
3. 移動到目標位置
4. 放開滑鼠完成排序

**提示：** 拖拉時，目標位置會有藍色線條指示插入點

### 調整列表縮排

1. **增加縮排**：
   - 點選要調整的 `<li>` 項目
   - 點擊工具列的「➡️ 增加縮排」按鈕
   - 該項目會變成上一個項目的子列表

2. **減少縮排**：
   - 點選要調整的 `<li>` 項目
   - 點擊工具列的「⬅️ 減少縮排」按鈕
   - 該項目會提升到上一層級

### 其他功能

- **🗑️ 清除**：清空編輯器內容
- **📄 載入範例**：載入一個包含多層巢狀列表的範例文件

## 技術架構

### 使用的技術

- **HTML5**：語義化標籤、contenteditable 屬性
- **CSS3**：Flexbox 佈局、漸層背景、動畫效果
- **JavaScript (ES6+)**：DOM 操作、事件處理、Drag and Drop API

### 核心實作

1. **雙向同步機制**
   ```javascript
   // WYSIWYG → Code
   wysiwygEditor.addEventListener('input', syncWysiwygToCode);

   // Code → WYSIWYG
   codeEditor.addEventListener('input', syncCodeToWysiwyg);
   ```

2. **拖拉排序**
   - 使用原生 `draggable` 屬性
   - 監聽 `dragstart`, `dragover`, `drop`, `dragend` 等事件
   - 透過 DOM 操作即時重新排序元素

3. **縮排調整**
   - 動態建立和移除巢狀 `<ul>` 或 `<ol>` 元素
   - 使用 `insertBefore` 和 `appendChild` 重組 DOM 結構

### 檔案結構

```
VeaveSprout/
├── index.html       # 主 HTML 檔案（UI 結構）
├── styles.css       # 樣式表（視覺設計）
├── app.js           # JavaScript 核心邏輯
└── README-PoC.md    # 本使用說明文件
```

## 瀏覽器相容性

本 PoC 使用現代瀏覽器的標準 API，建議使用：

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

**注意：** 舊版瀏覽器可能不支援某些功能。

## 限制與未來改進

### 目前限制

1. **HTML 格式化**：自動格式化功能較簡單，複雜的 HTML 可能排版不理想
2. **復原/重做**：尚未實作復原（Undo）和重做（Redo）功能
3. **圖片和媒體**：尚未處理圖片、影片等媒體元素的特殊操作
4. **檔案儲存**：無法儲存到本地檔案系統（需使用瀏覽器的下載 API）
5. **多元素拖拉**：目前只能單個拖拉列表項目，無法批次選取

### 建議改進方向

#### 短期改進（1-2 週）

- [ ] 加入復原/重做功能（使用 History API 或自訂堆疊）
- [ ] 實作檔案匯出功能（下載為 .html）
- [ ] 加入更多工具列按鈕（粗體、斜體、超連結等）
- [ ] 改進 HTML 格式化（使用 prettier 或類似工具）
- [ ] 加入語法高亮（使用 CodeMirror 或 Monaco Editor）

#### 中期改進（1 個月）

- [ ] 支援圖片上傳和插入
- [ ] 實作元件面板（可拖拉的 HTML 元件）
- [ ] 加入即時 HTML 驗證（使用 htmlhint）
- [ ] 實作多分頁或專案管理
- [ ] 加入主題和樣式編輯器

#### 長期改進（3 個月以上）

- [ ] 使用 Electron 封裝成桌面應用程式
- [ ] 整合 Gecko 或 Chromium 引擎（確保渲染一致性）
- [ ] 實作外掛系統（plugin architecture）
- [ ] 加入 CSS 視覺化編輯器
- [ ] 支援響應式設計預覽（多裝置檢視）
- [ ] 加入 Git 版本控制整合

## 與歷史編輯器的比較

| 功能 | Nvu/KompoZer | BlueGriffon | VeaveSprout PoC |
|------|--------------|-------------|-----------------|
| 渲染引擎 | Gecko | Gecko | Blink/WebKit (瀏覽器) |
| 平台 | 桌面應用 | 桌面應用 | Web App |
| 拖拉元素 | ✅ | ✅ | ✅ (僅列表) |
| 即時同步 | ✅ | ✅ | ✅ |
| 開發難度 | 高 | 高 | 低 |
| 維護狀態 | 停止 | 停止 | 活躍 |

## 開發者資訊

### 如何擴展

1. **加入新的工具列按鈕**
   ```javascript
   // 在 index.html 中加入按鈕
   <button id="my-btn">我的功能</button>

   // 在 app.js 中加入事件監聽
   document.getElementById('my-btn').addEventListener('click', () => {
       // 你的功能邏輯
   });
   ```

2. **加入新的 HTML 元素支援**
   - 在 `setupDragAndDrop()` 中加入新的選擇器
   - 為新元素類型加入特定的拖拉邏輯

3. **自訂樣式**
   - 修改 `styles.css` 中的變數和樣式
   - 可以輕鬆更換顏色主題

### 除錯提示

開啟瀏覽器的開發者工具（F12），在 Console 中可以看到：

- 初始化訊息：`VeaveSprout initialized`
- 任何 JavaScript 錯誤或警告

## 常見問題

**Q: 為什麼不直接用 CKEditor 或 TinyMCE？**

A: 這些編輯器主要針對富文本內容（格式化文字），而 VeaveSprout 的目標是操作 HTML 結構本身。我們需要更底層的控制來實作拖拉 HTML 元素和結構重組。

**Q: 為什麼選擇 Web App 而不是桌面應用？**

A: Web App 開發速度快，便於快速驗證核心概念。如果 PoC 成功，可以使用 Electron 或 Tauri 封裝成桌面應用。

**Q: 如何確保符合 W3C 標準？**

A: 本 PoC 使用瀏覽器原生的 API 和標準的 HTML5 元素，由瀏覽器引擎確保標準符合性。未來可以整合 HTML 驗證工具（如 validator.w3.org）。

**Q: 能否支援 Gecko 引擎？**

A: 如果使用 Firefox 瀏覽器開啟本應用，就是使用 Gecko 引擎。如果要製作獨立的 Gecko-based 應用，需要更複雜的開發流程（參考 Firefox 的 WebExtension 或 XUL）。

## 授權

本專案採用開放原始碼授權（待定）。

## 貢獻

歡迎提交 Issue 和 Pull Request！

---

**Generated with [Claude Code](https://claude.ai/code)**
