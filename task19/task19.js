const OWNER_ID = 158994365
const clientId = '51746880';
const redirectUri = 'http://localhost:8080/task19.html';

const authParams = {
  client_id: clientId,
  redirect_uri: redirectUri,
  response_type: 'token',
};


let offset = 10;
let loading = false;


function handleAuthClick() {
  const authUrl = 'https://oauth.vk.com/authorize?' + Object.entries(authParams).map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
  window.location.href = authUrl;
}


// call after data fetch
function callbackFunc(result) {
    middlewareFunc(result.response.items.filter(el => el.marked_as_ads === 0 && !el.is_pinned))
}

function fetchData(offset) {
    const apiUrl = `https://api.vk.com/method/wall.get?owner_id=-${OWNER_ID}&count=10${offset > 0 ? `&offset=${offset}`: ''}&access_token=${accessToken}&v=5.131&callback=callbackFunc`;
    var script = document.createElement('script');
    script.src = apiUrl;
    document.getElementsByTagName("head")[0].appendChild(script);
}

function calculateLocalStorageSize() {
    try {
      if ('localStorage' in window && window['localStorage'] !== null) {
        const totalDataSize = Object.keys(localStorage).reduce((total, key) => {
          const itemSize = (localStorage[key].length * 2); // Умножаем на 2, так как JavaScript использует UTF-16 для хранения строк
          return total + itemSize;
        }, 0);
  
        return totalDataSize;
      } else {
        return 'localStorage is not available in this browser.';
      }
    } catch (e) {
      return 'Error calculating localStorage size: ' + e.message;
    }
  }

function createCarousel(images, parentContainer) {
    const carousel = document.createElement('div');
    carousel.classList.add('carousel');
    const carouselInner = document.createElement('div');
    carouselInner.classList.add('carousel-inner');
    
    images.forEach(imageSrc => {
        const img = document.createElement('img');
        img.src = imageSrc;
        carouselInner.appendChild(img);
    });
    
    carousel.appendChild(carouselInner);
    parentContainer.appendChild(carousel);
    
    let currentIndex = 0;
    
    function showImage(index) {
        if (index < 0) {
            index = images.length - 1;
        } else if (index >= images.length) {
            index = 0;
        }
    
        currentIndex = index;
        const offset = -currentIndex * 100;
        carouselInner.style.transform = `translateX(${offset}%)`;
    }
    
    function nextImage() {
        showImage(currentIndex + 1);
    }
    
    function prevImage() {
        showImage(currentIndex - 1);
    }
    
    let interval = setInterval(nextImage, 3000);
    
    carousel.addEventListener('mouseenter', () => {
        clearInterval(interval);
    });
    
    carousel.addEventListener('mouseleave', () => {
        interval = setInterval(nextImage, 3000);
    });
    
    showImage(currentIndex);
}

let newItems= [];  // saving new posted items when there is more then 10 of them
let newItemsOffset = 0; // offset for fetching newItems until we reach cached items

function middlewareFunc(apiItems) {
    loading = false;
    const cachedItems = JSON.parse(localStorage.getItem('items'))

    // Проверяем наличие элементов в кэше
    if (!cachedItems || cachedItems.length === 0) {
        // Если кэш пустой, сохраняем полученные элементы и выходим

        localStorage.setItem('items', JSON.stringify(apiItems));
        console.log('Используемый объем localStorage: ' + calculateLocalStorageSize() + ' байт');
        showPosts(apiItems);
        return;
    }

    // Находим дату последнего элемента в кэше
    const lastCachedItemDate = cachedItems[0].date > cachedItems[1].date ? cachedItems[0].date: cachedItems[1].date;

    // Фильтруем элементы API, оставляя только те, которые новее последнего элемента в кэше
    const newApiItems = apiItems.filter(apiItem => apiItem.date > lastCachedItemDate);

    // Если есть новые элементы, добавляем их в кэш перед существующими элементами
    if (newApiItems.length === apiItems.length) {
        newItems = [...newApiItems];
        newItemsOffset += 10;
        fetchData(newItemsOffset)
    } else 
    if (newApiItems.length > 0) {

        let updatedItems = [];
        if (newItems.length > 0)
            updatedItems = [...newItems, ...newApiItems, ...cachedItems];
        else
            updatedItems = [...newApiItems, ...cachedItems];

        try {
            localStorage.setItem('items', JSON.stringify(updatedItems));
            console.log('Используемый объем localStorage: ' + calculateLocalStorageSize() + ' байт');
        } catch {
            const newItemsCount = newItems.length + newApiItems.length
            localStorage.removeItem('items')
            localStorage.setItem('items', JSON.stringify(updatedItems.slice(0,updatedItems.length - 1 - newItemsCount)));
            
            console.log('Используемый объем localStorage: ' + calculateLocalStorageSize() + ' байт');
        }

        offset = newItems.length + newApiItems.length + cachedItems.length
        showPosts(updatedItems);
    } else if (apiItems[0].date < cachedItems[cachedItems.length - 1].date) { // подгрузка новых старых постов
       const updatedCachedItems = [...cachedItems, ...apiItems];
       try {
            localStorage.setItem('items', JSON.stringify(updatedCachedItems));
            console.log('Используемый объем localStorage: ' + calculateLocalStorageSize() + ' байт');
       } catch {
            const newItemsCount = apiItems.length;
            localStorage.removeItem('items')
            localStorage.setItem('items', JSON.stringify(updatedCachedItems.slice(newItemsCount,updatedCachedItems.length - 1)));    
            console.log('Используемый объем localStorage: ' + calculateLocalStorageSize() + ' байт');
       }
       showPosts(apiItems)
    } else {
         
        offset = cachedItems.length+1;
        // Если нет новых элементов, просто отображаем существующие
        showPosts(cachedItems);
    }
    // showPosts(items);
}
function showPosts(items) {

    const parent = document.getElementById('posts');

    items.forEach(postInfo => {
        const post = document.createElement('div');
        post.classList.add('post')

        const text = document.createElement('div');
        text.classList.add('text')
        text.innerHTML = postInfo.text
        post.appendChild(text);

        const showMoreButton = document.createElement('div')
        showMoreButton.classList.add('showMore');
        showMoreButton.innerText = 'Показать еще'

        showMoreButton.addEventListener('click', () => {
            text.classList.add('showAllText');
        })

        post.appendChild(showMoreButton)
        

        const images = postInfo.attachments.filter(attach => {
            if (attach.type === 'photo') {
                return true
            } else {
                return false
            }
        }).map(attach => attach.photo.sizes.find(size => size.height > 400).url)
        createCarousel(images, post)

        // post statistic

        const statistic = document.createElement('div');
        statistic.classList.add('statistic_container');
        statistic.innerHTML = `<span>Likes: ${postInfo.likes.count}</span>
            <span>Comments: ${postInfo.comments.count}</span>
            <span>Reposts: ${postInfo.reposts.count}</span>
            `

        post.appendChild(statistic)
        parent.appendChild(post);
    })
}


// scroll handling

const scrollContainer = document.getElementById('posts');

function handleScroll() {
    const containerHeight = scrollContainer.clientHeight;
    const scrollTop = scrollContainer.scrollTop;
    const scrollHeight = scrollContainer.scrollHeight;
    
    if (containerHeight + scrollTop >= scrollHeight - 200) {
      // Пользователь достиг конца контейнера (с дополнительным запасом в 200 пикселей)
      const apiUrl = `https://api.vk.com/method/wall.get?owner_id=-${OWNER_ID}&count=10&offset=${offset}&access_token=${accessToken}&v=5.131&callback=callbackFunc`;
      
      var script = document.createElement('script');
      script.src = apiUrl;
      if (!loading) {
        loading = true;
        offset += 10;
        document.getElementsByTagName("head")[0].appendChild(script);
      }
    }
  }
  
  // Добавляем обработчик события прокрутки контейнера
scrollContainer.addEventListener('scroll', handleScroll);


let authorize = false;
let accessToken;
// Получаем текущий URL-адрес
const currentURL = window.location.href;

// Разбиваем URL на фрагменты, используя символ #
const urlFragments = currentURL.split('#');

// Проверяем, есть ли фрагменты в URL
if (urlFragments.length > 1) {
    authorize = true;
  // Получаем фрагмент URL, содержащий access token
  const fragmentWithAccessToken = urlFragments[1];

  // Разбиваем фрагмент на параметры
  const params = new URLSearchParams(fragmentWithAccessToken);

  // Извлекаем access token
  accessToken = params.get('access_token');

} else {
  console.log('URL не содержит фрагмент с access token.');
}

// Находим кнопку по id и добавляем обработчик события click
if (authorize) {
    document.getElementById('authButton').style.display = 'none';
    fetchData(0);
}
const authButton = document.getElementById('authButton');
authButton.addEventListener('click', handleAuthClick);



  