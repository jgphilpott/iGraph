import {year} from "../time/years.mjs"

export function metaUpdate(code) {

  let plot = data.find(item => item.code == code)

  let r = plot.r.find(item => item.year == year).value
  let x = plot.x.find(item => item.year == year).value
  let y = plot.y.find(item => item.year == year).value
  let z = plot.z.find(item => item.year == year).value

  $("#meta-name").text(plot.name)
  $("#meta-flag").attr("src", "/front/imgs/flags/" + code + ".png")
  $("#meta-region").text(plot.region)
  $("#meta-r").text(r)
  $("#meta-x").text(x)
  $("#meta-y").text(y)
  $("#meta-z").text(z)

}

export function metaClear() {

  $("#meta-name").text("No Name")
  $("#meta-flag").attr("src", "/front/imgs/flags/None.png")
  $("#meta-region").text("No Region")
  $("#meta-r").text("None")
  $("#meta-x").text("None")
  $("#meta-y").text("None")
  $("#meta-z").text("None")

}