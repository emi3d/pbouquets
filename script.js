const generateBtn = document.getElementById('generateBtn');
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

generateBtn.addEventListener('click', generateBouquet);

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

async function generateBouquet() {
    const userPrompt = userInput.value.trim();
    const apiKey = apiKeyInput.value.trim();

    if (!apiKey) {
        displayMessage('Por favor, introduce tu clave de API.');
        return;
    }

    if (!userPrompt) {
        displayMessage('Por favor, describe el bouquet que deseas.');
        return;
    }

    setLoading(true);
    displayMessage('');
    bouquetImage.classList.add('hidden');

    try {
        const stock = await fetchStock();
        const enhancedPrompt = await enhancePrompt(apiKey, userPrompt, stock);

        if (enhancedPrompt) {
            const imageUrl = await generateImage(apiKey, enhancedPrompt);
            if (imageUrl) {
                bouquetImage.src = imageUrl;
                bouquetImage.classList.remove('hidden');
                displayMessage('¡Aquí tienes tu bouquet personalizado! Haz clic en la imagen para solicitarlo por WhatsApp.');
                bouquetImage.onclick = () => {
                    const whatsappText = `¡Hola! Me gustaría pedir este bouquet personalizado. La descripción fue: "${userPrompt}".`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(whatsappText)}`, '_blank');
                };
            } else {
                displayMessage('Lo siento, no pude generar una imagen. Por favor, inténtalo de nuevo.');
            }
        } else {
            displayMessage('Lo siento, no pude entender tu solicitud. Por favor, reformúlala.');
        }

    } catch (error) {
        console.error('Error:', error);
        displayMessage('Ocurrió un error. Revisa la consola para más detalles.');
    } finally {
        setLoading(false);
    }
}

function setLoading(isLoading) {
    if (isLoading) {
        loader.classList.remove('hidden');
        generateBtn.disabled = true;
        generateBtn.textContent = 'Generando...';
    } else {
        loader.classList.add('hidden');
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generar Bouquet';
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

async function enhancePrompt(apiKey, userPrompt, stock) {
    const textApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const fullPrompt = `
        Based on the user's request and the available stock, create a detailed, visually rich prompt for an image generation AI.
        The final image should be a beautiful, realistic photo of a flower bouquet. (User speaks spanish but create the prompt in english)

        User Request: "${userPrompt}"

        Available Stock:
        ${stock}

        Instructions:
        1.  Strictly use only items from the "Available Stock". If the user asks for something not in stock, politely substitute it with the closest available item and mention it in the description.
        2.  Create a descriptive prompt that includes details about the arrangement, colors, lighting, and background.
        3.  The output should be just the prompt for the image generator, nothing else.

        Example Output:
        "A stunning, photorealistic image of a lush flower bouquet. It features vibrant red roses and delicate white baby's breath, artfully arranged with fresh eucalyptus leaves. A few gourmet chocolates are nestled among the flowers. The bouquet is wrapped in simple brown paper and tied with a red silk ribbon. The lighting is soft and natural, highlighting the textures of the petals. The background is a clean, light gray."
    `;

    const payload = {
        contents: [{
            parts: [{
                text: fullPrompt
            }]
        }]
    };

    try {
        const response = await fetch(textApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorBody.error.message}`);
        }

        const result = await response.json();
        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            return result.candidates[0].content.parts[0].text;
        } else {
            console.error("Unexpected API response structure:", result);
            return null;
        }
    } catch (error) {
        console.error('Error enhancing prompt:', error);
        displayMessage(`Failed to enhance prompt: ${error.message}`);
        return null;
    }
}

async function generateImage(apiKey, prompt) {
    const imageApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{
            parts: [{ text: prompt }]
        }],
        generationConfig: {
            responseModalities: ['IMAGE', 'TEXT']
        },
    };

    try {
        const response = await fetch(imageApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

         if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorBody.error.message}`);
        }

        const result = await response.json();
        const base64Data = result?.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;

        if (base64Data) {
            return `data:image/png;base64,${base64Data}`;
        } else {
            console.error("Unexpected API response structure or no image data:", result);
            displayMessage('The model did not return an image. It might have responded with text instead. Check the console.');
            console.log("Model's text response:", result?.candidates?.[0]?.content?.parts?.[0]?.text);
            return null;
        }
    } catch (error) {
        console.error('Error generating image:', error);
        displayMessage(`Failed to generate image: ${error.message}`);
        return null;
    }
}