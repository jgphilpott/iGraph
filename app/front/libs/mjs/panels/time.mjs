// import {animatePlots} from "../animation/plots.mjs"
import {makeDragable} from "../ui/dragable.mjs"

export function addTimePanel() {

  let plot = data.plot

  $("body").append("<div id='time' class='panel'></div>")

  let panel = $("#time.panel")

  panel.append("<h1 id='years'><span id='yearMin'>" + plot.time.yearMin + "</span> - <span id='yearMax'>" + plot.time.yearMax + "</span></h1>")
  panel.append("<img id='line' src='/front/imgs/time/line.svg') }}'>")

  panel.append("<img id='skipBackward' class='button' src='/front/imgs/time/skipBackward.svg') }}'>")
  panel.append("<img id='playForward' class='button' src='/front/imgs/time/playForward.svg') }}'>")
  panel.append("<img id='fastForward' class='button' src='/front/imgs/time/fastForward.svg') }}'>")

  panel.append("<img id='minCap' class='controller' src='/front/imgs/time/cap.svg') }}'>")
  panel.append("<img id='point' class='controller' src='/front/imgs/time/point.svg') }}'>")
  panel.append("<img id='maxCap' class='controller' src='/front/imgs/time/cap.svg') }}'>")

  panel.append("<img id='fastBackward' class='button' src='/front/imgs/time/fastBackward.svg') }}'>")
  panel.append("<img id='playBackward' class='button' src='/front/imgs/time/playBackward.svg') }}'>")
  panel.append("<img id='skipForward' class='button' src='/front/imgs/time/skipForward.svg') }}'>")

  panel.append("<p id='year'>" + plot.time.year + "</p>")

  makeDragable($("#minCap.controller"))
  makeDragable($("#point.controller"))
  makeDragable($("#maxCap.controller"))

  $("body").on("keypress", function(event) {

    if (event.keyCode == 32) {

      // animatePlots()

    }

  })

  makeDragable(panel)

}
