
document.addEventListener("DOMContentLoaded", function(){

/* ---------------- DASHBOARD COMPARISON ---------------- */

async function compareConfigs(){

const dc0 = await fetch("DC0-RW.json").then(r=>r.json());
const dc1rw = await fetch("DC1-RW.json").then(r=>r.json());
const dc1ro = await fetch("DC1-RO.json").then(r=>r.json());

let map = {};

function extract(data,label){

data.forEach(section=>{
section.details.forEach(d=>{
if(!map[d.key]) map[d.key] = {};

map[d.key][label] = d.value;
map[d.key].type = section.type;

});
});

}

extract(dc0,"dc0rw");
extract(dc1rw,"dc1rw");
extract(dc1ro,"dc1ro");

let total=0;
let match=0;
let mismatch=0;

let html = `

<table> <tr> <th>Type</th> <th>Key</th> <th>DC0-RW</th> <th>DC1-RW</th> <th>DC1-RO</th> <th>Status</th> </tr> `;

Object.keys(map).forEach(key=>{

let v1 = map[key].dc0rw || "";
let v2 = map[key].dc1rw || "";
let v3 = map[key].dc1ro || "";

total++;

let status="";
let rowClass="";

if(v1===v2 && v2===v3){

status="MATCH";
rowClass="match";
match++;

}else{

status="MISMATCH";
rowClass="mismatch";
mismatch++;

}

html+=`

<tr class="${rowClass}"> <td>${map[key].type}</td> <td>${key}</td> <td>${v1}</td> <td>${v2}</td> <td>${v3}</td> <td>${status}</td> </tr> `;

});

html+="</table>";

document.getElementById("tableContainer").innerHTML = html;

document.getElementById("totalKeys").innerText = total;
document.getElementById("matchCount").innerText = match;
document.getElementById("mismatchCount").innerText = mismatch;

}

/* ---------------- FILTER FUNCTIONS ---------------- */

window.showMismatch = function(){

let rows = document.querySelectorAll("#tableContainer table tr");

rows.forEach((row,index)=>{

if(index===0) return;

if(row.classList.contains("mismatch")){
row.style.display="";
}else{
row.style.display="none";
}

});

}

window.showAll = function(){

let rows = document.querySelectorAll("#tableContainer table tr");

rows.forEach(row=>{
row.style.display="";
});

}

/* ---------------- SEARCH ---------------- */

document.getElementById("search").addEventListener("input",function(){

let val=this.value.toLowerCase();

document.querySelectorAll("#tableContainer table tr").forEach((row,index)=>{

if(index===0) return;

if(row.innerText.toLowerCase().includes(val))
row.style.display="";
else
row.style.display="none";

});

});

/* ---------------- PAGE SWITCH ---------------- */

window.showDashboard = function(){

document.getElementById("dashboard").style.display="block";
document.getElementById("comparePanel").style.display="none";

}

window.showCompare = function(){

document.getElementById("dashboard").style.display="none";
document.getElementById("comparePanel").style.display="block";

}

/* ---------------- CUSTOM COMPARISON ---------------- */

window.runCustomCompare = async function(){

const dc0 = await fetch("DC0-RW.json").then(r=>r.json());
const dc1rw = await fetch("DC1-RW.json").then(r=>r.json());
const dc1ro = await fetch("DC1-RO.json").then(r=>r.json());

let data = {
dc0rw: dc0,
dc1rw: dc1rw,
dc1ro: dc1ro
};

let s1 = document.getElementById("source1").value;
let s2 = document.getElementById("source2").value;

let map = {};

function extract(data,label){

data.forEach(section=>{
section.details.forEach(d=>{

if(!map[d.key]) map[d.key] = {};

map[d.key][label] = d.value;
map[d.key].type = section.type;

});
});

}

extract(data[s1],s1);
extract(data[s2],s2);

let total=0;
let match=0;
let mismatch=0;

let html=`

<table> <tr> <th>Type</th> <th>Key</th> <th>${s1.toUpperCase()}</th> <th>${s2.toUpperCase()}</th> <th>Status</th> </tr> `;

Object.keys(map).forEach(key=>{

let v1 = map[key][s1] || "";
let v2 = map[key][s2] || "";

total++;

let status="";
let rowClass="";

if(v1===v2){
status="MATCH";
rowClass="match";
match++;
}else{
status="MISMATCH";
rowClass="mismatch";
mismatch++;
}

html+=`

<tr class="${rowClass}"> <td>${map[key].type}</td> <td>${key}</td> <td>${v1}</td> <td>${v2}</td> <td>${status}</td> </tr> `;

});

html+="</table>";

document.getElementById("compareResult").innerHTML = html;

document.getElementById("compareTotal").innerText = total;
document.getElementById("compareMatch").innerText = match;
document.getElementById("compareMismatch").innerText = mismatch;

}

/* ---------------- COMPARE FILTER ---------------- */

window.showMismatchCompare = function(){

let rows = document.querySelectorAll("#compareResult table tr");

rows.forEach((row,index)=>{

if(index===0) return;

if(row.classList.contains("mismatch")){
row.style.display="";
}else{
row.style.display="none";
}

});

}

window.showAllCompare = function(){

let rows = document.querySelectorAll("#compareResult table tr");

rows.forEach(row=>{
row.style.display="";
});

}

/* ---------------- INITIAL LOAD ---------------- */

compareConfigs();

});