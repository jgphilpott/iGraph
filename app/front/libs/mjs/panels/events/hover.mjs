import {grayGlass, darkGrayGlass} from "../../colors/glass/grayscale.mjs"

let plot = data.plot

export function addPanelHover(panel) {

  let id = panel.attr("id")
  let close = $("#" + id + " .close")

  panel.mouseover(function() {

    $(".crosshair").remove()
    plot.animation.showCrosshair = false

    panel.css("z-index", 10)
    panel.animate({"backgroundColor": darkGrayGlass}, {"duration": 1500, "queue": false})

    close.animate({"opacity": 0.8}, {"duration": 800, "queue": false})

  }).mouseout(function() {

    plot.animation.showCrosshair = true

    $(".panel").css("z-index", 0)

    panel.css("z-index", 1)
    panel.animate({"backgroundColor": grayGlass}, {"duration": 1500, "queue": false})

    close.animate({"opacity": 0}, {"duration": 800, "queue": false})

  })

  close.click(function() {

    panel.css({"visibility": "hidden"})

  })

}
