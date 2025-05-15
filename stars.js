// Función para crear estrellas
function createStars() {
    const starsContainer = document.getElementById('stars');
    const numberOfStars = 100;

    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Posición aleatoria
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        // Tamaño aleatorio
        const size = Math.random() * 3;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Duración de la animación aleatoria
        const duration = 1 + Math.random() * 3;
        star.style.setProperty('--duration', `${duration}s`);
        
        // Retraso aleatorio
        star.style.animationDelay = `${Math.random() * 3}s`;
        
        starsContainer.appendChild(star);
    }
}

// Crear estrellas cuando se carga la página
document.addEventListener('DOMContentLoaded', createStars); 