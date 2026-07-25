// 顶部输入框确认事件：点击箭头或按回车触发跳转
function handleHeroSubmit() {
    const input = document.querySelector('#hero-input');
    if (input && input.value) {
        window.location.href = '/main/?action=search&q=' + encodeURIComponent(input.value);
    }
}

document.addEventListener('click', (e) => {
    handleHeroSubmit();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if (document.activeElement === input) {
            handleHeroSubmit();
        }
    }
});
