(function(){
	list(true);
	translate();
	document.getElementById("search").addEventListener("input",search);
	document.getElementById("sort").addEventListener("click",()=>{
		document.getElementById("sort").classList.toggle("active");
		document.getElementById("popupSort").classList.toggle("hidden");
	});
	let sortPopup=document.getElementById("popupSort").children;
		sortPopup[0].addEventListener("click",e=>{sortList("descDate");});
		sortPopup[1].addEventListener("click",e=>{sortList("ascDate");});
		sortPopup[2].addEventListener("click",e=>{sortList("az");});
		sortPopup[3].addEventListener("click",e=>{sortList("za");});
})();

function list(sync){
	browser.storage.local.get().then(result=>{
		let pages=result.pages,
			thumbs=result.thumbs,
			settings=result.settings,
			container=document.getElementById("readinglist"),
			view=settings.view;
		document.documentElement.className=settings.theme;
		document.body.className=view;
		if(settings.showSearchBar)
			document.getElementById("searchbar").removeAttribute("class");
		else{
			document.getElementById("searchbar").className="none";
			document.getElementById("search").value="";
		}
		if(settings.showSort)
			document.getElementById("sort").classList.remove("none");
		else
			document.getElementById("sort").classList.add("none");
		container.className="";
		container.textContent="";
		if(!pages.length){
			let emptyH2=document.createElement("h2");
				emptyH2.textContent=i18n("emptyH2");
			let emptyList=document.createElement("div");
				emptyList.id="emptyList";
				emptyList.textContent=i18n("emptyList");
			emptyList.insertBefore(emptyH2,emptyList.firstChild);
			container.appendChild(emptyList);
		}else{
			pages.forEach((value,i)=>{
				let pageContainer=document.createElement("div");
					pageContainer.id="page"+i;
				let ePages=document.createElement("div");
					ePages.className="pages";
				let eA=document.createElement("a");
					eA.href=value.url;
					eA.addEventListener("click",e=>{
						if(!e.ctrlKey){
							e.preventDefault();
							browser.tabs.update({
								url:value.url
							});
						}
					});
					if(thumbs[i].base==="icons/thumb.svg")
						eA.addEventListener("click",e=>{
							browser.runtime.sendMessage({"updateThumb":true,"id":i,"url":value.url});
						});
				let eBox=document.createElement("div");
					eBox.className="box";
				let eTitle=document.createElement("div");
					eTitle.className="title";
					eTitle.textContent=value.title;
				let eDelete=document.createElement("div");
					eDelete.className="delete";
					eDelete.addEventListener("click",()=>{deleteLeter(i,settings.rapidDeleting);});
					eDelete.addEventListener("mouseover",()=>{hover(i);});
					eDelete.addEventListener("mouseout",()=>{hover(i);});
				let eFavicon=document.createElement("img");
					eFavicon.src=value.favicon;
					eFavicon.className="favicon";
				if(view==="normal"){
					let eBoxThumb=document.createElement("div");
						eBoxThumb.className="boxThumb";
					let eThumb=document.createElement("img");
						eThumb.className="thumb";
						eThumb.src=thumbs[i].base;
					let eUrl=document.createElement("div");
						eUrl.className="url";
						eUrl.textContent=value.domain;
					eA.appendChild(eBoxThumb);
					eBoxThumb.appendChild(eThumb);
					eBoxThumb.appendChild(eFavicon);
					eBox.appendChild(eTitle);
					eBox.appendChild(eUrl);
					eA.appendChild(eBox);
				}else if(view==="compact"){
					eA.appendChild(eFavicon);
					eA.appendChild(eTitle);
				}
				ePages.appendChild(eA);
				pageContainer.appendChild(ePages);
				pageContainer.appendChild(eDelete);
				container.appendChild(pageContainer);
			});
			sortList(settings.sort,true);
		}
		search();
		if(sync)browser.runtime.sendMessage({"sync":true});
	});
}

function sortList(mode="descDate",auto){
	let rl=document.getElementById("readinglist"),
		view=document.body.className,
		btnSort=document.getElementById("popupSort").children;
	document.getElementById("sort").classList.remove("active");
	document.getElementById("popupSort").className="hidden";
	if(rl.dataset.sort===mode&&!auto)return;
	if(!auto){
		browser.storage.local.get("settings").then(result=>{
			let s=result.settings;
			s=Object.assign(s,{sort:mode});
			browser.storage.local.set({settings:s});
		});
	}
	[...btnSort].forEach(v=>{
		v.removeAttribute("class");
	});
	if(mode==="descDate"){
		btnSort[0].className="checked";
		if(rl.dataset.sort){
			let frag=document.createDocumentFragment();
			for(let i=0,len=rl.childElementCount;i<len;i++){
				frag.appendChild(document.getElementById("page"+i));
			}
			rl.appendChild(frag);
		}
		rl.dataset.sort="descDate";
	}else if(mode==="ascDate"){
		btnSort[1].className="checked";
		let frag=document.createDocumentFragment();
		for(let i=rl.childElementCount-1;i>=0;i--){
			frag.appendChild(document.getElementById("page"+i));
		}
		rl.appendChild(frag);
		rl.dataset.sort="ascDate";
	}else if(mode==="az"){
		btnSort[2].className="checked";
		let arrTitles=[],
			titles=document.getElementsByClassName("title"),
			frag=document.createDocumentFragment();
		[...titles].forEach(v=>{
			arrTitles.push(v.textContent.toLowerCase());
		});
		arrTitles.sort();
		let arrId=[];
		[...titles].forEach(v=>{
			let index=arrTitles.indexOf(v.textContent.toLowerCase());
			arrTitles[index]=null;
			arrId[index]=(document.body.className==="normal")?v.parentElement.parentElement.parentElement.parentElement.id:v.parentElement.parentElement.parentElement.id;
		});
		arrId.forEach(v=>{
			frag.appendChild(document.getElementById(v));
		});
		rl.appendChild(frag);
		rl.dataset.sort="az";
	}else if(mode==="za"){
		btnSort[3].className="checked";
		let arrTitles=[],
			titles=document.getElementsByClassName("title"),
			frag=document.createDocumentFragment();
		[...titles].forEach(v=>{
			arrTitles.push(v.textContent.toLowerCase());
		});
		arrTitles.sort();
		arrTitles.reverse();
		let arrId=[];
		[...titles].forEach(v=>{
			let index=arrTitles.indexOf(v.textContent.toLowerCase());
			arrTitles[index]=null;
			arrId[index]=(document.body.className==="normal")?v.parentElement.parentElement.parentElement.parentElement.id:v.parentElement.parentElement.parentElement.id;
		});
		arrId.forEach(v=>{
			frag.appendChild(document.getElementById(v));
		});
		rl.appendChild(frag);
		rl.dataset.sort="za";
	}
}

var timeout1;
function deleteLeter(id,rapid){
	if(rapid){
		deletePage(id);
	}else{
		let pages=document.getElementsByClassName("pages")[id].classList;
		pages.toggle("deleting");
		document.getElementsByClassName("delete")[id].classList.toggle("deleting");
		document.getElementById("readinglist").classList.toggle("deleting");
		if(pages.contains("deleting")){
			timeout1=setTimeout(function(){deletePage(id);},2000);
		}else{
			clearTimeout(timeout1);
		}
	}
}

function deletePage(id){
	browser.storage.local.get(["pages","thumbs"]).then(result=>{
		let pages=result.pages,
			thumbs=result.thumbs;
		pages.splice(id,1);
		thumbs.splice(id,1);
		browser.storage.local.set({pages:pages,thumbs:thumbs});
	}).then(()=>{
		list();
		browser.runtime.sendMessage({"deleted":true,"id":id});
	});
}

function hover(id){
	document.getElementsByClassName("pages")[id].classList.toggle("hover");
}

browser.runtime.onMessage.addListener(run);
function run(m){
	if(m.refreshList)list();
}

function search(){
	let q=document.getElementById("search").value.toLowerCase();
	let p=document.getElementsByClassName("pages");
	[...p].forEach(e=>{
		if(e.getElementsByClassName("title")[0].textContent.toLowerCase().includes(q)||(document.body.classList.contains("normal")&&e.getElementsByClassName("url")[0].textContent.toLowerCase().includes(q)))
			e.classList.remove("none");
		else
			e.classList.add("none");
	});
}

function i18n(e,s1){
	return browser.i18n.getMessage(e,s1);
}

function translate(){
	document.getElementById("search").placeholder=i18n("searchPlaceholer");
	document.getElementById("sort").title=i18n("sort");
	let sortPopup=document.getElementById("popupSort").children;
		sortPopup[0].textContent=i18n("descDate");
		sortPopup[1].textContent=i18n("ascDate");
		sortPopup[2].textContent=i18n("az");
		sortPopup[3].textContent=i18n("za");
}
