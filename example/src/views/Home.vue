<template>
    <div class="home">
        <div id="map"></div>
        <div id="map2"></div>
    </div>
</template>

<script>
    import vuemarker from './marker.vue'
    import mapboxgl from 'mapbox-gl'
    import minimap from 'mapboxgl-secondmap'
    let markerOnly,markerBox=[];
    export default {
        name: 'home',
        data:function(){
            return {
                lnglatBox:[[-74.0, 40],[-75.50, 40],[-74.5, 40.2],[-74.95, 40.2],[-74.95, 40]],
            }
        },
        mounted(){
            mapboxgl.accessToken = 'pk.eyJ1Ijoid3pqOTI3MTIiLCJhIjoiY2pxNXphMmgyMjl4dzN4c3oxZTczaXFuNCJ9.7iqkAVOCgYhh4vdW-hmz4g';
            var map = new mapboxgl.Map({
                container: 'map', // container id
                style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
                center: [-74.50, 40], // starting position [lng, lat]
                zoom: 9 // starting zoom
            });

            let a = this.$makeMarker({
                lnglat:map.getCenter(),
                component:vuemarker,
                usebox:true,
                anchor:'center',
                draggable:true
            });

            window.rr = minimap.init({
                mapOptions:{
                    container: 'map2', // container id
                    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
                    center: [-74.50, 40], // starting position [lng, lat]
                    zoom: 9 // starting zoom
                },
                firstmap:map,
                squarebox:a,
                loaded:() => {
                    console.log('loaded');
                }
            })

            markerOnly = this.$makeMarker({
                lnglat:map.getCenter(),
                component:vuemarker,
            });



            // console.log(this.$getMarkerBox());

            for(let i in this.lnglatBox){
                let marker = this.$makeMarker({
                    lnglat:this.lnglatBox[i],
                    component:vuemarker,
                });
                markerBox.push(marker);
            }

            window.map = map;
            map.on('load',() => {
                /*
                * add和remove方法传入的参数可以是一个对象，也可以是一个数组，或是单个marker对象
                * 前提必须是通过make构造出的对象
                *
                * add方法需要传入map
                * */
                window.marker1 = markerOnly
                window.markerbox = markerBox
                // this.$addMarker(markerOnly,map)
                // this.$addMarker(markerBox,map)
                // this.$removeMarker(markerOnly)
            })
        },
    }
</script>

<style lang="scss">
.home{
    width: 100%;
    height: 100%;
}
#map{
    height: 100%;
}
#map2{
    height: 450px;
    width: 800px;
    position: absolute;
    right: 0;
    bottom: 0;
}
</style>
