let usedNumbers = new Set();
let cells = document.querySelectorAll('.cell');
let generateButton = document.getElementById('generateButton');
let resetButton = document.getElementById('resetButton');
let copyButton = document.getElementById('copyButton');
let saveButton = document.getElementById('saveButton');
let currentCellIndex = 0;

// 生成随机数字（固定范围：1~64）
generateButton.addEventListener('click', () => {
    if (currentCellIndex < cells.length) {
        let randomNumber;
        do {
            randomNumber = Math.floor(Math.random() * 64) + 1;
        } while (usedNumbers.has(randomNumber));

        usedNumbers.add(randomNumber);
        cells[currentCellIndex].textContent = randomNumber;
        currentCellIndex++;

        // 如果九宫格填满，启用复制和保存按钮
        if (currentCellIndex === cells.length) {
            copyButton.disabled = false;
            saveButton.disabled = false;
        }
    } else {
        alert('九宫格已填满！');
    }
});

// 重置九宫格
resetButton.addEventListener('click', () => {
    cells.forEach(cell => {
        cell.textContent = '';
    });
    usedNumbers.clear();
    currentCellIndex = 0;

    // 重置后禁用复制和保存按钮
    copyButton.disabled = true;
    saveButton.disabled = true;
});

// 复制数字到剪贴板
copyButton.addEventListener('click', () => {
    let numbers = Array.from(cells).map(cell => cell.textContent).join(' ');

    // 尝试使用现代剪贴板 API
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(numbers)
            .then(() => {
                alert('已复制到剪贴板: ' + numbers);
            })
            .catch(() => {
                // 如果失败，使用备用方法
                fallbackCopyText(numbers);
            });
    } else {
        // 如果不支持剪贴板 API，使用备用方法
        fallbackCopyText(numbers);
    }
});

// 备用复制方法
function fallbackCopyText(text) {
    let textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed'; // 避免滚动
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    document.body.appendChild(textArea);
    textArea.select();

    try {
        let successful = document.execCommand('copy');
        if (successful) {
            alert('已复制到剪贴板: ' + text);
        } else {
            alert('复制失败，请手动复制以下内容:\n' + text);
        }
    } catch (err) {
        console.error('复制失败: ', err);
        alert('复制失败，请手动复制以下内容:\n' + text);
    } finally {
        document.body.removeChild(textArea); // 清理 DOM
    }
}

// 保存结果到文件
saveButton.addEventListener('click', () => {
    let numbers = Array.from(cells).map(cell => cell.textContent).join(' ');
    const blob = new Blob([numbers], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '九宫格数字预测结果.txt';
    a.click();
    URL.revokeObjectURL(url);
});

// 初始化时禁用复制和保存按钮
copyButton.disabled = true;
saveButton.disabled = true;
