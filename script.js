let clickCount = 0;

const countryInput = document.getElementById('country');
const myForm = document.getElementById('form');
const modal = document.getElementById('form-feedback-modal');
const clicksInfo = document.getElementById('click-count');

function handleClick() {
    clickCount++;
    clicksInfo.innerText = clickCount;
}

async function getAreaCodeByCity() {

    const city = document.getElementById('city').value;
    const street = document.getElementById('street').value;


    if (!city || !street) {
        console.error('Brak wymaganych danych');
        return;
    }


    const header = {'Application': 'application/json'};
    const apiUrl = `http://kodpocztowy.intami.pl/city/${city}/street/${street}`;

    try {
        // const response = await fetch(apiUrl, method: "GET", header);
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {"Accept": "application/json"}
        })

        const data = await response.json();
        const code = data[0];


        if (!code) {
            console.error('Brak danych');
            return;
        }

        console.log(code);
        document.getElementById('zipCode').value = code
        console.log(`Set data ${code}`);
    } catch (error) {
        console.error('Wystąpił błąd:', error);
    }
}


async function fetchAndFillCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
            throw new Error('Błąd pobierania danych');
        }
        const data = await response.json();
        const countries = data.map(country => country.name.common);
        const countryInput = document.getElementById('country-list');
        countryInput.innerHTML = countries.map(country => `<option value="${country}">`).join('');
    } catch (error) {
        console.error('Wystąpił błąd:', error);
    }
}

function getCountryByIP() {
    fetch('https://get.geojs.io/v1/ip/geo.json')
        .then(response => response.json())
        .then(data => {
            const country = data.country;
            // TODO inject country to form and call getCountryCode(country) function
            console.log(`Country 1 ${country}`);
            countryInput.value = country;
            getCountryCode(country);
        })
        .catch(error => {
            console.error('Błąd pobierania danych z serwera GeoJS:', error);
        });
}

function getCountryCode(countryName) {
    console.log(`Country name ${countryName}`)
    const apiUrl = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;

    fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Błąd pobierania danych');
        }
        return response.json();
    })
    .then(data => {        
        const countryCode = data[0].idd.root + data[0].idd.suffixes.join("")
        // TODO inject countryCode to form
        console.log(`Country code ${countryCode}`);
        document.getElementById('countryCode').value = countryCode;
    })
    .catch(error => {
        console.error('Wystąpił błąd:', error);
    });
}


(() => {
    // nasłuchiwania na zdarzenie kliknięcia myszką
    document.addEventListener('click', handleClick);
    getCountryByIP();
    fetchAndFillCountries();
})()


document.getElementById('street').addEventListener('blur', function() {
    console.log('Input field lost focus:', this.value);
    // Call your function here if the field is not empty
    if (this.value.trim() !== '' && document.getElementById('city').value.trim() !== '') {
        getAreaCodeByCity();
    }
});

// function checkPassword(input) {
//     const passwordRegex = /^[A-Za-z]\w{7,99}$/;
//     const inputField = document.getElementById('exampleInputPassword1');
//     if (input.match(passwordRegex)) {
//         console.log("valid");
//         inputField.classList.remove('is-invalid');
//     } else {
//         console.log("invalid");
//         inputField.classList.add('is-invalid');
//     }
// }

document.getElementById('exampleInputPassword1').addEventListener('blur', function() {
    console.log('Input field lost focus:', this.value);
    if (this.value.trim() !== '') {
        // checkPassword(this.value);
    }
});

// document.getElementById('submitBtn').addEventListener('submit', function(event) {
//     const passwordInput = document.getElementById('exampleInputPassword1');
//     const isPasswordValid = checkPassword(passwordInput.value);
//     if (!isPasswordValid) {
//         // event.preventDefault();
//         console.log('Form submission prevented due to invalid password.');
//     }
// });
