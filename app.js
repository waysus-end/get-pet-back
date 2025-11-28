class PetApp {
    constructor() {
        this.token = localStorage.getItem('authToken');
        this.currentUser = null;
        this.mockData = this.createMockData();
        this.sliderInterval = null;
        this.currentSlide = 0;
        this.init();
    }

    createMockData() {
        return {
            users: [
                {
                    id: 1,
                    name: "Иван Иванов",
                    phone: "+79111234567",
                    email: "user@user.ru",
                    password: "paSSword1",
                    registrationDate: "2025-01-15",
                    ordersCount: 3,
                    petsCount: 1
                }
            ],
            pets: [
                {
                    id: 1,
                    name: "Иван Иванов",
                    phone: "+79111234567",
                    email: "user@user.ru",
                    kind: "кошка",
                    petName: "Мурка",
                    photos: ['https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/GreekSphynxCat1.png/1280px-GreekSphynxCat1.png'],
                    description: "Найдена маленькая кошечка породы сфинкс, очень грустная. Откликается на кличку Мурка",
                    mark: "VL-0214",
                    district: "Василеостровский",
                    date: "2025-06-20",
                    status: "active",
                    userId: 1
                },
                {
                    id: 2,
                    name: "Мария Петрова",
                    phone: "+79119876543",
                    email: "maria@mail.ru",
                    kind: "собака",
                    petName: "Барсик",
                    photos: ['https://zoopt.ru/upload/webp/resize_cache/773/1148_560_1/f85f1c4e22de5231c962eafc898476a0.webp'],
                    description: "Найден веселый щенок породы лабрадор. Кличка - Барсик, отзывается на имя",
                    mark: "SP-1234",
                    district: "Центральный",
                    date: "2025-08-19",
                    status: "active",
                    userId: 2
                },
                {
                    id: 3,
                    name: "Алексей Сидоров",
                    phone: "+79115556677",
                    email: "alex@mail.ru",
                    kind: "кошка",
                    petName: "Васька",
                    photos: ['https://koshka.top/uploads/posts/2021-12/thumbs/1638773095_1-koshka-top-p-zelenoglazii-kotenok-1.jpg'],
                    description: "Найден пушистый котенок с зелеными глазами. Зовут Васька, очень ласковый",
                    mark: "",
                    district: "Приморский",
                    date: "2025-10-18",
                    status: "active",
                    userId: 3
                },
                {
                    id: 4,
                    name: "Елена Козлова",
                    phone: "+79113334455",
                    email: "elena@mail.ru",
                    kind: "собака",
                    petName: "Шарик",
                    photos: ['https://shop.purina.ru/media/wysiwyg/__nestlecontenthub_1_1_3_.webp'],
                    description: "Найдена собака породы хаски. Кличка Шарик, знает базовые команды",
                    mark: "HK-5678",
                    district: "Петроградский",
                    date: "2025-11-17",
                    status: "active",
                    userId: 4
                },
                {
                    id: 5,
                    name: "Дмитрий Волков",
                    phone: "+79116667788",
                    email: "dmitry@mail.ru",
                    kind: "кошка",
                    petName: "Соня",
                    photos: ['https://biopet.az/resized/fit1220x550/center/pages/770/fars-pisiyi-1198x540px.jpg'],
                    description: "Найдена спокойная кошка. Кличка Соня, возраст около 2 лет",
                    mark: "",
                    district: "Адмиралтейский",
                    date: "2025-09-16",
                    status: "active",
                    userId: 5
                },
                {
                    id: 6,
                    name: "Анна Смирнова",
                    phone: "+79118889900",
                    email: "anna@mail.ru",
                    kind: "птица",
                    petName: "Кеша",
                    photos: ['https://hi-news.ru/wp-content/uploads/2025/05/parrot_voice_1-750x500.jpg'],
                    description: "Найден говорящий попугай. Кличка Кеша, умеет повторять слова",
                    mark: "",
                    district: "Василеостровский",
                    date: "2025-10-15",
                    status: "active",
                    userId: 6
                }
            ],
            subscriptions: []
        };
    }

    init() {
        this.checkAuth();
        this.setupEventListeners();
        this.loadInitialData();
    }

    checkAuth() {
        if (this.token) {
            const authLink = document.getElementById('auth-link');
            const profileLink = document.getElementById('profile-link');
            const logoutLink = document.getElementById('logout-link');
            
            if (authLink) authLink.style.display = 'none';
            if (profileLink) profileLink.style.display = 'block';
            if (logoutLink) logoutLink.style.display = 'block';
            
            this.loadUserProfile();
        }
    }

    setupEventListeners() {
        // Быстрый поиск
        const quickSearch = document.getElementById('quick-search');
        if (quickSearch) {
            let searchTimeout;
            quickSearch.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.handleQuickSearch(e.target.value);
                }, 1000);
            });
        }

        // Подписка на новости
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSubscription();
            });
        }

        // Форма входа
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Форма регистрации
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }

        // Форма добавления объявления
        const addPetForm = document.getElementById('add-pet-form');
        if (addPetForm) {
            addPetForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddPet();
            });
        }

        // Форма поиска
        const searchForm = document.getElementById('search-form');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSearch();
            });
        }

        // Формы профиля
        this.setupProfileForms();
    }

    loadInitialData() {
        this.loadSlider();
        this.loadRecentPets();
        
        if (window.location.pathname.includes('edit-pet.html')) {
            this.loadEditFormData();
        }
        
        if (window.location.pathname.includes('pet-card.html')) {
            this.loadPetData();
        }
        
        if (window.location.pathname.includes('profile.html')) {
            this.loadProfileData();
        }
    }

    loadProfileData() {
        if (!this.token) {
            window.location.href = 'login.html';
            return;
        }

        this.loadUserInfo();
        this.loadUserOrders();
    }

    loadUserInfo() {
        const userInfoDiv = document.getElementById('user-info');
        if (!userInfoDiv) return;

        const userId = localStorage.getItem('userId');
        const user = this.mockData.users.find(u => u.id == userId);
        
        if (user) {
            userInfoDiv.innerHTML = `
                <div class="user-card">
                    <p><strong>Имя:</strong> ${user.name}</p>
                    <p><strong>Телефон:</strong> ${user.phone}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Дата регистрации:</strong> ${this.formatDate(user.registrationDate)}</p>
                    <p><strong>Количество объявлений:</strong> ${user.ordersCount}</p>
                    <p><strong>Найдено питомцев:</strong> ${user.petsCount}</p>
                </div>
            `;
        } else {
            userInfoDiv.innerHTML = '<div class="error">Ошибка загрузки данных пользователя</div>';
        }
    }

    loadUserOrders() {
        const ordersDiv = document.getElementById('user-orders');
        if (!ordersDiv) return;

        const userId = localStorage.getItem('userId');
        const userPets = this.mockData.pets.filter(pet => pet.userId == userId);
        
        if (userPets.length === 0) {
            ordersDiv.innerHTML = '<div class="no-results">У вас пока нет объявлений</div>';
            return;
        }

        ordersDiv.innerHTML = userPets.map(pet => `
            <div class="order-card fade-in">
                <img src="${pet.photos[0]}" alt="${pet.kind} ${pet.petName}">
                <div class="order-card-content">
                    <h3>${pet.petName} - ${pet.kind}</h3>
                    <p class="description">${pet.description}</p>
                    <div class="pet-details">
                        <p><strong>Район:</strong> ${pet.district}</p>
                        <p><strong>Дата:</strong> ${this.formatDate(pet.date)}</p>
                        <p><strong>Статус:</strong> <span class="status-${pet.status}">${this.getStatusText(pet.status)}</span></p>
                    </div>
                    <div class="order-actions">
                        <a href="pet-card.html?id=${pet.id}" class="btn-primary">Просмотреть</a>
                        <a href="edit-pet.html?id=${pet.id}" class="btn-secondary">Редактировать</a>
                        <button onclick="app.deletePet(${pet.id})" class="btn-danger">Удалить</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    setupProfileForms() {
        const phoneForm = document.getElementById('phone-form');
        const emailForm = document.getElementById('email-form');

        if (phoneForm) {
            phoneForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handlePhoneChange();
            });
        }

        if (emailForm) {
            emailForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleEmailChange();
            });
        }
    }

    handlePhoneChange() {
        const newPhone = document.getElementById('new-phone').value;
        const messageDiv = document.getElementById('phone-message');

        if (!newPhone) {
            this.showMessage(messageDiv, 'Введите новый номер телефона', 'error');
            return;
        }

        const userId = localStorage.getItem('userId');
        const user = this.mockData.users.find(u => u.id == userId);
        
        if (user) {
            user.phone = newPhone;
            this.showMessage(messageDiv, 'Номер телефона успешно изменен!', 'success');
            document.getElementById('phone-form').reset();
            this.loadUserInfo();
        } else {
            this.showMessage(messageDiv, 'Ошибка изменения номера телефона', 'error');
        }
    }

    handleEmailChange() {
        const newEmail = document.getElementById('new-email').value;
        const messageDiv = document.getElementById('email-message');

        if (!this.validateEmail(newEmail)) {
            this.showMessage(messageDiv, 'Введите корректный email', 'error');
            return;
        }

        const userId = localStorage.getItem('userId');
        const user = this.mockData.users.find(u => u.id == userId);
        
        if (user) {
            user.email = newEmail;
            this.showMessage(messageDiv, 'Email успешно изменен!', 'success');
            document.getElementById('email-form').reset();
            this.loadUserInfo();
        } else {
            this.showMessage(messageDiv, 'Ошибка изменения email', 'error');
        }
    }

    getStatusText(status) {
        const statusMap = {
            'active': 'Активно',
            'wasFound': 'Найдено',
            'onModeration': 'На модерации',
            'archive': 'В архиве'
        };
        return statusMap[status] || status;
    }

    deletePet(petId) {
        if (!confirm('Вы уверены, что хотите удалить это объявление?')) {
            return;
        }

        const petIndex = this.mockData.pets.findIndex(pet => pet.id === petId);
        if (petIndex !== -1) {
            this.mockData.pets.splice(petIndex, 1);
            this.loadUserOrders();
            this.showMessage(document.getElementById('user-orders').parentNode, 'Объявление успешно удалено', 'success');
        }
    }

    loadSlider() {
        const slider = document.getElementById('slider');
        if (!slider) return;

        const sliderPets = this.mockData.pets
            .filter(pet => pet.status === 'active')
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3);
        
        console.log('Loading slider with pets:', sliderPets.length);
        
        if (sliderPets.length === 0) {
            slider.innerHTML = '<div class="slider-placeholder">Пока нет найденных животных</div>';
            return;
        }

        slider.innerHTML = `
            <div class="slider-container">
                ${sliderPets.map((pet, index) => `
                    <div class="slider-item ${index === 0 ? 'active' : ''}">
                        <img src="${pet.photos[0]}" alt="${pet.kind} ${pet.petName}">
                        <div class="slider-content">
                            <h3>${pet.petName} - ${pet.kind}</h3>
                            <p>${pet.description}</p>
                            <p><strong>Район:</strong> ${pet.district}</p>
                            <p><strong>Дата находки:</strong> ${this.formatDate(pet.date)}</p>
                            <a href="pet-card.html?id=${pet.id}" class="btn-primary">Подробнее</a>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        if (sliderPets.length > 1) {
            this.startSimpleSlider(sliderPets.length);
        }
    }

    startSimpleSlider(totalSlides) {
        if (this.sliderInterval) {
            clearInterval(this.sliderInterval);
        }

        this.sliderInterval = setInterval(() => {
            this.currentSlide = (this.currentSlide + 1) % totalSlides;
            this.showSlide(this.currentSlide);
        }, 5000);
    }

    showSlide(index) {
        const items = document.querySelectorAll('.slider-item');
        items.forEach(item => item.classList.remove('active'));
        if (items[index]) {
            items[index].classList.add('active');
        }
    }

    loadRecentPets() {
        const container = document.getElementById('recent-pets');
        if (!container) return;

        const recentPets = this.mockData.pets
            .filter(pet => pet.status === 'active')
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(3, 9);

        console.log('Loading recent pets:', recentPets.length);

        if (recentPets.length === 0) {
            container.innerHTML = '<div class="no-results">Пока нет активных объявлений</div>';
            return;
        }

        container.innerHTML = recentPets.map(pet => `
            <div class="pet-card fade-in">
                <img src="${pet.photos[0]}" alt="${pet.kind} ${pet.petName}">
                <div class="pet-card-content">
                    <h3>${pet.petName} - ${pet.kind}</h3>
                    <p class="description">${pet.description}</p>
                    <div class="pet-details">
                        <p><strong>Район:</strong> ${pet.district}</p>
                        <p><strong>Дата:</strong> ${this.formatDate(pet.date)}</p>
                        ${pet.mark ? `<p><strong>Клеймо:</strong> ${pet.mark}</p>` : ''}
                    </div>
                    <a href="pet-card.html?id=${pet.id}" class="btn-primary">Подробнее</a>
                </div>
            </div>
        `).join('');
    }

    handleQuickSearch(query) {
        const suggestions = document.getElementById('search-suggestions');
        if (!suggestions) return;

        if (query.length < 3) {
            suggestions.innerHTML = '';
            return;
        }

        const results = this.mockData.pets.filter(pet => 
            pet.description.toLowerCase().includes(query.toLowerCase()) ||
            pet.kind.toLowerCase().includes(query.toLowerCase()) ||
            pet.petName.toLowerCase().includes(query.toLowerCase())
        );

        this.renderSearchSuggestions(results);
    }

    renderSearchSuggestions(pets) {
        const suggestions = document.getElementById('search-suggestions');
        if (!pets || pets.length === 0) {
            suggestions.innerHTML = '<div class="suggestion-item">Нет результатов</div>';
            return;
        }

        suggestions.innerHTML = pets.slice(0, 5).map(pet => `
            <div class="suggestion-item" onclick="app.selectSuggestion(${pet.id})">
                ${pet.petName} - ${pet.kind}: ${pet.description.substring(0, 50)}...
            </div>
        `).join('');
    }

    selectSuggestion(petId) {
        window.location.href = `pet-card.html?id=${petId}`;
    }

    handleNewsletterSubscription() {
        const email = document.getElementById('newsletter-email').value;
        const messageDiv = document.getElementById('newsletter-message');

        if (!this.validateEmail(email)) {
            this.showMessage(messageDiv, 'Введите корректный email', 'error');
            return;
        }

        this.mockData.subscriptions.push(email);
        this.showMessage(messageDiv, 'Вы успешно подписались на новости!', 'success');
        document.getElementById('newsletter-form').reset();
    }

    handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const messageDiv = document.getElementById('message');

        const user = this.mockData.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.token = 'mock-token-' + Date.now();
            this.currentUser = user;
            localStorage.setItem('authToken', this.token);
            localStorage.setItem('userId', user.id);
            
            this.showMessage(messageDiv, 'Успешный вход!', 'success');
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 1000);
        } else {
            this.showMessage(messageDiv, 'Неверный email или пароль', 'error');
        }
    }

    handleRegister() {
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const phone = document.getElementById('register-phone').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        const messageDiv = document.getElementById('register-message');

        if (password !== confirmPassword) {
            this.showMessage(messageDiv, 'Пароли не совпадают', 'error');
            return;
        }

        if (this.mockData.users.find(u => u.email === email)) {
            this.showMessage(messageDiv, 'Пользователь с таким email уже существует', 'error');
            return;
        }

        const newUser = {
            id: Math.max(...this.mockData.users.map(u => u.id)) + 1,
            name: name,
            phone: phone,
            email: email,
            password: password,
            registrationDate: new Date().toISOString().split('T')[0],
            ordersCount: 0,
            petsCount: 0
        };

        this.mockData.users.push(newUser);
        this.showMessage(messageDiv, 'Регистрация успешна! Теперь вы можете войти.', 'success');
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    }

    handleAddPet() {
        const formData = new FormData(document.getElementById('add-pet-form'));
        const messageDiv = document.getElementById('add-pet-message');

        const newPet = {
            id: Math.max(...this.mockData.pets.map(p => p.id)) + 1,
            name: this.currentUser.name,
            phone: this.currentUser.phone,
            email: this.currentUser.email,
            kind: formData.get('kind'),
            petName: formData.get('petName'),
            description: formData.get('description'),
            mark: formData.get('mark') || '',
            district: formData.get('district'),
            date: formData.get('date'),
            status: 'active',
            userId: this.currentUser.id,
            photos: ['https://via.placeholder.com/400x300?text=Фото+питомца']
        };

        this.mockData.pets.push(newPet);
        this.showMessage(messageDiv, 'Объявление успешно добавлено!', 'success');
        
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 2000);
    }

    handleSearch() {
        const formData = new FormData(document.getElementById('search-form'));
        const kind = formData.get('kind');
        const district = formData.get('district');
        const date = formData.get('date');

        let results = this.mockData.pets.filter(pet => pet.status === 'active');

        if (kind && kind !== 'all') {
            results = results.filter(pet => pet.kind === kind);
        }

        if (district && district !== 'all') {
            results = results.filter(pet => pet.district === district);
        }

        if (date) {
            results = results.filter(pet => pet.date === date);
        }

        this.displaySearchResults(results);
    }

    displaySearchResults(results) {
        const resultsDiv = document.getElementById('search-results');
        if (!resultsDiv) return;

        if (results.length === 0) {
            resultsDiv.innerHTML = '<div class="no-results">По вашему запросу ничего не найдено</div>';
            return;
        }

        resultsDiv.innerHTML = results.map(pet => `
            <div class="pet-card fade-in">
                <img src="${pet.photos[0]}" alt="${pet.kind} ${pet.petName}">
                <div class="pet-card-content">
                    <h3>${pet.petName} - ${pet.kind}</h3>
                    <p class="description">${pet.description}</p>
                    <div class="pet-details">
                        <p><strong>Район:</strong> ${pet.district}</p>
                        <p><strong>Дата:</strong> ${this.formatDate(pet.date)}</p>
                        ${pet.mark ? `<p><strong>Клеймо:</strong> ${pet.mark}</p>` : ''}
                    </div>
                    <a href="pet-card.html?id=${pet.id}" class="btn-primary">Подробнее</a>
                </div>
            </div>
        `).join('');
    }

    formatDate(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('ru-RU');
        } catch (e) {
            return dateString;
        }
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    showMessage(element, message, type) {
        if (!element) return;
        
        element.innerHTML = `<div class="message ${type}">${message}</div>`;
        
        setTimeout(() => {
            element.innerHTML = '';
        }, 5000);
    }

    loadUserProfile() {
        if (!this.token) return;

        const userId = localStorage.getItem('userId');
        const user = this.mockData.users.find(u => u.id == userId);
        if (user) {
            this.currentUser = user;
        }
    }

    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        this.token = null;
        this.currentUser = null;
        if (this.sliderInterval) {
            clearInterval(this.sliderInterval);
        }
        window.location.href = 'index.html';
    }
}

const app = new PetApp();
window.app = app;
window.logout = function() {
    app.logout();
};