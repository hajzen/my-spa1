let pageUrls = {  
    about: '/index.html?about',  
    contact: '/index.html?contact',
    gallery: '/index.html?gallery'  
}; 

function OnStartUp() {      
    popStateHandler();  
} 

OnStartUp(); 

// Obsługa linków
document.querySelector('#about-link').addEventListener('click', () => {  
    updatePage('about', RenderAboutPage);  
}); 

document.querySelector('#contact-link').addEventListener('click', () => {  
    updatePage('contact', RenderContactPage);  
});

document.querySelector('#gallery-link').addEventListener('click', () => {  
    updatePage('gallery', RenderGalleryPage);  
});

function updatePage(page, renderFunction) {
    let stateObj = { page };  
    document.title = page.charAt(0).toUpperCase() + page.slice(1);  
    history.pushState(stateObj, page, `?${page}`);  
    renderFunction();  
}

// Renderowanie stron
function RenderAboutPage() {  
    document.querySelector('main').innerHTML = 
        `<h1 class="title">About Me</h1>
<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</p>`;
}

function RenderContactPage() {  
    document.querySelector('main').innerHTML = 
        `<h1 class="title">Contact with me</h1>
<form id="contact-form"> 
<label for="name">Name:</label> 
<input type="text" id="name" name="name" required> 
<label for="email">Email:</label> 
<input type="email" id="email" name="email" required> 
<label for="message">Message:</label> 
<textarea id="message" name="message" required></textarea> 
<div id="captcha-container">
<label for="captcha">Please solve: <span id="captcha-question"></span></label>
<input type="text" id="captcha" name="captcha" required>
</div>
<button type="submit">Send</button> 
</form>
<div id="form-error" style="color: red; display: none;">Please fill out all fields correctly.</div>`; 

    const form = document.getElementById('contact-form');
    const errorDiv = document.getElementById('form-error');
    const captchaQuestion = document.getElementById('captcha-question');
    const captchaInput = document.getElementById('captcha');

    let captchaAnswer;

    function generateCaptcha() {
        const num1 = Math.floor(Math.random() * 10);
        const num2 = Math.floor(Math.random() * 10);
        captchaAnswer = (num1 + num2).toString();
        captchaQuestion.textContent = `${num1} + ${num2} = ?`;
    }

    generateCaptcha();

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        const captchaValue = captchaInput.value.trim();

        if (!name || !email || !message || captchaValue !== captchaAnswer) {
            errorDiv.style.display = 'block';
        } else {
            errorDiv.style.display = 'none';
            alert('Form submitted successfully!');
            form.reset();
            generateCaptcha();
        }
    });
}

function RenderGalleryPage() {
    document.querySelector('main').innerHTML = 
        `<h1 class="title">Gallery</h1>
<div id="gallery" class="gallery"></div>
<div id="loading" class="loading">Loading...</div>
<div class="modal" id="image-modal">
<span class="modal-close" id="modal-close">&times;</span>
<img class="modal-content" id="modal-image" />
</div>`;

    const gallery = document.getElementById('gallery');
    const loading = document.getElementById('loading');
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const modalClose = document.getElementById('modal-close');

    let imageCount = 9; // Liczba obrazów w początkowej galerii
    let isLoading = false;

    function loadImages() {
        if (isLoading) return; // Zapobiegaj wielokrotnemu ładowaniu
        isLoading = true;
        loading.style.display = 'block';

        setTimeout(() => {
            for (let i = 0; i < 9; i++) {
                const img = document.createElement('img');
                img.setAttribute('data-src', `https://picsum.photos/300/300?random=${imageCount + i}`);
                img.classList.add('lazy');
                img.addEventListener('click', (e) => {
                    modal.style.display = 'flex';
                    modalImage.src = e.target.src;
                });
                gallery.appendChild(img);
            }
            imageCount += 9;
            isLoading = false;
            loading.style.display = 'none';

            lazyLoadImages(); // Ponowne uruchomienie lazy loading
        }, 1000); // Symulacja opóźnienia ładowania
    }

    // Lazy loading obrazów
    function lazyLoadImages() {
        const lazyImages = document.querySelectorAll('.lazy');
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => {
            observer.observe(img);
        });
    }

    // Obsługa zamykania modala
    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Obserwator dla przewijania
    const scrollObserver = new IntersectionObserver((entries) => {
        const lastEntry = entries[0];
        if (lastEntry.isIntersecting) {
            loadImages();
        }
    }, { threshold: 1.0 });

    scrollObserver.observe(loading);

    // Ładowanie początkowych obrazów
    loadImages();
}
// Obsługa historii
function popStateHandler() {  
    let loc = window.location.href.toString().split(window.location.host)[1];  
    if (loc === pageUrls.contact) RenderContactPage(); 
    if (loc === pageUrls.about) RenderAboutPage(); 
    if (loc === pageUrls.gallery) RenderGalleryPage(); 
} 

window.onpopstate = popStateHandler;  
document.getElementById('theme-toggle').addEventListener('click', () => { 
    document.body.classList.toggle('dark-mode'); 
});

modalImage.style.transform = 'scale(3.0)'; // Powiększ obraz
modalImage.style.transition = 'transform 0.3s ease-in-out'; // Dodaj płynne przejście
