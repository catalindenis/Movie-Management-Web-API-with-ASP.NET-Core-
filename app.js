const apiMovies = '/api/movies';
const apiAuth = '/api/auth';

let savedAccounts = JSON.parse(localStorage.getItem('savedAccounts')) || [];


async function register() {
    const u = document.getElementById('username-input').value.trim();
    const p = document.getElementById('password-input').value.trim();
    if (!u || !p) return alert("Introdu user și parola!");

    const res = await fetch(`${apiAuth}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: u, password: p })
    });

    if (res.ok) {
        alert("Cont creat cu succes! Acum dă click pe Log In.");
    } else {
        alert("Eroare. Posibil ca acest username să existe deja.");
    }
}

async function login(providedUser = null) {
    let u, p;
    if (providedUser) {
        u = providedUser.username;
        p = providedUser.password;
    } else {
        u = document.getElementById('username-input').value.trim();
        p = document.getElementById('password-input').value.trim();
    }

    if (!u || !p) return;

    const res = await fetch(`${apiAuth}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: u, password: p })
    });

    if (res.ok) {
        const userData = await res.json();
        localStorage.setItem('currentUser', JSON.stringify({ ...userData, password: p }));

        if (!savedAccounts.find(a => a.username === u)) {
            savedAccounts.push({ id: userData.id, username: u, password: p });
            localStorage.setItem('savedAccounts', JSON.stringify(savedAccounts));
        }
        checkAuth();
    } else {
        alert("Date incorecte!");
    }
}

function renderAccountSwitcher() {
    const container = document.getElementById('saved-accounts');
    container.innerHTML = savedAccounts.length > 0 ? '<p style="color:gray; font-size: 14px; margin-top:20px;">Conturi recente:</p>' : '';

    savedAccounts.forEach(acc => {
        const chip = document.createElement('div');
        chip.className = 'account-chip';
        chip.textContent = acc.username;
        chip.onclick = () => login(acc);
        container.appendChild(chip);
    });
}

function logout() {
    localStorage.removeItem('currentUser');
    checkAuth();
}

function checkAuth() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('movies-section').style.display = 'block';
        document.getElementById('current-user-display').textContent = `Cont curent: ${user.username}`;
        refresh();
    } else {
        document.getElementById('auth-section').style.display = 'block';
        document.getElementById('movies-section').style.display = 'none';
        renderAccountSwitcher();
    }
}

async function fetchMovies() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) return [];
    const res = await fetch(`${apiMovies}?userId=${user.id}`);
    return res.ok ? res.json() : [];
}

async function createMovie(title, genre, year, rating) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const res = await fetch(`${apiMovies}?userId=${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, genre, year, rating })
    });
    if (!res.ok) throw new Error('Eroare la salvare.');
}

async function removeMovie(id) {
    if (!confirm('Ești sigur că vrei să ștergi acest film?')) return;

    
    console.log("Încerc să șterg filmul cu ID-ul:", id);
    console.log("URL-ul generat este:", `${apiMovies}/${id}`);

    try {
        

        const res = await fetch(`${apiMovies}/${id}`, {
            method: 'DELETE',
            
        });

       
        if (!res.ok) {
            const detaliiEroare = await res.text();
            throw new Error(`Eroare de la server (Status: ${res.status}): ${detaliiEroare}`);
        }

        console.log("Ștergere reușită cu status:", res.status);
        await refresh(); // Reîncarcă lista

    } catch (err) {
        console.error(err);
        alert(err.message); 
    }
}

function renderMovies(movies) {
    const ul = document.getElementById('movies-list');
    ul.innerHTML = '';
    movies.forEach(m => {
        const card = document.createElement('div');
        card.className = 'movie-card';

        const poster = (m.posterUrl && m.posterUrl !== 'N/A') ? m.posterUrl : 'https://via.placeholder.com/300x450/1e293b/94a3b8?text=Fara+Poster';

        card.innerHTML = `
            <img src="${poster}" alt="${m.title}">
            <div class="movie-content">
                <div class="movie-title">${m.title}</div>
                <div class="movie-meta">
                    ${m.genre} • ${m.year}
                </div>
                <p class="movie-plot">${m.plot || 'Fără descriere disponibilă.'}</p>
                <div class="movie-meta" style="margin-top: 10px;">
                    ⭐ Nota ta: ${m.rating} | 🎬 IMDB: ${m.imdbRating || 'N/A'}
                </div>
            </div>
            <button class="delete-btn" onclick="removeMovie(${m.id})">Șterge</button>
        `;
        ul.appendChild(card);
    });
}

async function refresh() {
    const movies = await fetchMovies();
    renderMovies(movies);
}


window.addEventListener('DOMContentLoaded', () => {
    checkAuth();

    const form = document.getElementById('new-movie-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const title = document.getElementById('title-input').value.trim();
            const genre = document.getElementById('genre-input').value.trim();
            const year = parseInt(document.getElementById('year-input').value);
            const rating = parseFloat(document.getElementById('rating-input').value);

            if (!title || !genre) return;

            try {
                await createMovie(title, genre, year, rating);
                form.reset();
                await refresh();
            } catch (err) {
                alert(err);
            }
        });
    }
});