const URL = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
const TOKEN = "50a9be7e847428d002324674bd7ac4dd8abad254";

const getOptions = (query) => {
    return {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": "Token " + TOKEN
        },
        body: JSON.stringify({query: query})
    }
}
const showResults = (parentContainer, result, searchInput) => {
    const addresses = result.suggestions.map(address => address.value);
    parentContainer.innerHTML = ''

    addresses.forEach((address, index) => {
        // Создаем элемент div для адреса
        const addressDiv = document.createElement('div');
        addressDiv.textContent = address;

        addressDiv.addEventListener('click', () => {
            searchInput.value = address;
        })

        parentContainer.appendChild(addressDiv);
      });

      return;
}
let timeoutId;

const searchInput = document.getElementById('searchInput');
const resultDiv = document.getElementById('result');

searchInput.addEventListener('input', function() {
  clearTimeout(timeoutId);
  // Get the entered text from the input field
  const searchText = searchInput.value;
  // Use a debounce to delay the API request
  timeoutId = setTimeout(function() {
    fetchData(searchText);
  }, 500);
});

function fetchData(searchText) {
  const options = getOptions(searchText)

  fetch(URL, options).then(response => response.json()).then((result) => {
        console.log(result);
        showResults(resultDiv, result, searchInput);
    }).catch(error => console.log("error", error));

}