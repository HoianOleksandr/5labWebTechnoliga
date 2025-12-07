
function loadHome() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="hero-section">
            <h1>Ласкаво просимо!</h1>
            <p>Оберіть категорію товарів або послуг, щоб переглянути асортимент</p>
            <div class="mt-4">
                <button class="btn btn-primary btn-lg" onclick="loadCatalog()">
                    Переглянути каталог
                </button>
            </div>
        </div>
    `;
}
function loadCatalog() {
    const content = document.getElementById('content');

    content.innerHTML = '<div class="loading"><i class="fas fa-spinner"></i><p>Завантаження...</p></div>';

    fetch('data/categories.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Помилка завантаження категорій');
            }
            return response.json();
        })
        .then(categories => {
            let html = '<div>';
            html += '<h2 class="section-title">Каталог категорій</h2>';
            html += '<div class="row">';

            categories.forEach(category => {
                html += `
                    <div class="col-md-4">
                        <a href="#" class="category-card ${category.shortname}" onclick="loadCategory('${category.shortname}'); return false;">
                            <h3>${category.name}</h3>
                            <p>${category.notes}</p>
                        </a>
                    </div>
                `;
            });

            html += `
                <div class="col-12">
                    <a href="#" class="category-card special" onclick="loadSpecial(); return false;">
                        <h3>Specials</h3>
                        <p>Випадкова категорія - сюрприз для вас! Натисніть, щоб дізнатися, що вас чекає сьогодні.</p>
                    </a>
                </div>
            `;

            html += '</div></div>';

            
            content.innerHTML = html;
        })
        .catch(error => {
            content.innerHTML = `
                <div class="alert alert-danger">
                    Помилка: ${error.message}
                </div>
            `;
        });
}


function loadSpecial() {
    fetch('data/categories.json')
        .then(response => response.json())
        .then(categories => {
            const randomIndex = Math.floor(Math.random() * categories.length);
            const randomCategory = categories[randomIndex];

            loadCategory(randomCategory.shortname);
        })
        .catch(error => {
            console.error('Помилка:', error);
        });
}

function loadCategory(categoryShortname) {
    const content = document.getElementById('content');

    content.innerHTML = '<div class="loading"><i class="fas fa-spinner"></i><p>Завантаження товарів...</p></div>';

    fetch(`data/${categoryShortname}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Помилка завантаження товарів');
            }
            return response.json();
        })
        .then(data => {
            let html = '<div>';
            html += '<button class="back-btn" onclick="loadCatalog()">Назад до каталогу</button>';
            html += `<h2 class="section-title">${data.categoryName}</h2>`;
            html += '<div class="row">';

            data.items.forEach(item => {
                html += `
                    <div class="col-md-6 col-lg-3">
                        <div class="item-card">
                            <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/250x250/cccccc/666666?text=${encodeURIComponent(item.name)}'">
                            <div class="item-card-body">
                                <h4>${item.name}</h4>
                                <p>${item.description}</p>
                                <div class="item-price">
                                    ${item.price}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });

            html += '</div></div>';

            
            content.innerHTML = html;
        })
        .catch(error => {
            content.innerHTML = `
                <div class="alert alert-danger">
                    Помилка: ${error.message}
                </div>
                <button class="back-btn" onclick="loadCatalog()">Назад до каталогу</button>
            `;
        });
}

window.addEventListener('DOMContentLoaded', () => {
    loadHome();
});
