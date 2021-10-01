function onButtonClick() {
	//target = document.getElementById("output");
	//target2 = document.getElementById("output2");
	i = document.forms.id_form1.id_textBox1.value;
	i2 = document.forms.id_form1.id_textBox2.value;
	i3 = document.forms.id_form1.id_textBox3.value;
	i4 = document.forms.id_form1.id_textBox4.value;
	console.log(i);
	console.log(i2);

	var vList = {
		name: `${i}`,
		subject: `${i2}`,
		email: `${i3}`,
		desc: `${i4}`,

	};
	console.log(vList);

	let simpleDataJSON = JSON.stringify(vList);
	console.log(simpleDataJSON);


	fetch('https://********************', {　 // 送信先URL
		method: 'POST', // 通信メソッド
		crossDomain: "true",
		isBase64Encoded: false,
		header: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,Accept",
			"Access-Control-Allow-Methods": "POST,GET,OPTIONS",
			"Access-Control-Allow-Origin": "*"
		  },
		body: JSON.stringify(vList) // JSON形式のデータ
	});
		/* .then(function () {
			alert("メッセージが送信されました！");
			document.getElementById("id_form1").reset();
			location.reload();
		})
		.catch(error() {
			alert("メッセージ送信失敗！");
		}); */

	ret = confirm('お問合せ内容を送信しました。');
	if (ret == true) {
		location.href = "./index.html";
	}


};



/*
var el = document.getElementById("buttonform");
el.addEventListener("click", () => {
	ret = alert('お問合せ内容を送信しました。');
	if (ret == true) {
		location.href = "./index.html";
	}
});
*/
