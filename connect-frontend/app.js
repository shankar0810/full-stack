document.addEventListener('DOMContentLoaded', () => {
    fetchBooks();

    document.getElementById('add-book-form').addEventListener('submit', addBook);
    document.getElementById('update-book-form').addEventListener('submit', updateBook);
});

function fetchBooks() {
    fetch('http://localhost:3666/api/books/getallbooks')
        .then(response => response.json())
        .then(data => {
            const bookList = document.getElementById('book-list');
            bookList.innerHTML = '';
            data.forEach(book => {
                const bookItem = document.createElement('div');
                bookItem.innerHTML = `
                    <p>${book.title} by ${book.author} (ISBN: ${book.isbn})</p>
                    <button onclick="deleteBook(${book.id})">Delete</button>
                    <button onclick="showUpdateForm(${book.id}, '${book.title}', '${book.author}', '${book.isbn}')">Update</button>
                `;
                bookList.appendChild(bookItem);
            });
        })
        .catch(error => console.error('Error fetching books:', error));
}

function addBook(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const book = {
        title: formData.get('title'),
        author: formData.get('author'),
        isbn: formData.get('isbn')
    };

    fetch('http://localhost:3666/api/books/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(book)
    })
    .then(response => response.json())
    .then(() => {
        event.target.reset();
        fetchBooks();
    })
    .catch(error => console.error('Error adding book:', error));
}

function deleteBook(id) {
    fetch(`http://localhost:3666/api/books/delete/${id}`, {
        method: 'DELETE'
    })
    .then(() => {
        fetchBooks();
    })
    .catch(error => console.error('Error deleting book:', error));
}

function showUpdateForm(id, title, author, isbn) {
    document.getElementById('update-book-section').style.display = 'block';
    document.getElementById('update-book-id').value = id;
    document.getElementById('update-title').value = title;
    document.getElementById('update-author').value = author;
    document.getElementById('update-isbn').value = isbn;
}

function updateBook(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const book = {
        id: formData.get('id'),
        title: formData.get('title'),
        author: formData.get('author'),
        isbn: formData.get('isbn')
    };

    fetch(`http://localhost:3666/api/books/update/${book.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(book)
    })
    .then(response => response.json())
    .then(() => {
        event.target.reset();
        document.getElementById('update-book-section').style.display = 'none';
        fetchBooks();
    })
    .catch(error => console.error('Error updating book:', error));
}
