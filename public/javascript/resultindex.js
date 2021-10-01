//試験履歴のボタンに正答率表示
let points = JSON.parse(localStorage.getItem('pointsList'));
let score2 = `<a class="btn btn-aws-index btn-index" href = "./result.html"  id="startButton-1">試験1 - 1回目：    正答率<font color="red">${parseInt(points/65*100)}</font>%</a>`;
document.getElementById('resultlist').insertAdjacentHTML('beforeend', score2);

let points2 = JSON.parse(localStorage.getItem('pointsList2'));
let score4 = `<a class="btn btn-aws-index btn-index" href = "./result2.html"  id="startButton-1">試験1 - 2回目：    正答率<font color="red">${parseInt(points2/65*100)}</font>%</a>`;
document.getElementById('resultlist').insertAdjacentHTML('beforeend', score4);

let points3 = JSON.parse(localStorage.getItem('pointsList3'));
let score6 = `<a class="btn btn-aws-index btn-index" href = "./result3.html"  id="startButton-1">試験1 - 3回目：    正答率<font color="red">${parseInt(points3/65*100)}</font>%</a>`;
document.getElementById('resultlist').insertAdjacentHTML('beforeend', score6);
