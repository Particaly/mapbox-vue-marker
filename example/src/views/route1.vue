<template>
    <div class="route">route1</div>
</template>

<script>
	import vuemarker from './marker.vue'
	export default {
		name: "route1",
        mounted() {
			const lnglatbox = [[-74.0, 40],[-75.50, 40],[-74.5, 40.2]];
			setTimeout(() => {
				lnglatbox.forEach(lnglat => {
					const marker = this.$makeMarker({
						component: vuemarker,
						lnglat,
                        props: {
						    debug: true
                        },
						usebox: true,
						markerType: 'vuemarker'
					});
					this.$addMarker(marker, window.map);
				});
			},3000)
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
