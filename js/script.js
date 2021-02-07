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

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

async function makeQR() {
	tab.data.forEach(tablet => {
		qrcode.makeCode(tablet[0]+"|"+tablet[1]+"|"+tablet[2])
		await sleep(1000)
		let qrcont = document.getElementById("qrcode")
		let qrimg = qrcont.getElementsByTagName("img")
		console.log(qrimg[0].src)
		images.push(qrimg[0].src)
		//document.getElementsByTagName('body')[0].appendChild(images[images.length - 1])

		html += `<div id="cont">
				<img src="${qrimg[0]}"/>
				<div id="text">
					<h1>${tablet[0]}</h1>
					<h2>${tablet[2]}</h2>
				</div>
			</div>`
	});

	html += `</body>
	</html>`

	var pwa = window.open("about:blank", "_new")
	pwa.document.open()
	pwa.document.write(html)
	pwa.document.close()
}

function LoadCSV(evt)
{
	var files = evt.target.files; // FileList object
	Papa.parse(files[0], {
		complete: function(tablets) {
			tab = tablets
			makeQR();
		}
	});
}

document.getElementById('files').addEventListener('change', LoadCSV, false);