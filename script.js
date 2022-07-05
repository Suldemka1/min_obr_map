// import orgdata from 'assets/geo/kozhuun.js'

let source
let layer
let marker
let markers = []
let markers_1


function mapInit() {
  const map = new mapgl.Map("container", {        // карта
    key: "11b7d56b-b6eb-487e-9370-e37e60880f36",
    center: [93.31878, 51.23584],
    zoom: 7,
    style: ''
  });

  const clusterer = new mapgl.Clusterer(map, {    // кластерный слой
    radius: 60,
  });

  layer = {                                       //слой для кожуунов
    id: `kozhuun`,
    filter: [
      'match',
      ['sourceAttr', 'bar'],
      ['kozhuun'],
      true,
      false,
    ],

    type: 'polygon',
    style: {
      color: 'rgba(39, 144, 245, 0.25)',
      strokeWidth: 1,
      strokeColor: 'rgba(255, 0, 0, 0.41)',
    },
  };

  data.map(data => {                                //добавление кожуунов
    source = new mapgl.GeoJsonSource(map, {
      data,
      attributes: {
        bar: 'kozhuun', // <--- служит для связи со слоем
      },
    })
  })

  function orgInit(type, map) {
    orgdata.map(data => {
      
      if (data.type == type) {
        marker = new mapgl.Marker(map, {
          coordinates: [data.k2, data.k1],
          icon: ''
        })
        markers.push({ coordinates: [data.k2, data.k1] })
      }
    })
  }
  
  orgInit('spo', map)
  orgInit('podved', map)

  clusterer.load(markers);

  map.on('styleload', () => {
    map.addLayer(layer);
  });
}

