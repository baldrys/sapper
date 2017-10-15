
function cSwap(cell){  
    if (cell.className == "t")
        cell.className = "t2";
    else if (cell.className == "t2")
        cell.className = "t";
}

function tableCreate(n) {
    var body = document.getElementsByTagName('body')[0];
    var tbl = document.createElement('table');
    tbl.setAttribute('id', 'myTable');
    tbl.setAttribute('onclick', 'cSwap(event.target)');
    for (var i = 0; i < n; i++) {
        var tr = document.createElement('tr');
        for (var j = 0; j < n; j++) {
            var td = document.createElement('td');
            tr.appendChild(td)
            td.classList.add('t');
        }
        tbl.appendChild(tr);
    }
    body.appendChild(tbl);
}

function changeClors() {
    var table = document.getElementById('myTable');
    table.classList.toggle('invert')
}
tableCreate(5);