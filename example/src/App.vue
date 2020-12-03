<template>
    <div id="app">
        <div class="switchBtn" @click="switchRoutes">切换路由</div>
        <Home></Home>
        <router-view/>
    </div>
</template>
<script>
	import Home from './views/Home';
	export default {
		name: 'App',
        components: {
			Home
        },
        computed: {
			path(){
				return this.$route.path
            }
        },
        methods: {
	        switchRoutes() {
	        	const path = this.path === '/'?'/1':'/';
	        	this.$router.push(path);
            }
        },
    }
</script>
<style lang="scss">
    #app {

        width: 100%;
        height: 100%;
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }
    *{
        padding: 0;
        margin: 0;
    }
    body,html{
        width: 100%;
        height: 100%;
    }
    .switchBtn {
        font-size: 48px;
        padding: 20px 50px;
        background: #42b983;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 10;
        cursor: pointer;
    }
</style>
