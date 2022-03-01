<template>
    <div class="container">

        <div class="row p-4">
            <div class="card text-center">
                <img class="card-img-top mx-auto" src="@/assets/img/resbalon.png" alt="Error 404 - Page not found!">
                <div class="card-body">
                    <h4 class="card-title">Lo sentimos</h4>
                    <p class="card-text">La página que necesitas no está disponible</p>
                </div>
                <div class="card-footer">
                    <router-link to="/" class="btn">Home  <i class="fas fa-home" fa-5x></i></router-link>
                </div>
            </div>
        </div>
        

    </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.card {
    border: 0px;
}
.card-footer {
    background-color: #FFF;
    border: 0px;
}
.card-img-top {
    height: auto;
    width: 30%;
    padding: 10px;
}
</style>