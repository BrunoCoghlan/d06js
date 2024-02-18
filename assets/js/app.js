/*DECLARACION DE VARIABLES */
const select = document.querySelector('#coins')
const result = document.querySelector('#result')
const input = document.querySelector('#input')
const btn = document.querySelector('#btn')
const graphic = document.querySelector('#graphic')
let myChart = new Chart(document.querySelector('#chart'))
const coins = []
/*OBTIENE SE RECORRE EL OBJETO Y SE AGREGAN SOLO LOS OBJETOS EN LA VARIABLE TOKEN*/
const getCoin = async () => {
    try {
        const res = await fetch('https://mindicador.cl/api')
        const coin = await res.json()
        const token = []
        for (let object in coin) {
            if (typeof coin[object] === 'object') {
                token.push(coin[object])
            }
        }
        filterCoins(token)
        insertCoins(coins)
    } catch (error) {
        alert('Tenemos problemas con los servicios en estemos momentos, vuelva a intentarlo mas tarde')
        console.log('assets/js/app.js/getCoin()')
    }
}
/*SE FILTRAN LOS OBJETOS PARA CONSEGUIR SOLO LOS CON UNIDAD DE MEDIDA PESO Y DE INGRESAN EN LA VARIABLE COIN GLOBAL*/
const filterCoins = (token) => {
    token.forEach(e => {
        if (e.unidad_medida.toLowerCase() === 'pesos') { coins.push(e) }
    });
}
/*SE AGREGAN LAS MONEDAS COMO OPTION EN EL SELECT DEL HTML*/
const insertCoins = (coins) => {
    let html = ''
    coins.forEach(e => {
        html += `<option value="${e.codigo}" id="${e.codigo}">${e.nombre}</option>`
    });
    select.innerHTML = html
}
/*CONVIERTE EL RESULTADO INGRESADO EN CLP, AL EQUIVALENTE EN LA MONEDA SELECCIONADA*/
const converter = (coin, clp) => {
    const res = clp / +coin.valor
    insertResult(res, coin)
}
/*INSERTA EL RESULTADO, LIMITANDO LA CANTIDAD DE DECIMALES*/
const insertResult = (res, coin) => {
    result.innerHTML = `Resultado: ${res.toFixed(3)} ${coin.nombre}`
}
/*OBTIENE LOS DATOS HISTORICOS DE LA MONEDA SELECCIONADA, SON ENVIADOS PARA CREAR EL GRAFICO*/
const getRecord = async (coin) => {
    try {
        const res = await fetch(`https://mindicador.cl/api/${coin.codigo}`)
        const record = await res.json()
        setupChart(record)
    } catch (error) {
        alert('Tenemos problemas con los servicios en estemos momentos, vuelva a intentarlo mas tarde')
        console.log('assets/js/app.js/getRecord()')
    }
}
/*REALIZA LA CONFIGURACION DE SETUP DE CHARTJS, CREANDO LABELS Y DATASET*/
const setupChart = ({ serie }) => {
    const record = serie.splice(0, 10)
    const labels = record.map((e) => {
        const fecha = new Date(e.fecha)
        return `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`
    })
    const value = record.map((e) => {
        return e.valor
    })
    const datasets = [{ label: `${select.value.toUpperCase()} en CLP`, data: value, borderColor: 'rgb(75, 192, 192)' }]
    insertChart({ type: 'line', data:{ labels, datasets }})
}
/*SE ELIMINA EL GRAFICO CREADO DE MANERA GLOBAL, LUEGO SE CREA UNO NUEVO Y SE LE AGREGAN FONDO BLANCO.*/
const insertChart = (config) => {
    myChart.destroy()
    myChart = new Chart(document.querySelector('#chart'), config )
    if(!graphic.classList.contains('graphic')) return graphic.classList.add('graphic')
}
/*SE INVOCA INICIALMENTE PARA LLENAR LA CELDA SELECT */
getCoin()
/*QUEDA PENDIENTE A INGRESO DE DATOS PARA LUEGO GENERAR GRAFICOS*/
btn.addEventListener('click', () => {
    if (input.value === '') return
    const coin = coins.find(({ codigo }) => codigo === select.value)
    converter(coin, Math.abs(+input.value))
    getRecord(coin)
    input.value = ''
})