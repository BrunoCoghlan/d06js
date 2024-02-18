const select = document.querySelector('#coins')
const result = document.querySelector('#result')
const input = document.querySelector('#input')
const btn = document.querySelector('#btn')
const coins = []

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
const filterCoins = (token) => {
    token.forEach(e => {
        if (e.unidad_medida.toLowerCase() === 'pesos') { coins.push(e) }
    });
}
const insertCoins = (coins) => {
    let html = ''
    coins.forEach(e => {
        html += `<option value="${e.codigo}" id="${e.codigo}">${e.nombre}</option>`
    });
    select.innerHTML = html
}
const converter = (coin, clp) => {
    const res = clp / +coin.valor
    insertResult(res, coin)
}
const insertResult = (res, coin) => {
    result.innerHTML = `Resultado: ${res.toFixed(3)} ${coin.nombre}`
}
const getRecord = async (coin) => {
    try {
        const res = await fetch(`https://mindicador.cl/api/${coin.codigo}`)
        const record = await res.json()
        config(record)
    } catch (error) {
        alert('Tenemos problemas con los servicios en estemos momentos, vuelva a intentarlo mas tarde')
        console.log('assets/js/app.js/getRecord()')
    }
}
const config = ({serie}) => { 
    // const record = serie.splice(0,10)
    // const record10 = record.map((e)=>{
    //     const fecha = new Date(e.fecha)
    //     return `${fecha.getDate}/${fecha.getMonth}`
    // })
    // console.log(record10)
}
getCoin()

btn.addEventListener('click', () => {
    if (input.value === '') return
    const coin = coins.find(({ codigo }) => codigo === select.value)
    converter(coin, Math.abs(+input.value))
    getRecord(coin)
    input.value = ''
})