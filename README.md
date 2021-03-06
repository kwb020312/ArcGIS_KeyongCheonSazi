ArcGIS

ArcGIS를 활용하여 지도상에 필요한 3D 데이터를 삽입하며 다양한 위젯기능을 제공한다.

그 외에도 3D 데이터를 출력하기 위해 가장 괜찮은 포멧 3가지를 사용해본다.

### ArcGIS

ArcGIS는 현재 많은 구글맵 사용 개발자들이 옮겨가고있는 GIS라이브러리 이다.

비용이 지속적으로 조금 씩 올라가는 구글맵 외에 다른 유료 지도 API들과 달리 완전 무료이며 프로젝트를 하며 필요한 대부분의 기능들을 모두 지원한다.

<a href="http://gis-heritage.go.kr/map3d/front/map/mapContents.do">문화재청 종묘 3D</a> 문화재청 홈페이지의 종묘 3D 지도를 본따 만들기로 결정하였음.

```javascript
// 지도
const map = new Map({
    basemap:"satellite"
})
```

satellite형식의 지도를 사용하였으며, 위치는 현재 작업하고있는 동천역 앞으로 지정하였다.

## 첫 화면

<img src="./gitImages/BaseMap.png">

경천사지10층 석탑의 위치를 마커로 표시해줌

```javascript
// 마커
view.graphics.add({
    symbol: {
        type: 'text',
        color: '#89B5F5',
        text: '\ue61d',
        font: {
            size: 30,
            family: 'CalciteWebCoreIcons'
        }
    },
    geometry: {
        type: 'point',
        longitude: 127.09,
        latitude: 37.339
    }
})

// 텍스트
const textSymbol = {
    type: 'text',
    color: 'white',
    haloColor: 'black',
    haloSize: '2px',
    text: '경천사지10층석탑',
    backgroundColor: 'black'
}

view.graphics.add({
    symbol: textSymbol,
    geometry: {
        type: 'point',
        longitude: 127.0905,
        latitude: 37.339
    }
})

```

마커의 로직이며 view 객체는 내장객체 이다.

## 로딩

위의 지도에서 마커를 클릭 할 경우

<img src="gitImages\Loading.png">

로딩바가 돌아가며 로딩이 완료될 때 까지 기다린다.

자세히 살펴보기 위하여 우측의 상단에는 버튼을 배치해 편의성을 높인다.

## 로딩완료

로딩이 완료 되었을 경우에는 해당 데이터를 보기 좋은 시점으로 자동 변경되며

마우스를 통해 자유로운 조작과 시점변경이 가능해짐

```javascript
// 로딩 완료 이벤트
view.when(() => {
    // 경천사지
    Mesh.createFromGLTF(location,'/KC_MODEL1.gltf')
    .then((geometry) => {
        geometry.scale(0.5, {origin: location})
        graphic = new Graphic({
            geometry,
            symbol: {
                type: "mesh-3d",
                symbolLayers: [{
                    type:"fill",
                }]
            }
        })
        view.graphics.add(graphic)
    })
    .then(() => {
        isLoading.style.display = 'none'
    })
    .catch(err => console.log(err))
})
```

<img src="gitImages\Complete.png">

## 거리재기

거리재기 버튼을 사용하여 2D맵 혹은 3D 맵 거리 측정이 모두 가능한데

지면에서의 거리, 꼭짓점과 지면이 맞닿는 대각선의 거리 및 포인트와 포인트 사이의 거리를 모두 알려준다

<img src="gitImages\Distance.png">

토글형식이기 대문에 다시 클릭하는 것으로 지울 수 있음

```javascript
// 거리재기 버튼
let activeWidget
let activeToggle = false

document.querySelector('#distanceButton').addEventListener('click' , () => {
    if(!activeToggle) {
        activeWidget = new DirectLineMeasurement3D({
            view
        });
        activeWidget.viewModel.newMeasurement()
        activeToggle = !activeToggle
    } else {
        view.ui.remove(activeWidget)
        activeWidget.destroy()
        activeWidget = null
        activeToggle = !activeToggle
    }
})
```

## 돌려보기

해당 물체를 기점으로 시계방향으로 무한하게 회전한다.

돌려보기 버튼을 누르게 되면 버튼의 텍스트가 일시정지 로 바뀌게 되며 누른다면 멈출 수 있음

```javascript
// 돌려보기(카메라)
const cam = new Camera({
    heading: 90,
    tilt: 45,
    position: {
        latitude: 37.339,
        longitude: 127.085,
        z: 1000,
    }
})
view.camera = cam
let spinWidget
let viewpoint = new Viewpoint({
    camera: cam,
    rotation:135,
})
let nowRotation = 0

let SpinInterval = null

document.querySelector('#spinButton').addEventListener('click' , (e) => {
    if(e.target.innerText === '돌려보기') {
        SpinInterval = setInterval(() => {
            cam.heading += 2
            view.goTo({
                heading: cam.heading
            })
        }, 100)
        e.target.innerText = '일시정지'
    } else {
        clearInterval(SpinInterval)
        e.target.innerText = '돌려보기'
    }
    
})
```

## 뒤로가기

시점이 다시 위쪽으로 변경되며 우측 상단에 있던 버튼들이 다시 숨겨지게 된다.

```javascript
// 뒤로가기 버튼 클릭 이벤트
backButton.addEventListener('click', (e) => {
    isLoading.style.display = 'block'
    view.graphics.remove(graphic)
    graphic = ''
    setTimeout(() => {
        isLoading.style.display = 'none'
    },3000)
    view.goTo({
        heading: 90,
        tilt: 0,
        position: {
            latitude: 37.339,
            longitude: 127.085,
            z: 3000
        }
    })
    Array.from(top_right).map(a => {
        a.style.display = 'none'
    })
})
```