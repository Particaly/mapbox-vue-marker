<template>
    <div class="route">route2</div>
</template>

<script>
	export default {
		name: "route2",
        mounted() {
	        const lnglat = [[-74.95, 40.2], [-74.95, 40]];
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
