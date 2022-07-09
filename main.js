/// <reference path="jquery-3.6.0.js"/>
"use strict";

$(function getFirstValues() {
    $.ajax({

        type: 'GET',
        beforeSend: function () {
            $("#containerSection").html(
        `<main class="loading">
            <h1>Loading
              <span class="dot">...</span>
            </h1>
            <div id="container">
              <div id="bar"></div>
            </div>
        </main>`
        )
        },

        url: ("https://api.coingecko.com/api/v3/coins"),
        success: coins => {
            initCoinsArr(coins);
        },

        error: err => alert("Error: " + err.status)

    });

    // navbar function
    let nav = document.querySelectorAll("li");

    nav.forEach((li) => {
        li.addEventListener("click", function () {
            removeActive();
            this.classList.add("active");
        });
    });

    function removeActive() {
        nav.forEach((li) => {
            li.classList.remove("active");
        });

    }
    
    // back to home page
    $("#homePage").on('click', async function () {
        window.location.reload()
    })

    // inject "about" component to DOM
    $("#aboutPage").on('click', async function () {
        try {
            const about = await fetch('/about.html')
            const injectAbout = await about.text()
            $(".main").html(injectAbout)
        } catch {
            $(".main").html(`<h1>404</h1>
            <h2>Sorry! The page you are looking for is not found!</h2>`)
        }
    });

    // inject "contact" component to DOM
    $("#contactPage").on('click', async function () {
        try {
            const contact = await fetch('/contact.html')
            const injectContact = await contact.text()
            $(".main").html(injectContact)
        } catch {
            $(".main").html(`<h1>404</h1>
            <h2>Sorry! The page you are looking for is not found!</h2>`)
        }
    });

    //  getting object coin and return html card code, according to coin data 
    function cardsHtmlCode(cardObject) {
        return `<section class="card-section" id="D${cardObject.symbol}">
                    <div class="card">
                        <div class="flip-card">
                            <div class="flip-card__container">
                                <div class="card-front">
                                    <div class="card-front__tp card-front__tp">
                                       <i class="bi bi-cash-coin" style="font-size:30px"></i>
                                       <h2 class="card-front__heading">
                                       ${cardObject.symbol}
                                       </h2>
                                       <p class="card-front__text-price">
                                        ${cardObject.Name}  ${cardObject.id}                                    
                                       </p>
                                    </div>
                                    <div class="card-front__bt">
                                      <p class="card-front__text-view">
                                        View More
                                      </p>
                                    </div>
                                </div>
                                <div class="card-back">
                                <div class="moreInfoBTN">
                                <a class ="bt more-bt"
                                    href="#placeCard${cardObject.symbol}"
                                    id="${cardObject.id}"
                                    data-bs-toggle="collapse" 
                                    aria-expanded="false"
                                    aria-controls="collapseExample">
                                    <span class="fl"></span>
                                    <span class="sfl"></span>
                                    <span class="cross"></span>
                                    <i></i>
                                    <p>More info</p>
                                </a>
                                </div>
                                </div>
                            </div>
                        </div>
                        <div class="inside-page">
                            <div class="inside-page__container">
                                <p class="card-front__text-price">Add To Real Time Reports</p>
                                ${cardObject.ischecked === false ? 
                                `<span class="add" id=${cardObject.symbol}><i class="bi bi-plus-circle-fill"></i></span>` :
                                `<span class="add" id=${cardObject.symbol}><h5>Added<i class="bi bi-check2-all"></i></h5></span>`}
                                <div class="collapse" id="placeCard${cardObject.symbol}">
                                <div class="card card-body" id="footer${cardObject.id}"><div>
                            </div>
                        </div>
                    </div>
                </section>`
    }

    let coinsArr = [];
    // set data from ajax to object and push objects to coins array
    function initCoinsArr(coins) {
        for (let i = 0; i < coins.length; i++) {
            const coinObject = {
                id: coins[i].id,
                Name: coins[i].name,
                symbol: coins[i].symbol,
                ischecked: false
            }
            coinsArr.push(coinObject)
        }
        displayDOM(coinsArr);
        // autocomplete on searching
        let symbolsCoin = coinsArr.map(object => object.symbol);
        $("#searchInput").autocomplete({
            source: symbolsCoin
        })
    };

    // getting html code cards returned from cardsHtmlCode and display them to DOM 
    function displayDOM(coinsArr) {
        let displayCoins = " "
        for (const coin of coinsArr) {
            let coinCard = cardsHtmlCode(coin);
            displayCoins += coinCard
        }
        $("#containerSection").html(displayCoins)
    }
    // search event
    $("#search").on("click", function () {
        try {
            let searchCoin = coinsArr.find(object => object.symbol === $("#searchInput").val())
            $("#containerSection").html(cardsHtmlCode(searchCoin));
        } catch {
            alert("Sorry, the coin is not found. Please try again.")
        }
    });

    //return list item to display in modal
    function setModal(coinObject) {
        return `<h2 class="chosen" id="${coinObject.id}">${coinObject.id} <button class="btn btn-primary" id=${coinObject.id}><i class="bi bi-trash3"></i></button></h2>`
    };

    let reportsArr = []
    // add to live reports 
    $("#containerSection").on('click', ".add", function (event) {
        event.stopPropagation();
        let chosenCoin = coinsArr.find(obj => obj.symbol === $(this).attr('id'))
        let index = reportsArr.indexOf(chosenCoin);

        let indexInCoinsArr = coinsArr.findIndex(obj => obj.symbol === $(this).attr('id'))
        if (index === -1) { // <-- the coin is not exist in reports array
            if (reportsArr.length == 5) { //reports array length > 5 - open modal, dont add the sixth coin
                event.preventDefault();
                let displayModal = '' //create modal dom according to the chosen coins
                for (const li of reportsArr) {
                    const createLi = setModal(li)
                    displayModal += createLi
                }
                $('#coinList').append(displayModal)
                $('#myModal').modal('show')
            } else if (reportsArr.length < 5) { //reports array length < 5 - add this coin
                coinsArr[indexInCoinsArr].ischecked = true;
                reportsArr.push(chosenCoin)
                $(this).html(`<h5>Added <i class="bi bi-check2-all"></i></h5>`)
            }
        } else { //coin is exist already in reports array
            coinsArr[indexInCoinsArr].ischecked = false;
            reportsArr.splice(index, 1);
            $(this).html(`<span class="add" id="${chosenCoin.symbol}"><i class="bi bi-plus-circle-fill"></i></span>`)
        }
    });

    //delete chosen item from reports array, when modal open
    $('#coinList').on('click ', ".btn-primary", function (event) {
        event.stopPropagation();
        let objCard = coinsArr.find(obj => obj.id === $(this).attr('id'))
        let indexCard = coinsArr.findIndex(obj => obj.id === $(this).attr('id'))
        let index = reportsArr.indexOf(objCard);
        if (index === -1) { // <-- coin is not exist in reports array
            coinsArr[indexCard].ischecked = true; // update "ischecked" status to true
            reportsArr.push(objCard) //add to reports array
            $(this).parent('.chosen').css('text-decoration-line', 'none')
        } else { // <-- coin is exist already in reports array
            reportsArr.splice(index, 1); //delete coin from reports array
            coinsArr[indexCard].ischecked = false; //update "ischecked" status to false
            $(this).parent('.chosen').css('text-decoration-line', 'line-through')
        }
    });

    // change the chosen cards onclick "save changes"
    $("#saveChanges").on('click', function () {
        // renew the DOM according to the changes
        let display = ''
        $('#coinList').empty();
        for (const coin of coinsArr) {
            let newCard = cardsHtmlCode(coin)
            display += newCard
        }
        $("#containerSection").html(display)
        $('#myModal').modal('hide')
    });

    // display dom without changes
    $('#cancel').on('click', function () {
        const coinsFromModal = $('#coinList').children();
        for (const coin of coinsFromModal) {
            const index = coinsArr.findIndex(obj => obj.id === $(coin).attr('id'));
            coinsArr[index].ischecked = true;
        }
        let renewDom = '';
        for (const newCoin of coinsArr) {
            let newCard = cardsHtmlCode(newCoin)
            renewDom += newCard
        }
        $("#containerSection").html(renewDom)
    });

    // load more info to card
    $("#containerSection").on("click", ".more-bt", function () {
        let id = $(this).attr('id');
        let searchInLocal = (localStorage.getItem(`${id}`))
        if (searchInLocal !== null) { //check if morInfo data is saved in local storage
            searchInLocal = JSON.parse(searchInLocal) //<-- data is saved. load data from local storage
            displayMoreInfo(searchInLocal)
        } else { //data is not saved, load data from API
            $.ajax({
                type: 'GET',
                beforeSend: function () {
                    $(`#footer${id}`).html(`<div class="spinner-border text-primary" role="status"><span class="visually-hidden"></span></div>`)
                },
                url: (`https://api.coingecko.com/api/v3/coins/${id}`),
                success: coinInfo => getMoreInfoFromURL(coinInfo),
                error: err => alert("Error: " + err.status)
            })
        }
    });

    // set API data into an object, and send it to display on card collapse
    function getMoreInfoFromURL(coinInfo) {
        let moreInfoToCard = {
            id: coinInfo.id,
            image: coinInfo.image.small,
            usdPrice: coinInfo.market_data.current_price.usd,
            eurPrice: coinInfo.market_data.current_price.eur,
            ilsPrice: coinInfo.market_data.current_price.ils
        }
        displayMoreInfo(moreInfoToCard)
    };

    // display more info from api / local storage, save it to local storage
    function displayMoreInfo(moreInfoToCard) {
        $(`#footer${moreInfoToCard.id}`).html(`
                <img src="${moreInfoToCard.image}" width="50px" height="50px">
                <h6 class="price"> USD: ${moreInfoToCard.usdPrice}$</h6>
                <h6 class="price"> EUR: ${moreInfoToCard.eurPrice}€</h6>
                <h6 class="price"> ILS: ${moreInfoToCard.ilsPrice}₪ </h6>`);
        saveToLocalStorage(moreInfoToCard)
    };

    // save morInfo data to local storage 
    function saveToLocalStorage(moreInfoToCard) {
        localStorage.setItem(`${moreInfoToCard.id}`, JSON.stringify(moreInfoToCard))
        clearLocalStorage(moreInfoToCard)
    };

    // clear moreInfo data from local storage after 2 minuets
    function clearLocalStorage(moreInfoToCard) {
        setTimeout(() => {
            localStorage.clear(`${moreInfoToCard.id}`)
        }, 120 * 1000)
    }

    // live reports - bonus
    let coinsSymbol = []

    function loadLiveReport(reportsArr) {
        let url = ''
        reportsArr.forEach(element => {
            coinsSymbol.push(element.symbol)
            url += `${element.symbol},`

        });
        ajaxToCanvas(url, coinsSymbol)
    }
    let coinsValue = []

    function ajaxToCanvas(url, coinsSymbol) {
        setInterval(() => {
            $.ajax({
                type: 'GET',
                url: (
                    `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${url}&tsyms=USD`),
                success: coinsData => {
                    coinsValue = []
                    coinsSymbol.forEach(obj => {
                        let upperCaseObj = obj.toUpperCase()
                        let coinValue = coinsData[`${upperCaseObj}`].USD
                        coinsValue.push(coinValue)
                    })
                },
                error: err => alert("Error: " + err.status)
            });
        }, 2000)
    }
    $("#liveReports").on('click', function () {
        loadLiveReport(reportsArr)
        let dataToCanvas = []
        for (let i = 0; i < coinsSymbol.length; i++) {
            let coinRealData = {
                type: "spline",
                name: `${coinsSymbol[i]}`,
                showInLegend: true,
                dataPoints: [{
                    label: `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`,
                    y: $(coinsValue)[i]
                }, ]
            }
            dataToCanvas.push(coinRealData)
        }

        let chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            exportEnabled: true,
            title: {
                text: "Live Reports"
            },
            axisY: {
                title: "Coins Values"
            },
            toolTip: {
                shared: true
            },
            legend: {
                cursor: "pointer",
                itemclick: toggleDataSeries
            },
            data: dataToCanvas
        });
        setInterval(() => {
            for (let i = 0; i < coinsSymbol.length; i++) {
                let coinRealData = {
                    label: `${new Date().getHours()}:${new
                Date().getMinutes()}:${new Date().getSeconds()}`,
                    y: $(coinsValue)[i]
                }
                dataToCanvas[i].dataPoints.push(coinRealData)
            }
            chart.render();
        }, 2000)

        function toggleDataSeries(e) {
            if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
            } else {
                e.dataSeries.visible = true;
            }
            chart.render();
        }
        $("#containerSection").hide()
        $("#chartContainer").show()
    })
});