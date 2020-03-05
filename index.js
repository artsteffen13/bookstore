const list = document.getElementById('book-list');

// Book Constructor

class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Constructor

class UI {

    showAlert = (className, message) => {
        const formError = `<p class=${className}>${message}</p>`;
        document.getElementById('book-form').insertAdjacentHTML("beforebegin", formError);
        setTimeout(() => document.querySelector('.' + className).remove(), 3000)
    };
}

class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books
    }

    static displayBooks() {
        document.querySelectorAll('.items').forEach( (item)=> {
            item.remove();
        });
        const books = Store.getBooks();
        const bookValues = Object.values(books);
        bookValues.map((item, id) => {
            const element = `<tr id=${id} class="items">
            <td>${item.title}</td>
            <td>${item.author}</td>
            <td>${item.isbn}</td>
            <td><a href="#" class="delete">X</a></td>
        </tr>`;
            list.insertAdjacentHTML("afterbegin", element);
        })

    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
        Store.displayBooks();
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }

    static removeBook(item) {
        const newBooks = [];
        const books = Store.getBooks();
        const oldId = parseInt(item.parentElement.parentElement.id);
        books.map((newItem, id) => {
            if (oldId !== id) {
                newBooks.push(newItem);
            }
        });
        localStorage.setItem('books', JSON.stringify(newBooks));
        this.displayBooks();
    }
}

// add item

document.getElementById('book-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value,
        author = document.getElementById('author').value,
        isbn = document.getElementById('isbn').value;

    const book = new Book(title, author, isbn);

    const ui = new UI();

    if (title === '' || author === '' || isbn === '') {
        ui.showAlert('error', 'Please fill out all fields.')
    } else {
        Store.addBook(book);
        ui.showAlert('success', 'Success')
    }
});

// delete item

UI.prototype.deleteItem = (target) => {
    if (target.className === 'delete')
        Store.removeBook(target);
    const ui = new UI();
    ui.showAlert('success', 'Item deleted.')
};

document.getElementById('book-list').addEventListener('click', function (e) {
    const ui = new UI();
    ui.deleteItem(e.target);
    e.preventDefault();
});

Store.displayBooks();