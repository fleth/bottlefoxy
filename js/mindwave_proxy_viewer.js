$(function () {
    var data = {};
    var totalPoints = 100;
    var draw_timer_handler = null;
    var websocket = null;

    function createOptionData(timestamp, data, received) {
        return {"timestamp": timestamp, "data": data, "received": received}
    }

    function pushData(brainwaves, option, timestamp) {
        //データがなければ初期データを追加
        if (data[option] == undefined) data[option] = createInitData(timestamp);

        data[option] = data[option].slice(1);
        var brainwave = getBrainwave(brainwaves, option);
        if (brainwave == undefined) {
            data[option].push(createOptionData(timestamp, 0, false));
        } else {
            data[option].push(createOptionData(timestamp, brainwave, false));
        }
    }

    function getBrainwave(brainwaves, option){
        var keys = option.split("-");
        if(keys.length == 1){
            return brainwaves[option];
        }else{
            key = keys.shift();
            return getBrainwave(brainwaves[key], keys.join("-"));
        }

    }

    function updateOptions(brainwaves, options, prefix="") {
        var keys = Object.keys(brainwaves);
        //存在しないkeyならoptionに追加する
        keys.forEach(function (key) {
            if ($.type(brainwaves[key]) == "object") {
                updateOptions(brainwaves[key], options, key);
                return;
            }
            if (prefix != ""){
                key = prefix + "-" + key;
            }
            if (options.find("option[value|=" + key + "]").length == 0) {
                appendOption(options, key);
            }
        });
    }

    function createData(brainwaves, options) {
        var timestamp = Date.now();

        updateOptions(brainwaves, options);

        var children = options.children();
        for (var i = 0; i < children.length; i++) {
            var option = children.eq(i).text();
            pushData(brainwaves, option, timestamp);
        }

        var key = options.val();
        var res = [];
        for (var i = 0; i < data[key].length; ++i) {
            res.push([i, data[key][i]["data"]]);
        }
        return [{label: key, data: res}];
    }

    function appendOption(options, key) {
        options.append($("<option>").val(key).html(key));
    }

    function createInitData(timestamp) {
        var res = [];
        for (var i = 0; i < totalPoints; i++) {
            res[i] = createOptionData(timestamp, 0, false);
        }
        return res;
    }

    function connect(address) {
        var ws = new WebSocket(address);
        ws.addEventListener('open', function () {
            console.log('Connected');
            clearStatus();
            $("#status").addClass("alert-success");
            $("#status").text("connected")
        });
        ws.addEventListener('close', function () {
            console.log('Connection closed');
            clearStatus();
            $("#status").addClass("alert-danger");
            $("#status").text("Connection Closed")
        });
        ws.addEventListener('message', function (e) {
            console.log(e.data);
            var receivedData = JSON.parse(e.data);
            draw(createData(receivedData, $("#eeg_select")));
        });
        return ws;
    }

    function clearStatus(){
        $('#status').removeClass(function(index, className) {
            return (className.match(/\balert-\S+/g) || []).join(' ');
        });
    }

    function draw(createdData) {
        var plot = $.plot("#eeg", createdData);
        plot.draw();
    }

    function setup() {
        websocket = connect($("#wssURL").val());
        clearStatus();
        $("#status").addClass("alert-info");
        $("#status").text("Connecting")
    }

    function disconnect(){
        websocket.close();
        clearStatus();
        $("#status").addClass("alert-info");
        $("#status").text("Closing")
    }

    $("#connect").click(function () {
        setup();
        $("#connect").prop("disabled", true);
        $("#disconnect").prop("disabled", false);
    });

    $("#disconnect").click(function(){
        disconnect();
        $("#connect").prop("disabled", false);
        $("#disconnect").prop("disabled", true);
    });
});
