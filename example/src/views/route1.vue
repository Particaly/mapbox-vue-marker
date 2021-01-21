<template>
    <div class="route">route1</div>
</template>

<script>
	import vuemarker from './marker.vue'
	export default {
		name: "route1",
        mounted() {
		    let flag = false;
            window.add = () => {
                let count = 0;
                while (count < 4000) {
                    const marker = this.$makeMarker({
                        component: vuemarker,
                        lnglat:[-74.0+count/1000, 40],
                        props: {
                            debug: true
                        },
                        usebox: true,
                        markerType: 'vuemarker'
                    });
                    this.$addMarker(marker, window.map);
                    count++;
                }
            }
            add()
            // let count = 0;
            let handler = () => {
                count++
                let marker = this.$makeMarker({
                    component: vuemarker,
                    lnglat:[-74.0+count/1000, 40],
                    props: {
                        debug: true
                    },
                });
                this.$removeMarker(marker, true);
                let marker2 = this.$makeMarker({
                    component: vuemarker,
                    lnglat:[-74.0+count/1000, 40],
                    props: {
                        debug: true
                    },
                });
                this.$removeMarker(marker2, true);
                requestAnimationFrame(handler)
                console.log(count*2);
            }
            // requestAnimationFrame(handler);
            window.remove = () => {
                this.$removeMarker(this.$getMarkerBox().vuemarker, true);
            }
            setInterval(() => {
                flag = !flag;
                flag ? add() : remove();
            }, 4000);
        }
	}
</script>

<style scoped>
.route {
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 48px;
    z-index: 10;
}
</style>
