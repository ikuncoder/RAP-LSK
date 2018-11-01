if (!window.console) {
    window.console = {
        log: function () {
        },
        warn: function () {
        },
        err: function () {
        }
    };
}

function wrapHref(url) {
    return '<a href="' + url + '" target="_blank">' + url + '</a>';
}

YUI().use('handlebars', 'node', 'event', 'jsonp', 'jsonp-url', 'json-stringify', 'datasource', function (Y) {
    window.Y = Y;
    var source = Y.one("#resBoard-template"),
        divLog = document.getElementById("divResBoardLog"),
        ERROR = -1, WARN = -2,                                // log type
        LIGHT_GRAY = '#999', RED = 'red', ORANGE = 'orange',  // colors
        _rootUrl = '',
        logLine = 1;

    log('tester initializing...');
    Y.timeLog = {};
    Y.all('.form').each(function (form) {

        // form start
        form.one('.btn-run').on('click', function (e) {
            Y.one('#divResBoardJson').setHTML('加载中，请稍后...');
            var url = '';
            var qArr = [];
            var i = 0;
            var fields = form.all('.field');
            var baseUrl = Y.one('#txtRootPath').get('value');
            var baseUrlOrigin = Y.one('#txtRootPath').get('value');
            var rapUrl = RAP_ROOT;
            var path = form.getAttribute('path');

            console.log("s%",path);

            if (~path.indexOf('http')) {
                path = path.substring(7);
                path = path.substring(path.indexOf("/"));
            }

            if (path[0] !== '/') {
                path = '/' + path;
            }

            baseUrl += path;
            rapUrl += path;
            fields.each(function (field) {
                var name = field.get('name'),
                    value = field.get('value');
                qArr[i++] = name + '=' + encodeURIComponent(value);
            });

            if (!~baseUrl.indexOf('http://')) {
                baseUrl = "http://" + baseUrl;
            }
            if (!~rapUrl.indexOf('http://')) {
                rapUrl = "http://" + rapUrl;
            }

            url = baseUrl + (baseUrl.indexOf('?') === -1 ? '?' : '&') + qArr.join('&');
            url = urlProcess(url);

            rapUrl = rapUrl + (rapUrl.indexOf('?') === -1 ? '?' : '&') + qArr.join('&');
            rapUrl = urlProcess(rapUrl);

            log('request starting, url: ' + color(wrapHref(url), LIGHT_GRAY));
            Y.timeLog.time = new Date().getTime();
            try {
                Y.jsonp(rapUrl, {
                    on: {
                        /*这里应该是接收到后台的返回值*/
                        success: function (response) {
                            testResHandler.apply(this, [response])
                        },
                        timeout: function () {
                            log(color('timeout', RED) + '... so long time to response!');
                        },
                        failure: function (e) {
                            console.log(color('error occurred!', RED) + color(', detail:' + e.errors[0].error, LIGHT_GRAY));
                        }
                    },
                    timeout: 10000
                });
            } catch (ex) {
                alert(ex);
            }
        });
        // form end
    });


    function sortObj(obj) {
        if (!obj) {
            return obj;
        }
        if (jQuery.isArray(obj)) {
            var newArray = [];
            for (var k = 0; k < obj.length; k++) {
                newArray.push(sortObj(obj[k]));
            }
            return newArray;
        } else if (jQuery.isPlainObject(obj)) {
            var result = {}, keys = [];
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    keys.push(prop);
                }
            }
            keys = keys.sort();
            for (var i = 0, l = keys.length; i < l; i++) {
                result[keys[i]] = sortObj(obj[keys[i]]);
            }
            return result;
        } else {
            return obj;
        }
    }

    function testResHandler(response, form, btn) {
        var obj = response;
        var jsonString;


        var path = Y.one('#txtRootPath').get('value');
        obj = sortObj(obj);
        if (btn != 'rule' && path.indexOf('mockjs') != -1) {
            obj = Mock.mock(obj);
        }

        jsonString = JSON.stringify(obj, function (key, val) {
            if (typeof val === 'function') {
                return "<mockjs custom function handler>";
            } else {
                return val;
            }
        });

        var beginTime = Y.timeLog.time;
        if (!beginTime) return;
        var endTime = new Date().getTime();
        log('request end in:' + color(endTime - beginTime, RED) + 'ms.');
        Y.one('#divResBoardJson').setHTML(jsonString.formatJS());

        return obj;
    }

    function log(msg, type) {
        var arr = [],
            i = 0;
        arr[i++] = color(logLine++, ORANGE);
        if (type === ERROR) {
            arr[i++] = color('&nbsp;&nbsp;ERR!', RED);
        }
        arr[i++] = '&nbsp&nbsp;' + msg + "<br />";
        arr[i++] = divLog.innerHTML;
        divLog.innerHTML = arr.join('');
    }

    function color(t, c) {
        return '<span style="color:' + c + ';">' + t + '</span>';
    }

    function initUrl() {
        var path = Y.one('#txtRootPath').get('value'),
            root = '';
        if (path.indexOf('/') != -1) {
            root = 'http://' + path.substring(0, path.indexOf('/'));
        }

        _rootUrl = root;
    }


    initUrl();

    Y.one('#txtRootPath').on('change', initUrl);

    /*这个函数是用于左下角显示块扩展大小用的*/
    setTimeout(function () {
        var logContainer = $('#divResBoardLog');
        $(document).delegate('#up-trigger', 'click', function () {
            logContainer.animate({
                'height': 500
            });
        }).delegate('#expand-trigger', 'click', function () {
            logContainer.animate({
                'width': '98%'
            });
            $('body').css('padding-bottom', '110px');
        }).delegate('#down-trigger', 'click', function () {
            logContainer.animate({
                'height': 100
            });
        }).delegate('#close-trigger', 'click', function () {
            logContainer.hide('slow');
            $('#show-trigger').show('slow');
        }).delegate('#show-trigger', 'click', function () {
            logContainer.show('slow');
            $('#show-trigger').hide('slow');
        });
    }, 500);

    $('.btn-run-real').on('click', function (e) {
        $(this).toggleClass('active');
        $(this).parents('.tools').find('.real-options').toggle();
    });

    $('.btn-run-do-real').on('click', function (e) {
        $('#divResBoardJson').html('正在进行测试，请稍候...');
    });
    log('tester ready.');

    function urlProcess(url) {
        url = url.replace(/[{}]/g, "");
        url = url.replace(/\/:[^\/]*/g, "/100");

        // remove repeated parameters
        if (url && url.indexOf("?") > -1) {
            var baseUrl = url.substring(0, url.indexOf("?"));
            var paramString = url.substring(url.indexOf("?") + 1);
            var paramArray = paramString.split("&");
            var paramObj = {};
            var i, key, value, item;
            for (i = 0; i < paramArray.length; i++) {
                item = paramArray[i];
                key = item.split("=")[0];
                value = item.split("=")[1];
                if (key && value) {
                    paramObj[key] = value;
                }
            }
            paramArray = [];
            for (key in paramObj) {
                if (paramObj.hasOwnProperty(key)) {
                    paramArray.push(key + "=" + paramObj[key]);
                }
            }
            url = baseUrl + "?" + paramArray.join("&");
        }


        if (url.indexOf('reg:') !== -1) {
            log(color('控制台暂时不支持正则RESTful API(也就是包含reg:的URL)', RED));
        }

        return url;
    }

});


/*function jumpButton(pageId)
{
  alert(pageId);

 $.ajax({
    type:"POST",
    data:{"pageId":pageId},
    dataType:"TEXT",
    async:false,
    url:"/mock/getDomainName.do",
    success:function (data) {
      alert(2);
      alert(data);
      window.location.href="http://"+data+"/query/worldServer/getDau";
    }
  });
}*/
