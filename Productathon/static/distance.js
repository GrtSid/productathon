 function dis(path,source) {
    min=6400
    for(let point in path){
        if(min<distan(source,{lat:point.lat,lng:point.lng})
        min=distan(source,{lat:point.lat,lng:point.lng})
    }
    console.log(min)
}
function distan (a, b) {
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }
  const R = 6371                // Radius of the earth in km
  let dLat = deg2rad(a.lat - b.lat)
  let dLng = deg2rad(a.lng - b.lng)
  let A =  Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(a.lat)) * Math.cos(deg2rad(b.lat)) * Math.sin(dLng/2) * Math.sin(dLng/2)
  let C = 2 * Math.atan2(Math.sqrt(A), Math.sqrt(1-A))
  let D = R * C                 // Distance in km
  return D

}
