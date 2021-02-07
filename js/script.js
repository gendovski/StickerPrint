//Инициализация глобальных переменных, половина из которых не нужна. Но для теста выкинул всё в вар, мне как нубу так проще и исключаю некоторые ошибки
var qrcode = new QRCode(document.getElementById("qrcode"), { width : 200, height : 200 })
var images = new Array()
var tab
var html = `<html>
	<head>
		<style type="text/css" media="print">
		@page { size: landscape; }
		</style>
		<style>
			img { 
				float: left;
				padding: 10px;
			}
			
			#cont {
				padding: 20px 0 0 0;
				overflow: hidden;
				height: 85%;
			}
			
			#text {
				text-align: center;
				margin: 25px;
			}
			h1 {
				font: 48px "Noto Sans", sans-serif;
				font-weight: bold;
			}
			h2 {
				font: 18px "Noto Sans", sans-serif;
				font-weight: bold;
			}
		</style>
		<script>function step1(){
			setTimeout('step2()', 10);}
			function step2(){ window.print(); window.close()}
		</script>
	</head>
	<body onload='step1()'>`	

//Простой слип для ожидания qrcode.makeCode
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

//Асинхронная функция с await, который не хочет работать
async function makeQR() {
	//tab использовал для проверки вызова асинхронной функции без параметров
	//для массива всех данных планшетов мы составляем QR, который либой генерится в img, находим этот img и забираем src как параметр
	tab.data.forEach(tablet => {
		//Если убрать слип, makeCode возвращает пустые значения. Если не убирать, то возвращает нормально. 
		//Но после изменения кода для решения архитектурной проблемы, слип вообще не работает
		qrcode.makeCode(tablet[0]+"|"+tablet[1]+"|"+tablet[2])
		await sleep(1000) //ошибка
		let qrcont = document.getElementById("qrcode")
		let qrimg = qrcont.getElementsByTagName("img")
		console.log(qrimg[0].src)
		images.push(qrimg[0].src)

		//Добавляем к исходному html строки с QR и надписями
		html += `<div id="cont">
				<img src="${qrimg[0]}"/>
				<div id="text">
					<h1>${tablet[0]}</h1>
					<h2>${tablet[2]}</h2>
				</div>
			</div>`
	});

	//Добавляем завершение печатаемого html
	html += `</body>
	</html>`

	//вызываем html на печать
	var pwa = window.open("about:blank", "_new")
	pwa.document.open()
	pwa.document.write(html)
	pwa.document.close()
}

//Загрузка csv из файла, парсинг и возврат в массив. По завершению парсинга вызывается обычная функция, из неё асинхронная
function LoadCSV(evt)
{
	var files = evt.target.files; // FileList object
	Papa.parse(files[0], {
		complete: function(tablets) {
			tab = tablets //это для теста, можно прокинуть в MakeQR tablets или tablets.data
			makeQR()
		}
	});
}

//Проверка на изменения в элементе выбора файла. Запуск парсинга при иземенении
document.getElementById('files').addEventListener('change', LoadCSV, false);