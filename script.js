let source
let layer
let marker
let markers = []
let markers_1
let popup

function mapInit() {
  const map = new mapgl.Map("container", {        // карта
    key: "11b7d56b-b6eb-487e-9370-e37e60880f36",
    center: [93.31878, 51.23584],
    zoom: 7,
    style: ''
  });
  map.setLanguage('ru')

  const clusterer = new mapgl.Clusterer(map, {    // кластерный слой
    radius: 40,
  });

  const control = new mapgl.Control(map, '<div><input type="checkbox" id="spo" name="spo"><label for="scales">SPO</label></div>', {
    position: 'topLeft',
  });

  const control_1 = new mapgl.Control(map, '<div><input type="checkbox" id="dou" name="dou"><label for="scales">DOU</label></div>', {
    position: 'topLeft',
  });

  control
    .getContainer()
    .querySelector('input')
    .addEventListener('click', () => {
      if (spo.checked == 1) {
        orgInit('spo', map)
      }
      else {
        map.removeLayer('spo')
        console.log('unproject')
      }
    });

  control_1
    .getContainer()
    .querySelector('input')
    .addEventListener('click', () => {
      orgInit('podved', map)
    });

  const layer = {                                       //слой для кожуунов
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

  const layerSpo = {
    id: 'spo',
    filter: [
      'match',
      ['sourceAttr', 'bar'],
      ['spo'],
      true,
      false,
    ],
    type: 'marker',
  }

  map.on('styleload', () => {   //добавление на карту слоев
    map.addLayer(layerSpo)
    map.addLayer(layer)
  });

  function orgInit(type, map) {
    orgdata.map(data => {

      if (data.type == type) {

        marker = new mapgl.Marker(map, {
          id: `marker_${data.id}`,
          coordinates: [data.k2, data.k1],
          icon: '',
          attributes: {
            bar: type
          }
        })

        popup = new mapgl.HtmlMarker(map, {
          coordinates: marker.getCoordinates(),
          html: `<div class="popup">
                <div class="popup-content">
                  This is a text of the popup
                  <button class="popup-close">Click me</button>
                </div>
              </div>`,
        })

        const popupHtml = popup.getContent();

        function hidePopup() {
          popupHtml.style.display = 'none';
        }

        function showPopup() {
          popupHtml.style.display = 'block'
        }

        hidePopup()

        popupHtml.querySelector('.popup-close').addEventListener('click', hidePopup);

        markers.push({ coordinates: [data.k2, data.k1] })
      }
    })
    marker.on('click', () => console.log(data.name));
    clusterer.load(markers);
  }

  function orgRemove(type, map) { // метод для удаления слоя
    orgdata.map(data => {
      if (data.type == type)
        map.removeLayer(type)
    })
  }
}

