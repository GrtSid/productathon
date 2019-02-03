const rawData = [{"id":"ChIJBUEZMJWAGGARFLVMi2Wfw-U","name":"Nishi-Funabashi","lat":35.7074693,"lng":139.9589668},{"id":"ChIJ2zZR7UfzGGARrusaSSAZYfI","name":"Yoyogi-Uehara","lat":35.668988,"lng":139.679857},{"id":"ChIJW9fE3UiLGGAR_HkDv9w9nvY","name":"Naka-Meguro","lat":35.6442877,"lng":139.6990956},{"id":"ChIJmQz-4OjrGGARuO-X2ESX_-o","name":"Wako-shi","lat":35.7812079,"lng":139.6057934},{"id":"ChIJo9BwwI_yGGARzEFspqeGj3Q","name":"Nakano","lat":35.7073985,"lng":139.6638354},{"id":"ChIJlZA3XjjtGGARSVo7QRde8FY","name":"Kotake-Mukaihara","lat":35.743341,"lng":139.679521},{"id":"ChIJaUNCPNaOGGARuV-q32bYbaE","name":"Oshiage","lat":35.710332,"lng":139.8132971},{"id":"ChIJ8TUonsz0GGARcxiwpBmNByg","name":"Meguro","lat":35.6414629,"lng":139.6981712},{"id":"ChIJO9uCrgSTGGAR_N0zUoOdbJI","name":"Akabane Iwabuchi","lat":35.783504,"lng":139.721821},{"id":"ChIJ0V77rqmLGGARVFqViwaI1Rc","name":"Shirokane-Takanawa","lat":35.642854,"lng":139.734076},{"id":"ChIJW9iFeASLGGARGExZt7v13xg","name":"Shirokanedai","lat":35.6384141,"lng":139.7242717},{"id":"ChIJ6fNOqQeMGGAR-oljwJpU0gw","name":"Otemachi","lat":35.6859152,"lng":139.7684278}]
class Controller {
  constructor (source, destination, options) {
    this.stations = {}
    for(let station of rawData){
      this.stations[station.name] = {}
      //console.log(this.stations[station.name])
      this.stations[station.name]["lat"] = station.lat
      this.stations[station.name]["lng"] = station.lng
    }
    this.source = source
    this.destination = destination
    this.options = options

    this.stations.source = this.source
    this.stations.destination = this.destination
    this.firstStation = this.findNearestStation(source)
  }


  findNearestStation(point){
    let minDistance
    let stationName
    let stationLocation
    let first = true
    for(let station in this.stations){
      let distance = this.distance(point, {lat: this.stations[station].lat, lng: this.stations[station].lng})
      if(station ==='source' || station==='destination'){
        continue
      }
      if(first){
        minDistance = distance
        stationLocation = station
        first = false
      }
      if(distance < minDistance){
        minDistance = distance
        stationName = station
        stationLocation= this.stations[station]
      }
    }
    return {
      minDistance,
      stationName,
      stationLocation
    }
  }


  distance (a, b) {
    function deg2rad(deg) {
      return deg * (Math.PI/180)
    }
    const R = 6371
    let dLat = deg2rad(a.lat - b.lat)
    let dLng = deg2rad(a.lng - b.lng)
    let A =  Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(a.lat)) * Math.cos(deg2rad(b.lat)) * Math.sin(dLng/2) * Math.sin(dLng/2)
    let C = 2 * Math.atan2(Math.sqrt(A), Math.sqrt(1-A))
    let D = R * C
    return D

  }
  check(point){
      this.min=6400
      for(station in rawData[0]){
          this.a=this.distance(point,{lat:rawData[0][station].lat,lng:rawData[0][station].lng})
          if(this.min>this.a)
          this.min=this.a
         console.log(min)
      }
  }
  constructGraph () {
    this.graph = {}
    for (let point in this.stations) {
      for (let adj in this.stations) {
        if (point === adj) {
          continue
        }
        if (this.distance(this.stations[point], this.stations[adj]) <= this.options.MAX_DISTANCE ) {
          this.graph[point] = this.graph[point] || {}
          this.graph[point][adj] = this.distance(this.stations[point], this.stations[adj])
        }
      }
    }
  }

  calculatePath (parrents) {
    this.path = []
    this.stationsOnPath = []
    let current = 'destination'
    while (parrents[current] !== undefined) {
      this.path.push(this.stations[current])
      this.stationsOnPath.push(current)
      current = parrents[current]
    }
    return {
      path: this.path.reverse(),
      stationsOnPath: this.stationsOnPath.reverse()
    }
  }

  dijkstra () {
    if(this.nearestStation > this.options.MAX_DISTANCE / 2 ){
      return this.minDistance = undefined
    }
    let unvisited = Object.keys(this.graph)
    let dis = {}
    let current = 'source'
    let pathParrent = {}
    let maxStep = unvisited.length + 1;
    dis[current] = 0
    while (maxStep--) {
      for (let adj in this.graph[current]) {
        if (dis[adj] === undefined || dis[adj] > dis[current] + this.distance(this.stations[current], this.stations[adj])) {
          dis[adj] = dis[current] + this.distance(this.stations[current], this.stations[adj])
          pathParrent[adj] = current
        }
      }
      unvisited.splice(unvisited.indexOf(current), 1)
      if (current === 'destination') {
        console.log('reached destination')
        break
      }
      current = null
      for (let candidate of unvisited) {
        if (dis[candidate] !== undefined && (current === null || dis[current] > dis[candidate])) {
          current = candidate
        }
      }
    }

    this.calculatePath(pathParrent)
    this.minDistance = dis['destination']
    return this.minDistance
  }

  solve () {
    this.constructGraph()
    this.dijkstra()
    console.log('dijkstra ended')
    if(this.path !== []){
      this.path.unshift(this.source)
      this.stationsOnPath.unshift('source')
    }
    this.path.unshift(this.firstStation.stationLocation)
    this.stationsOnPath.unshift(this.firstStation.stationName)
    this.finalStation = this.findNearestStation(this.destination)
    if(this.finalStation.minDistance > this.options.MAX_DISTANCE/2){
      this.minDistance = undefined
    }
    this.path.push(this.finalStation.stationLocation)
    this.stationsOnPath.push(this.finalStation.stationName)
    if(this.minDistance === undefined){
      this.path = []
      this.stationsOnPath = []
    }
    return {
      distance: this.minDistance,
      path: this.path,
      stationsOnPath: this.stationsOnPath
    }
  }
}
