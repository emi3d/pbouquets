const userInput = document.getElementById('userInput');
const apiKeyInput = document.getElementById('apiKey');
const loader = document.getElementById('loader');
const message = document.getElementById('message');
const bouquetImage = document.getElementById('bouquetImage');
const productsContainer = document.getElementById('products-container');
const productTemplate = document.getElementById('product-template');
const parallaxBg = document.getElementById('parallax-bg');

document.addEventListener('DOMContentLoaded', () => {
    
    loadProducts().then(() => {
        
        setupIntersectionObserver();
    });
});


window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    parallaxBg.style.transform = `translateY(${scrollPosition * 0.2}px)`;
});


const dynamicTexts = document.querySelectorAll('.dynamic-text');
window.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const fontVariation = 400 + (mouseX * 500); 
    
    dynamicTexts.forEach(textElement => {
        textElement.style.fontVariationSettings = `'wght' ${fontVariation}`;
    });
});


function setupIntersectionObserver() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealItems = document.querySelectorAll('.reveal-item, .reveal-header, .reveal-section, .product-card');
    revealItems.forEach(item => {
        observer.observe(item);
    });
}


async function loadProducts() {
    try {
        const response = await fetch('products.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const products = await response.json();
        
        products.forEach(product => {
            const productCard = productTemplate.content.cloneNode(true);
            
            const img = productCard.querySelector('img');
            img.src = product.image;
            img.alt = product.name;
            
            const h3 = productCard.querySelector('h3');
            h3.textContent = product.name;
            
            const p = productCard.querySelector('p');
            p.textContent = product.description;
            
            const priceSpan = productCard.querySelector('span');
            if (product.price) {
                priceSpan.textContent = `$${product.price.toFixed(2)} mxn`;
            } else {
                priceSpan.textContent = 'Precio personalizado';
            }
            
            const whatsappBtn = productCard.querySelector('a');
            const whatsappText = `Hola, me interesa el bouquet "${product.name}".`;
            whatsappBtn.href = `https://wa.me/527222402775?text=${encodeURIComponent(whatsappText)}`;
            productsContainer.appendChild(productCard);
        });
        
    } catch (error) {
        console.error("Failed to load products:", error);
    }
}





function displayMessage(msg) {
    message.textContent = msg;
}

async function fetchStock() {
    try {
        const response = await fetch('stock.txt');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.text();
    } catch (e) {
        console.error("Could not fetch stock file.", e);
        displayMessage("Ha ocurrido un error interno");
        return "roses, tulips, lilies, baby's breath, eucalyptus, assorted chocolates, colorful ribbons";
    }
}

// Image Modal/Lightbox functionality
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const closeModal = document.getElementById('closeModal');

// Function to open modal with clicked image
function openModal(imageSrc, altText) {
    modalImage.src = imageSrc;
    modalImage.alt = altText;
    imageModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

// Function to close modal
function closeImageModal() {
    imageModal.classList.remove('active');
    document.body.style.overflow = ''; // Re-enable scrolling
}

// Close modal when clicking the X button
closeModal.addEventListener('click', closeImageModal);

// Close modal when clicking outside the image
imageModal.addEventListener('click', function(e) {
    if (e.target === imageModal) {
        closeImageModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && imageModal.classList.contains('active')) {
        closeImageModal();
    }
});

// Update the product creation to add click events to images
// Modify the loadProducts function in your existing code
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const products = await response.json();
        
        products.forEach(product => {
            const productCard = productTemplate.content.cloneNode(true);
            
            const img = productCard.querySelector('img');
            img.src = product.image;
            img.alt = product.name;
            
            // Add click event to open modal
            img.addEventListener('click', function() {
                openModal(product.image, product.name);
            });
            
            const h3 = productCard.querySelector('h3');
            h3.textContent = product.name;
            
            const p = productCard.querySelector('p');
            p.textContent = product.description;
            
            const priceSpan = productCard.querySelector('span');
            if (product.price) {
                priceSpan.textContent = `$${product.price.toFixed(2)} mxn`;
            } else {
                priceSpan.textContent = 'Precio personalizado';
            }
            
            const whatsappBtn = productCard.querySelector('a');
            const whatsappText = `Hola, me interesa el bouquet "${product.name}".`;
            whatsappBtn.href = `https://wa.me/527222402775?text=${encodeURIComponent(whatsappText)}`;
            productsContainer.appendChild(productCard);
        });
        
    } catch (error) {
        console.error("Failed to load products:", error);
    }
}