const server = axios.create({
    //baseURL: 'https://some-domain.com/api/B23tvCollect',//上线域名记得改！！！！！！！
    baseURL: 'http://127.0.0.1:5137/api/B23tvCollect',//测试用上线注释掉
    timeout: 5000,
});
const loadingDialog = document.getElementById('loading-dialog');
const infoDialog = document.getElementById('info-dialog');
const topSnackbar = document.getElementById('top-snackbar');
document.getElementById('info-dialog-confirm').addEventListener('click', () => {
    infoDialog.open = false;
});
function SetSearchResultTitle(count) {
    document.getElementById('search-result-title').textContent = `共${count}条记录`;
    if (count == 0) {
        document.getElementById('result-empty-image').style.display = '';
    } else {
        document.getElementById('result-empty-image').style.display = 'none';
    }
}
// 搜索按钮点击事件
document.getElementById('search-submit').addEventListener('click', () => {
    const q = document.getElementById('search-input').value;
    var targetCount = 0;
    if (q) {
        loadingDialog.open = true;
        server({
            method: 'GET',
            url: `/targets`,
            params: {
                b23tvcode: q
            }
        }).then(response => {
            loadingDialog.open = false;
            document.getElementById('search-result-container').innerHTML = '';
            const targets = response.data["targets"];
            if (targets.length > 0) {
                targetCount = targets.length;
                var count = 0;
                var targetTypeString;
                targets.forEach(target => {
                    count++;
                    const searchResultCardTemplateClone = document.getElementById('search-result-card-template').content.cloneNode(true);
                    searchResultCardTemplateClone.querySelector('#search-result-title').textContent = `#${count}`;
                    searchResultCardTemplateClone.querySelector('#id').textContent = target['targetId'];
                    switch (target['targetType']) {
                        case 0:
                            targetTypeString = '其他';
                            break;
                        case 1:
                            targetTypeString = '视频';
                            break;
                        case 2:
                            targetTypeString = '影视';
                            break;
                        case 3:
                            targetTypeString = '直播';
                            break;
                        case 4:
                            targetTypeString = '图文';
                            break;
                        case 5:
                            targetTypeString = '用户空间';
                            break;
                        case 6:
                            targetTypeString = '文集';
                            break;
                        default:
                            targetTypeString = target['targetType'];
                            break;
                    }
                    searchResultCardTemplateClone.querySelector('#type').textContent = targetTypeString;
                    searchResultCardTemplateClone.querySelector('#target').textContent = target['target'];
                    searchResultCardTemplateClone.querySelector('#target').href = target['target'];
                    searchResultCardTemplateClone.querySelector('#submit-time').textContent = new Date(target['submitTime']).toLocaleString();
                    document.getElementById('search-result-container').appendChild(searchResultCardTemplateClone);
                });
            }
        }).catch(error => {
            infoDialog.headline = '查询失败';
            infoDialog.description = error.response?.data?.detail || error.message;
            infoDialog.open = true;
        }).finally(() => {
            loadingDialog.open = false;
            document.getElementById('search-result').style.display = '';
            SetSearchResultTitle(targetCount);

        });
    }
});
// 上传按钮点击事件
document.getElementById('upload-submit').addEventListener('click', () => {
    loadingDialog.open = true;
    server({
        method: 'POST',
        url: `/B23tvRecord`,
        data: {
            b23tvcode: document.getElementById('upload-input-b23').value,
            target: document.getElementById('upload-input-target').value,
            targettype: parseInt(document.getElementById('upload-select-type').value),
        }
    }).then(response => {
        topSnackbar.textContent = '提交成功';
        topSnackbar.open = true;
    }).catch(error => {
        infoDialog.headline = '提交失败';
        infoDialog.description = error.response?.data?.detail || error.message;
        infoDialog.open = true;
    }).finally(() => {
        loadingDialog.open = false;
    });
});
// 从 URL 参数填充输入框的值
const params = new URLSearchParams(window.location.search);
if (params.get('action') === 'search') {
    const q = params.get('q');
    if (q) {
        const searchInput = document.querySelector('#search-input');
        if (searchInput) {
            searchInput.value = q;
            document.getElementById('search-submit').click();
        }
    }
}
