var num = 0;
var count = 0;
var Timer;
var adlist;
//
function inputURL(){
	url = prompt("URLを入力","");
	//URL Check
	check = checkURL(url);
	if(!check) {
		alert('URLが正しくありません');
		return;
	}
	addURL(url);
}

function checkURL(url){
	check = url.match(/(http|https):\/\/.+/);
	if(!check) {
		return false;
	}
	return true;
}

function addURL(url){
	document.getElementById('url_list').innerHTML += addList(url);
}

function addList(url){
	url = "<li id='url"+num+"' onclick='deleteURL(\"url"+num+"\");' onMouseOver='onMouseLi(\"url"+num+"\");' onMouseOut='outMouseLi(\"url"+num+"\");'>"+url+"</li>";
	num++;
	return url;
}
//リストからURL削除
function deleteURL(id_url){
	var obj = document.getElementById(id_url);
	var obj_parent = obj.parentNode;
	
	obj_parent.removeChild(obj);
}

function onMouseLi(id_url){
	var obj = document.getElementById(id_url);
	obj.style.backgroundColor = 'blue';
}

function outMouseLi(id_url){
	var obj = document.getElementById(id_url);
	obj.style.backgroundColor = 'gray';
}

function surfStart(){
	//startボタン無効
	document.getElementById('start').disabled = true;
	document.getElementById('stop').disabled = false;
	document.getElementById('surftime').readOnly = true;
	document.getElementById('surftime').disabled = true;
	document.getElementById('random').disabled = true;
	//表示間隔チェック
	var time = parseInt(document.getElementById('surftime').value);
	if(time < 10){
		time = 10;
		document.getElementById('surftime').value = time;
	}else if(time > 9999){
		time = 9999;
		document.getElementById('surftime').value = time;
	}
	pageMove();
	Timer = setInterval("pageMove()",time*1000);
}

function surfStop(){
	document.getElementById('start').disabled = false;
	document.getElementById('stop').disabled = true;
	document.getElementById('surftime').readOnly = false;
	document.getElementById('surftime').disabled = false;
	document.getElementById('random').disabled = false;
	clearInterval(Timer);
}

function pageMove(){
	var self = document.getElementById('url_list');
	var url_list = self.getElementsByTagName('li');
	if(count >= url_list.length) count = 0;
	var obj = document.getElementById('surfSiteView');
	obj.src = url_list[count].innerHTML;
	count++;
}

function clearURL(){
	var list = document.getElementById('url_list');
	for(var i = list.childNodes.length-1; i>= 0 ;i--){
		list.removeChild(list.childNodes[i]);
	}
}

function getURL(event){
	var url = event.dataTransfer.getData('text');
	//空白でパース
	var str = url.split("\r");
	for(var i = 0 ; i < str.length ; i++){
		if(!checkURL(str[i])) continue;
		addURL(str[i]);
	}
	event.preventDefault();
}

function ListShuffle(){
	if(document.getElementById('random').checked == true){
		var list = document.getElementById('url_list');
		var url_list = list.getElementsByTagName('li');
		var ary = [];
		for(var i = 0 ; i < url_list.length ; i++){
			ary.push(url_list[i].innerHTML);
		}
		ary = arrayShuffle(ary);
		clearURL();
		num = 0;
		for(var i = 0 ; i < ary.length ; i++){
			list.innerHTML += addList(ary[i]);
		}
	}
}

function arrayShuffle(array){
	var len = array.length;
	var ary = array.concat();
	var res = [];
	while(len) res.push(array.splice(Math.floor(Math.random()*len--),1));
	return res;
}
