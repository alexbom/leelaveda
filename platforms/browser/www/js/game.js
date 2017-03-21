$(function() {
    var url     = window.location.href.split('/'),
        name    = url.pop().split('.'),
        file    = 'game/' + name[0] + '.txt',
        rawFile = new XMLHttpRequest();

    rawFile.open('GET', file, false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                var result = JSON.parse(rawFile.responseText);
                alert(window.location.href);
            }
        }
    };
    rawFile.send(null);
});