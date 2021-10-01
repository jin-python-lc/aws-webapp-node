al = document.getElementById("numlist");
al.addEventListener("click", (e) => {

    	const allhide = document.getElementById("resultlist");
    	allhide.style.display = "";

    	const badhide = document.getElementById("category");
    	badhide.style.display = "none";
});

bl = document.getElementById("categorylist");
bl.addEventListener("click", (e) => {

    	const allhide = document.getElementById("resultlist");
    	allhide.style.display = "none";

    	const badhide = document.getElementById("category");
    	badhide.style.display = "";
});
