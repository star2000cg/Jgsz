// 确保 DOM 完全加载后再执行代码
document.addEventListener('DOMContentLoaded', () => {
    let usedNumbers = new Set();
    let cells = document.querySelectorAll('.cell span'); // 选择 .cell 内的 span 元素
    let generateButton = document.getElementById('generateButton');
    let resetButton = document.getElementById('resetButton');
    let copyButton = document.getElementById('copyButton');
    let saveButton = document.getElementById('saveButton');
    let predictionText = document.getElementById('predictionText');
    let currentCellIndex = 0;

    // 初始化时禁用复制和保存按钮
    copyButton.disabled = true;
    saveButton.disabled = true;

    // 生成随机数字（固定范围：1~64）
    generateButton.addEventListener('click', () => {
        if (currentCellIndex >= cells.length) {
            alert('九宫格已填满！请点击“重置”按钮重新开始。');
            return;
        }

        if (!predictionText.value.trim()) {
            alert('请输入您的预测内容！');
            return;
        }

        let randomNumber;
        do {
            randomNumber = Math.floor(Math.random() * 64) + 1;
        } while (usedNumbers.has(randomNumber));

        usedNumbers.add(randomNumber);
        const formattedNumber = randomNumber < 10 ? `0${randomNumber}` : randomNumber.toString();
        cells[currentCellIndex].textContent = formattedNumber; // 将数字填入当前单元格
        currentCellIndex++;

        if (currentCellIndex === cells.length) {
            copyButton.disabled = false;
            saveButton.disabled = false;
            alert('九宫格已填满！您可以复制或保存结果。');
        }
    });

    // 重置九宫格
    resetButton.addEventListener('click', () => {
        const confirmReset = confirm('确定要重置九宫格吗？');
        if (!confirmReset) return;

        cells.forEach(cell => {
            cell.textContent = ''; // 清空所有单元格
        });
        usedNumbers.clear(); // 清空已用数字集合
        currentCellIndex = 0;
        predictionText.value = '';

        copyButton.disabled = true;
        saveButton.disabled = true;
    });

    // 复制数字到剪贴板
    copyButton.addEventListener('click', () => {
        if (currentCellIndex === 0) {
            alert('没有数字可以复制！');
            return;
        }

        const numbers = Array.from(cells).map(cell => cell.textContent || '空');
        const formattedNumbers = [
            numbers.slice(0, 3).join(' '), // 第一行
            numbers.slice(3, 6).join(' '), // 第二行
            numbers.slice(6, 9).join(' ')  // 第三行
        ].join('\n');

        const now = new Date();
        const timeString = now.toLocaleString();
        const prediction = predictionText.value.trim() || '无';

        const copyText = `中正九宫数字预测结果：\n${formattedNumbers}\n\n客户预测内容：\n${prediction}\n\n生成时间：${timeString}`;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(copyText)
                .then(() => {
                    alert('已复制到剪贴板：\n' + copyText);
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
        textArea.style.position =