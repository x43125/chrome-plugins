document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('save');
    const deleteButton = document.getElementById('delete');
    const container = document.getElementById('container');
    const nameInput = document.getElementById('name');
    const colorInput = document.getElementById('color');

    let currentEllipse = null;

    // 添加颜色块点击事件监听器
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            const rgbColor = window.getComputedStyle(option).backgroundColor;
            const hexColor = rgbToHex(rgbColor);
            colorInput.value = hexColor; // 直接设置为#RRGGBB格式
        });
    });

    saveButton.addEventListener('click', () => {
        const name = nameInput.value;
        const color = colorInput.value;

        console.log("新的配置:名称:", name, ",颜色:", color)

        const ellipses = Array.from(container.getElementsByClassName('ellipse'));
        if (name) {
            if (ellipses.length > 0) {
                console.log("图标已存在")
                // 如果已经存在同名的椭圆，则更新颜色和位置
                for (let i = 0; i < ellipses.length; i++) {
                    const ellipse = ellipses[i];
                    console.log("第", i, "个图标内容:", ellipse.textContent, ellipse.style.borderColor)
                    ellipse.textContent = name;
                    ellipse.style.borderColor = color;
                    // 调整椭圆宽度
                    ellipse.style.width = `${name.length * 10}px`; // 假设每个字符占用10px宽度
                }
            } else {
                // 创建新的椭圆
                const ellipse = document.createElement('div');
                ellipse.classList.add('ellipse');
                ellipse.style.borderColor = color;
                ellipse.textContent = name;
                // 设置椭圆宽度
                ellipse.style.width = `${name.length * 10}px`; // 假设每个字符占用10px宽度

                ellipse.addEventListener('mousedown', startDrag);
                ellipse.addEventListener('mouseup', endDrag);

                container.appendChild(ellipse);
                currentEllipse = ellipse;

                savePosition();
            }
        }
    });

    deleteButton.addEventListener('click', () => {
        if (currentEllipse) {
            container.removeChild(currentEllipse);
            currentEllipse = null;
            savePosition();
        }
    });

    let isDragging = false;
    let offsetX, offsetY;

    function startDrag(e) {
        isDragging = true;
        offsetX = e.clientX - currentEllipse.offsetLeft;
        offsetY = e.clientY - currentEllipse.offsetTop;
        document.addEventListener('mousemove', drag);
    }

    function drag(e) {
        if (isDragging) {
            currentEllipse.style.left = (e.clientX - offsetX) + 'px';
            currentEllipse.style.top = (e.clientY - offsetY) + 'px';
            savePosition();
        }
    }

    function endDrag() {
        isDragging = false;
        document.removeEventListener('mousemove', drag);
    }

    function savePosition() {
        const ellipses = Array.from(container.getElementsByClassName('ellipse'));
        const positions = ellipses.map(ellipse => ({
            name: ellipse.textContent,
            color: ellipse.style.borderColor,
            left: ellipse.style.left,
            top: ellipse.style.top,
            width: ellipse.style.width // 保存宽度
        }));
        localStorage.setItem('ellipses', JSON.stringify(positions));
    }

    function rgbToHex(rgb) {
        const [r, g, b] = rgb.match(/\d+/g).map(Number);
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
    }

    function loadPositions() {
        const positions = JSON.parse(localStorage.getItem('ellipses')) || [];
        positions.forEach(pos => {
            const ellipse = document.createElement('div');
            ellipse.classList.add('ellipse');
            ellipse.style.borderColor = pos.color;
            ellipse.textContent = pos.name;
            ellipse.style.left = pos.left;
            ellipse.style.top = pos.top; 
            ellipse.style.width = pos.width; // 加载宽度

            ellipse.addEventListener('mousedown', startDrag);
            ellipse.addEventListener('mouseup', endDrag);

            container.appendChild(ellipse);

            // 设置当前椭圆为已加载的椭圆
            currentEllipse = ellipse;

            // 设置名称和颜色输入框的值
            nameInput.value = pos.name;
            colorInput.value = rgbToHex(pos.color);
        });
    }    

    loadPositions();
});