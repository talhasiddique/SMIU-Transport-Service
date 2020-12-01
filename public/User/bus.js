function Createbus() {
    // var div = document.createElement('div')

    // div.setAttribute('class','accordion')
    // console.log(div)

    var div = document.getElementById('Buses')

    var div2 = document.getElementById('show')

    div2.innerHTML = "<div class='accordion' id='Buses'><div class='card card-custom'><div class='card-header' id='BusTwo'><h2 class='mb-0'><button class='btn btn-link collapsed bus-btn-custom' type='button' data-toggle='collapse' data-target='#collapseBusTwo' aria-expanded='false' aria-controls='collapseBusTwo'>BUS # 2</button></h2>Available Seats(<span id='seats-av'>23</span>)</div ><div id='collapseBusTwo' class='collapse' aria-labelledby='BusTwo' data-parent='#Buses'><div class='card-body'><div class='container'><div class='row'>div class='col'><span class='mor-eve-hd'>Morning</span></div><div class='col'><span class='mor-eve-hd'>Evening</span></div></div><div class='row'><div class='col'><span class='pnts-time-hd'><b>Points</b></span></div><div class='col'><span class='pnts-time-hd'><b>Time</b></span></div><div class='col'><span class='pnts-time-hd'><b>Points</b></span></div><div class='col'><span class='pnts-time-hd'><b>Time</b></</div></div><div class='row'><div class='col'><span>Point 1</span></div><div class='col'><span>00:00</span></div><div class='col'><span>Point 1</span></div><div class='col'><span>00:00</span></div></div><div class='row'><div class='col'><span>Point 2</span></div><div class='col'><span>00:00</span></div><div class='col'><span>Point 2</span></div><div class='col'><span>00:00</span></div></div><div class='row'><div class='col'><span>Point 3</span></div><div class='col'><span>00:00</span></div><div class='col'><span>Point 3</span></div><div class='col'><span>00:00</span></div></div><div class='row'><div class='col'><span>Point 4</span></div><div class='col'><span>00:00</span></div><div class='col'><span>Point 4</span></div><div class='col'><span>00:00</span></div></div><div class='row'><div class='col'><span>Point 5</span></div><div class='col'><span>00:00</span></div><div class='col'><span>Point 5</span></div><div class='col'><span>00:00</span></div></div></div><button type='submit' name='subscribe' id='subscribe' class='btn-subs' onclick='subscribe()'>Subscribe</button</div></div></div ></div >";
    console.log(div)
}