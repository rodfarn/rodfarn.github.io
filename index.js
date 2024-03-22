class PersonajeManager {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.renderDiv = document.getElementById('render');
        this.buscadorInput = document.getElementById('buscador');
        this.modalContentDiv = document.getElementById('modal-content');
        this.modalDiv = document.getElementById('modal');
        this.closeBtn = document.getElementById('close-btn');

        this.buscadorInput.addEventListener('input', async () => {
            await this.actualizarRender();
        });

        this.closeBtn.addEventListener('click', () => {
            this.cerrarModal();
        });

        // Llamada inicial para mostrar todas las tarjetas
        this.actualizarRender();
    }

    async buscarPersonaje(nombre) {
        if (nombre === '') {
            // Si el nombre está vacío, devolvemos todos los personajes
            let respuestaApi = await fetch(this.baseUrl);
            return await respuestaApi.json();
        } else {
            // Si hay un nombre de búsqueda, filtramos por firstName y lastName
            let respuestaApi = await fetch(`${this.baseUrl}?name=${nombre}`);
            let personajes = await respuestaApi.json();
            return personajes.filter(personaje =>
                personaje.firstName.toLowerCase().includes(nombre.toLowerCase()) ||
                personaje.lastName.toLowerCase().includes(nombre.toLowerCase())
            );
        }
    }

    async actualizarRender() {
        let textoBusqueda = this.buscadorInput.value.trim();
        let personajes = await this.buscarPersonaje(textoBusqueda);

        this.renderDiv.innerHTML = ''; // Limpiar contenido anterior
        if (personajes.length > 0) {
            personajes.forEach(personaje => {
                this.crearCarta(personaje);
            });
            this.renderDiv.style.display = 'flex'; // Mostrar el div si hay resultados
        } else {
            this.renderDiv.style.display = 'none'; // Ocultar el div si no hay resultados
        }
    }

    crearCarta(personaje) {
        let article = document.createElement('article');
        article.classList.add('carta');
        article.innerHTML = `
        <img src="${personaje.imageUrl}" alt="${personaje.fullName}">
        <h3>${personaje.fullName}</h3>
        <ul>
          <li>Title: ${personaje.title}</li>
          <li>Family: ${personaje.family}</li>
        </ul>
        `;
        article.addEventListener('click', () => this.mostrarModal(personaje));
        this.renderDiv.appendChild(article);
    }

    async mostrarModal(personaje) {
        let modalContent = `
        <img src="${personaje.imageUrl}" alt="${personaje.fullName}">
        <h2>${personaje.fullName}</h2>
        <p>Title: ${personaje.title}</p>
        <p>Family: ${personaje.family}</p>
        `;
        this.modalContentDiv.innerHTML = modalContent;
        this.modalDiv.style.display = 'block';
    }

    cerrarModal() {
        this.modalDiv.style.display = 'none';
    }
}

const baseUrl = 'https://thronesapi.com/api/v2/Characters';
const personajeManager = new PersonajeManager(baseUrl);

