<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FlorerIa - Ramos a Domicilio</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
</head>
<body class="bg-gray-50 text-gray-800">

    <div id="parallax-bg" class="bg-layer"></div>

    <div class="container mx-auto p-4 sm:p-6 md:p-8 max-w-2xl relative z-10">
        <header class="text-center mb-8 reveal-header">
            <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dynamic-text">FlorerIA a domicilio</h1>
             <h5 class=" font-bold text-gray-900 dynamic-text">Entregas en Metepec y Toluca</h5>
            <p class="text-md text-gray-600 mt-2">Describe el ramo, la emoción o el estilo que quieras, y crearemos uno a la medida con nuestras flores disponibles.</p>
        </header>

        <main>
            <div class="glass-panel p-6 rounded-3xl shadow-2xl mb-8 reveal-item">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Creador de Ramos</h2>
                <div class="mb-4">
                    <label for="apiKey" class="block text-sm font-medium text-gray-700 mb-1">Clave de API de Google AI</label>
                    <input type="password" id="apiKey" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500" placeholder="Introduce tu clave de API de Google AI">
                    <p class="text-xs text-gray-500 mt-1">Puedes conseguir una clave de API gratuita en <a href="https://aistudio.google.com/app/apikey" target="_blank" class="text-rose-600 hover:underline">Google AI Studio</a>.</p>
                </div>
                <div class="mb-4">
                    <label for="userInput" class="block text-sm font-medium text-gray-700 mb-1">Descripción del Bouquet</label>
                    <textarea id="userInput" rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500" placeholder="Ej: Un ramo romántico de rosas rojas, paniculata y unos chocolates."></textarea>
                </div>
                <button id="generateBtn" class="w-full bg-rose-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:bg-rose-300 transition-colors">
                    Generar Ramo
                </button>
            </div>

            <div id="result" class="mt-8 text-center reveal-item">
                <div id="loader" class="hidden mx-auto loader"></div>
                <div id="message" class="text-gray-600"></div>
                <img id="bouquetImage" class="hidden mx-auto rounded-3xl shadow-lg mt-4 max-w-full h-auto transition-opacity duration-500" alt="Bouquet de Flores Generado">
            </div>

            <div class="mt-12 text-center reveal-section">
                <h2 class="text-2xl font-bold text-gray-900 mb-4 dynamic-text">Nuestros Productos</h2>
                <p class="text-md text-gray-600 mb-8">Explora nuestra selección de bouquets o pidele a nuestra IA que te inspire.</p>
                <div id="products-container" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                    </div>
            </div>
        </main>

        <footer class="text-center mt-8 text-sm text-gray-500 relative z-10">
            <p>Amor con amor se paga.</p>
        </footer>
    </div>

    <template id="product-template">
        <div class="product-card glass-panel rounded-3xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl flex flex-col reveal-item">
            <img class="w-full h-48 object-cover" src="" alt="">
            <div class="p-4 flex-grow flex flex-col">
                <h3 class="font-semibold text-lg text-gray-900 mb-1 dynamic-text"></h3>
                <p class="text-sm text-gray-600 mb-3 flex-grow"></p>
                <div class="mt-auto">
                    <span class="text-lg font-bold text-rose-600"></span>
                    <a href="#" class="block w-full text-center bg-rose-500 text-white font-semibold py-2 px-4 mt-3 rounded-lg hover:bg-rose-600 transition-colors">Pedir por WhatsApp</a>
                </div>
            </div>
        </div>
    </template>
    
    <script src="script.js"></script>
</body>
</html>