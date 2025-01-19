let usedNumbers = new Set();
let cells = document.querySelectorAll('.cell');
let generateButton = document.getElementById('generateButton');
let resetButton = document.getElementById('resetButton');
let copyButton = document.getElementById('copyButton');
let saveButton = document.getElementById('saveButton');
let predictionText = document.getElementById('predictionText');
let currentCellIndex = 0;

// 获取自定义弹窗元素
const customModal = document.getElementById('customModal');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const modalCloseButton = document.getElementById('modalCloseButton');

// 显示自定义弹窗
function showModal(title, message) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    customModal.style.display = 'flex';
}

// 关闭自定义弹窗
modalCloseButton.addEventListener('click', () => {
    customModal.style.display = 'none';
});

// 点击弹窗外部关闭弹窗
window.addEventListener('click', (event) => {
    if (event.target === customModal) {
        customModal.style.display = 'none';
    }
});

// 初始化时禁用复制和保存按钮
copyButton.disabled = true;
saveButton.disabled = true;

// 生成随机数字（固定范围：1~64）
generateButton.addEventListener('click', () => {
    if (currentCellIndex >= cells.length) {
        showModal('中正九宫数字预测', '九宫格已填满！您可以复制或保存结果。');
        return; // 直接返回，不执行后续逻辑
    }

    if (!predictionText.value.trim()) {
        showModal('中正九宫数字预测', '请输入您的预测内容！');
        return;
    }

    let randomNumber;
    do {
        randomNumber = Math.floor(Math.random() * 64) + 1;
    } while (usedNumbers.has(randomNumber));

    usedNumbers.add(randomNumber);
    const formattedNumber = randomNumber < 10 ? `0${randomNumber}` : randomNumber.toString();
    cells[currentCellIndex].textContent = formattedNumber;
    currentCellIndex++;

    // 当九宫格填满时，启用复制和保存按钮
    if (currentCellIndex === cells.length) {
        copyButton.disabled = false;
        saveButton.disabled = false;
        showModal('中正九宫数字预测', '九宫格已填满！您可以复制或保存结果。');
    }
});

// 重置九宫格
resetButton.addEventListener('click', () => {
    showModal('中正九宫数字预测', '确定要重置九宫格吗？');
    modalCloseButton.textContent = '取消';
    const confirmButton = document.createElement('button');
    confirmButton.textContent = '确定';
    confirmButton.style.marginLeft = '10px';
    confirmButton.addEventListener('click', () => {
        customModal.style.display = 'none';
        cells.forEach(cell => {
            cell.textContent = '';
        });
        usedNumbers.clear();
        currentCellIndex = 0;
        predictionText.value = '';
        copyButton.disabled = true;
        saveButton.disabled = true;
    });
    modalCloseButton.insertAdjacentElement('afterend', confirmButton);
});

// 复制数字到剪贴板
copyButton.addEventListener('click', () => {
    if (currentCellIndex === 0) {
        showModal('中正九宫数字预测', '没有数字可以复制！');
        return;
    }

    const numbers = Array.from(cells).map(cell => cell.textContent || '空');
    const formattedNumbers = [
        numbers.slice(0, 3).join(' '), // 第一行
        numbers.slice(3, 6).join(' '), // 第二行
        numbers.slice(6, 9).join(' ')  // 第三行
    ].join('\n'); // 用换行符连接三行

    // 计算九宫格数字总和
    const sum = numbers.reduce((total, num) => {
        const parsedNum = parseInt(num, 10) || 0; // 将字符串转换为数字，如果为空则默认为0
        return total + parsedNum;
    }, 0);

    const now = new Date();
    const timeString = now.toLocaleString();
    const prediction = predictionText.value.trim() || '无';

    // 将总和添加到复制内容中
    const copyText = `中正九宫数字预测结果：\n${formattedNumbers}\n\n数字总和：${sum}\n\n客户预测内容：\n${prediction}\n\n生成时间：${timeString}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(copyText)
            .then(() => {
                showModal('中正九宫数字预测', '已复制到剪贴板：\n' + copyText);
            })
            .catch(() => {
                fallbackCopyText(copyText);
            });
    } else {
        fallbackCopyText(copyText);
    }
});

// 备用复制方法
function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
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
        const successful = document.execCommand('copy');
        if (successful) {
            showModal('中正九宫数字预测', '已复制到剪贴板：\n' + text);
        } else {
            showModal('中正九宫数字预测', '复制失败，请手动复制以下内容：\n' + text);
        }
    } catch (err) {
        showModal('中正九宫数字预测', '复制失败，请手动复制以下内容：\n' + text);
    } finally {
        document.body.removeChild(textArea);
    }
}

// 保存结果到文件
saveButton.addEventListener('click', () => {
    if (currentCellIndex === 0) {
        showModal('中正九宫数字预测', '没有数字可以保存！');
        return;
    }

    const numbers = Array.from(cells).map(cell => cell.textContent || '空').join(' ');
    const prediction = predictionText.value.trim() || '无';

    // 计算九宫格数字总和
    const sum = numbers.split(' ').reduce((total, num) => {
        const parsedNum = parseInt(num, 10) || 0; // 将字符串转换为数字，如果为空则默认为0
        return total + parsedNum;
    }, 0);

    const content = `中正九宫数字预测结果：\n${numbers}\n\n数字总和：${sum}\n\n客户预测内容：\n${prediction}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `中正九宫数字预测结果_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const savePath = isMobile ? '手机的“下载”文件夹' : '电脑的“下载”文件夹';
    showModal('中正九宫数字预测', `文件已保存为“${a.download}”！\n\n保存路径：${savePath}\n\n请检查您的下载文件夹。`);
});

// 注册 Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/Jgsz/service-worker.js')
        .then((registration) => {
            console.log('Service Worker 注册成功，范围：', registration.scope);
        })
        .catch((err) => {
            console.error('Service Worker 注册失败: ', err);
        });
}