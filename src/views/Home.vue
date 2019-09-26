<template>
    <div class="home">
        <div id="map"></div>
    </div>
</template>

<script>
    import vuemarker from './marker.vue'
    import mapboxgl from 'mapbox-gl'
    export default {
        name: 'home',
        data:function(){
            return {
                lnglatBox:[[-74.0, 40],[-75.50, 40],[-74.5, 40.2],[-74.95, 40.2],[-74.95, 40]],
                markerBox:[],
                marker:null
            }
        },
        mounted(){
            mapboxgl.accessToken = 'token';
            var map = new mapboxgl.Map({
                container: 'map', // container id
                style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
                center: [-74.50, 40], // starting position [lng, lat]
                zoom: 9 // starting zoom
            });
            this.marker = this.$makeMarker({
                lnglat:map.getCenter(),
                component:vuemarker,
            });
            for(let i in this.lnglatBox){
                let marker = this.$makeMarker({
                    lnglat:this.lnglatBox[i],
                    component:vuemarker,
                });
                this.markerBox.push(marker);
            }
            map.on('load',() => {
                /*
                * add和remove方法传入的参数可以是一个对象，也可以是一个数组，或是单个marker对象
                * 前提必须是通过make构造出的对象
                *
                * add方法需要传入map
                * */
                this.$addMarker(this.marker,map)
                this.$addMarker(this.markerBox,map)
                this.$removeMarker(this.marker)
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
</style>
