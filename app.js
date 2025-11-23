// VeaveSprout - WYSIWYG HTML Editor PoC
// 核心功能：雙向同步、拖拉排序、縮排調整

// DOM 元素
const wysiwygEditor = document.getElementById('wysiwyg');
const codeEditor = document.getElementById('code');
const indentBtn = document.getElementById('indent-btn');
const outdentBtn = document.getElementById('outdent-btn');
const clearBtn = document.getElementById('clear-btn');
const loadSampleBtn = document.getElementById('load-sample-btn');

// 初始化
let isUpdating = false; // 防止循環更新

// 初始化時同步 HTML 到原始碼編輯器
function init() {
    syncWysiwygToCode();
    setupDragAndDrop();
    console.log('VeaveSprout initialized');
}

// ==================== 雙向同步功能 ====================

// WYSIWYG → Code 同步
function syncWysiwygToCode() {
    if (isUpdating) return;
    isUpdating = true;

    // 格式化 HTML（簡單的縮排）
    const html = formatHTML(wysiwygEditor.innerHTML);
    codeEditor.value = html;

    isUpdating = false;
}

// Code → WYSIWYG 同步
function syncCodeToWysiwyg() {
    if (isUpdating) return;
    isUpdating = true;

    wysiwygEditor.innerHTML = codeEditor.value;

    // 重新設置拖拉功能（因為 DOM 已更新）
    setupDragAndDrop();

    isUpdating = false;
}

// 簡單的 HTML 格式化（增加可讀性）
function formatHTML(html) {
    // 移除多餘空白
    html = html.trim();

    // 基本的縮排處理
    let formatted = '';
    let indent = 0;
    const tab = '  '; // 兩個空格

    // 簡單的標籤分行處理
    const lines = html.split(/>\s*</);

    lines.forEach((line, index) => {
        // 補回被 split 移除的 < 和 >
        if (index > 0) line = '<' + line;
        if (index < lines.length - 1) line = line + '>';

        // 減少縮排（閉合標籤）
        if (line.match(/^<\//)) {
            indent = Math.max(0, indent - 1);
        }

        // 加入縮排
        formatted += tab.repeat(indent) + line + '\n';

        // 增加縮排（開放標籤，非自閉合）
        if (line.match(/^<[^\/!][^>]*[^\/]>/) && !line.match(/^<(br|hr|img|input|meta|link)/)) {
            indent++;
        }
    });

    return formatted.trim();
}

// ==================== 拖拉排序功能 ====================

let draggedElement = null;

function setupDragAndDrop() {
    // 為所有 <li> 元素設置拖拉功能
    const listItems = wysiwygEditor.querySelectorAll('li');

    listItems.forEach(item => {
        // 設置可拖拉
        item.setAttribute('draggable', 'true');

        // 拖拉開始
        item.addEventListener('dragstart', handleDragStart);

        // 拖拉經過
        item.addEventListener('dragover', handleDragOver);

        // 拖拉進入
        item.addEventListener('dragenter', handleDragEnter);

        // 拖拉離開
        item.addEventListener('dragleave', handleDragLeave);

        // 放下
        item.addEventListener('drop', handleDrop);

        // 拖拉結束
        item.addEventListener('dragend', handleDragEnd);
    });
}

function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter(e) {
    if (this !== draggedElement && this.tagName === 'LI') {
        this.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    e.preventDefault();

    // 確保是在 <li> 之間拖拉
    if (draggedElement !== this && this.tagName === 'LI') {
        // 取得父列表
        const list = this.parentNode;

        // 判斷插入位置（前或後）
        const rect = this.getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;

        if (e.clientY < midpoint) {
            // 插入到目標元素之前
            list.insertBefore(draggedElement, this);
        } else {
            // 插入到目標元素之後
            list.insertBefore(draggedElement, this.nextSibling);
        }

        // 同步到原始碼
        syncWysiwygToCode();
    }

    return false;
}

function handleDragEnd(e) {
    this.classList.remove('dragging');

    // 清除所有 drag-over 樣式
    const listItems = wysiwygEditor.querySelectorAll('li');
    listItems.forEach(item => {
        item.classList.remove('drag-over');
    });

    draggedElement = null;
}

// ==================== 縮排調整功能 ====================

// 增加縮排（將選中的 <li> 包裹在新的 <ul> 或 <ol> 中）
function increaseIndent() {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    // 找到選中範圍內的 <li> 元素
    let node = selection.anchorNode;

    // 向上尋找 <li>
    while (node && node !== wysiwygEditor) {
        if (node.tagName === 'LI') {
            break;
        }
        node = node.parentNode;
    }

    if (!node || node.tagName !== 'LI') {
        alert('請先選擇一個列表項目');
        return;
    }

    const listItem = node;
    const parentList = listItem.parentNode;
    const listType = parentList.tagName; // UL 或 OL

    // 創建新的子列表
    const newList = document.createElement(listType);
    newList.appendChild(listItem.cloneNode(true));

    // 如果前一個兄弟存在，加入到前一個兄弟中
    const prevSibling = listItem.previousElementSibling;
    if (prevSibling && prevSibling.tagName === 'LI') {
        prevSibling.appendChild(newList);
        listItem.remove();
    } else {
        // 否則創建一個空的 <li> 來包裹
        const wrapperLi = document.createElement('li');
        wrapperLi.appendChild(newList);
        parentList.insertBefore(wrapperLi, listItem);
        listItem.remove();
    }

    // 重新設置拖拉並同步
    setupDragAndDrop();
    syncWysiwygToCode();
}

// 減少縮排（將 <li> 從巢狀列表中提升）
function decreaseIndent() {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    // 找到選中範圍內的 <li> 元素
    let node = selection.anchorNode;

    while (node && node !== wysiwygEditor) {
        if (node.tagName === 'LI') {
            break;
        }
        node = node.parentNode;
    }

    if (!node || node.tagName !== 'LI') {
        alert('請先選擇一個列表項目');
        return;
    }

    const listItem = node;
    const parentList = listItem.parentNode;
    const grandparent = parentList.parentNode;

    // 確認有巢狀結構可以提升
    if (!grandparent || grandparent === wysiwygEditor) {
        alert('已經是最外層，無法再減少縮排');
        return;
    }

    // 如果祖父是 <li>，則插入到祖父之後
    if (grandparent.tagName === 'LI') {
        const greatGrandparent = grandparent.parentNode;
        greatGrandparent.insertBefore(listItem, grandparent.nextSibling);

        // 如果原列表空了，移除它
        if (parentList.children.length === 0) {
            parentList.remove();
        }

        // 如果祖父 <li> 沒有文字內容了，也移除
        if (grandparent.childNodes.length === 1 && grandparent.childNodes[0] === parentList) {
            if (parentList.children.length === 0) {
                grandparent.remove();
            }
        }
    }

    // 重新設置拖拉並同步
    setupDragAndDrop();
    syncWysiwygToCode();
}

// ==================== 工具列按鈕功能 ====================

// 清除內容
function clearContent() {
    if (confirm('確定要清除所有內容嗎？')) {
        wysiwygEditor.innerHTML = '<p>開始編輯...</p>';
        syncWysiwygToCode();
    }
}

// 載入範例內容
function loadSample() {
    wysiwygEditor.innerHTML = `
        <h2>範例文件</h2>
        <p>這是一個包含多種 HTML 元素的範例文件。</p>

        <h3>無序列表範例：</h3>
        <ul>
            <li>水果
                <ul>
                    <li>蘋果</li>
                    <li>香蕉</li>
                    <li>橘子</li>
                </ul>
            </li>
            <li>蔬菜
                <ul>
                    <li>紅蘿蔔</li>
                    <li>青花菜</li>
                </ul>
            </li>
            <li>飲料</li>
        </ul>

        <h3>有序列表範例：</h3>
        <ol>
            <li>準備材料</li>
            <li>開始製作
                <ol>
                    <li>步驟一</li>
                    <li>步驟二</li>
                    <li>步驟三</li>
                </ol>
            </li>
            <li>完成並享用</li>
        </ol>

        <p><strong>提示：</strong>試著拖拉上面的列表項目，或選擇項目後使用工具列按鈕調整縮排！</p>
    `;

    setupDragAndDrop();
    syncWysiwygToCode();
}

// ==================== 事件監聽 ====================

// WYSIWYG 編輯器變更時同步
wysiwygEditor.addEventListener('input', syncWysiwygToCode);

// 當內容變更時重新設置拖拉（例如使用者貼上內容）
wysiwygEditor.addEventListener('paste', () => {
    setTimeout(() => {
        setupDragAndDrop();
        syncWysiwygToCode();
    }, 100);
});

// 原始碼編輯器變更時同步
codeEditor.addEventListener('input', syncCodeToWysiwyg);

// 工具列按鈕
indentBtn.addEventListener('click', increaseIndent);
outdentBtn.addEventListener('click', decreaseIndent);
clearBtn.addEventListener('click', clearContent);
loadSampleBtn.addEventListener('click', loadSample);

// 防止拖拉時的預設行為（避免開啟檔案）
document.addEventListener('dragover', (e) => {
    e.preventDefault();
});

document.addEventListener('drop', (e) => {
    e.preventDefault();
});

// 初始化應用程式
init();
