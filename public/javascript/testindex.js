//試験履歴のボタンに正答率表示
if (localStorage.getItem("pointsList3") !== null) {
	let points1 = JSON.parse(localStorage.getItem('pointsList3'));
	let score2 = `<a class="btn btn-aws-index btn-index" href = "./exam.html"  id="startButton">試験1： 　 正答率<font color="red">${parseInt(points1/65*100)}</font>%</a>`;
	document.getElementById('testlist').insertAdjacentHTML('beforeend', score2);
} else if (localStorage.getItem("pointsList2") !== null) {
	let points1 = JSON.parse(localStorage.getItem('pointsList2'));
	let score2 = `<a class="btn btn-aws-index btn-index" href = "./exam.html"  id="startButton">試験1：    正答率<font color="red">${parseInt(points1/65*100)}</font>%</a>`;
	document.getElementById('testlist').insertAdjacentHTML('beforeend', score2);
} else if (localStorage.getItem("checkList") !== null) {
	let points1 = JSON.parse(localStorage.getItem('pointsList'));
	let score2 = `<a class="btn btn-aws-index btn-index" href = "./exam.html"  id="startButton">試験1：    正答率<font color="red">${parseInt(points1/65*100)}</font>%</a>`;
	document.getElementById('testlist').insertAdjacentHTML('beforeend', score2);
} else {
	let score2 = `<a class="btn btn-aws-index btn-index" href = "./exam.html"  id="startButton">試験1： </a>`;
	document.getElementById('testlist').insertAdjacentHTML('beforeend', score2);
};





al = document.getElementById("startButton");
al.addEventListener("click", () => {
    if (localStorage.getItem("checkList") !== null　&& localStorage.getItem("checkList2") !== null && localStorage.getItem("checkList3") !== null) {
        ret = confirm("これ以上テスト履歴を保存できないため今回のテストは記録されません。記録したい場合は履歴を削除してください。")
        //if (ret == true) {
        //    location.href = "./resultindex.html";
        //}
    }
});
