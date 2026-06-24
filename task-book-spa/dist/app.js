// ====== types/book.ts ======
// 书籍的类型定义（运行时没用，只是TS用的，这里注释一下）
// interface Book { id, title, price, category, description }
// type SortField = 'title' | 'price' | 'category'
// type SortOrder = 'asc' | 'desc'

// ====== store/actions.ts ======
var ADD_BOOK = 'ADD_BOOK';
var UPDATE_BOOK = 'UPDATE_BOOK';
var DELETE_BOOK = 'DELETE_BOOK';
var SET_SORT = 'SET_SORT';

function addBook(book) {
    return {
        type: ADD_BOOK,
        payload: book
    };
}

function updateBook(book) {
    return {
        type: UPDATE_BOOK,
        payload: book
    };
}

function deleteBook(id) {
    return {
        type: DELETE_BOOK,
        payload: id
    };
}

function setSort(field, order) {
    return {
        type: SET_SORT,
        payload: { field: field, order: order }
    };
}

// ====== store/reducer.ts ======
var initialState = {
    books: [
        {
            id: 1,
            title: 'JavaScript高级程序设计',
            price: 99.00,
            category: '编程',
            description: '红宝书，前端入门必读'
        },
        {
            id: 2,
            title: '三体',
            price: 68.00,
            category: '科幻小说',
            description: '刘慈欣的经典科幻作品'
        },
        {
            id: 3,
            title: '活着',
            price: 35.00,
            category: '文学',
            description: '余华代表作，讲述福贵的一生'
        }
    ],
    nextId: 4,
    sortField: 'title',
    sortOrder: 'asc'
};

function bookReducer(state, action) {
    if (state === undefined) {
        state = initialState;
    }
    switch (action.type) {
        case ADD_BOOK: {
            var newBook = {
                id: state.nextId,
                title: action.payload.title,
                price: action.payload.price,
                category: action.payload.category,
                description: action.payload.description
            };
            var newBooks = state.books.slice();
            newBooks.push(newBook);
            return {
                books: newBooks,
                nextId: state.nextId + 1,
                sortField: state.sortField,
                sortOrder: state.sortOrder
            };
        }
        case UPDATE_BOOK: {
            var updatedBooks = state.books.map(function(book) {
                if (book.id === action.payload.id) {
                    return action.payload;
                }
                return book;
            });
            return {
                books: updatedBooks,
                nextId: state.nextId,
                sortField: state.sortField,
                sortOrder: state.sortOrder
            };
        }
        case DELETE_BOOK: {
            var filteredBooks = state.books.filter(function(book) {
                return book.id !== action.payload;
            });
            return {
                books: filteredBooks,
                nextId: state.nextId,
                sortField: state.sortField,
                sortOrder: state.sortOrder
            };
        }
        case SET_SORT: {
            return {
                books: state.books,
                nextId: state.nextId,
                sortField: action.payload.field,
                sortOrder: action.payload.order
            };
        }
        default:
            return state;
    }
}

// ====== app.ts ======
// 创建 Redux store
var store = Redux.createStore(bookReducer);

// 当前正在编辑的书籍ID，null表示是新增模式
var editingBookId = null;

// ====== DOM 元素获取 ======
var bookListEl = document.getElementById('bookList');
var emptyTipEl = document.getElementById('emptyTip');
var addBtn = document.getElementById('addBtn');
var bookModal = document.getElementById('bookModal');
var modalTitle = document.getElementById('modalTitle');
var closeModalBtn = document.getElementById('closeModal');
var cancelBtn = document.getElementById('cancelBtn');
var saveBtn = document.getElementById('saveBtn');
var deleteInModalBtn = document.getElementById('deleteInModal');
var bookTitleInput = document.getElementById('bookTitle');
var bookPriceInput = document.getElementById('bookPrice');
var bookCategoryInput = document.getElementById('bookCategory');
var bookDescriptionInput = document.getElementById('bookDescription');
var sortFieldSelect = document.getElementById('sortField');
var sortOrderSelect = document.getElementById('sortOrder');

// ====== 渲染函数 ======
function renderBookList() {
    var state = store.getState();
    var books = state.books.slice();
    var sortField = state.sortField;
    var sortOrder = state.sortOrder;

    // 排序（加分项：Sort By 排序功能）
    books.sort(function(a, b) {
        var compareResult = 0;
        if (sortField === 'title') {
            compareResult = a.title.localeCompare(b.title, 'zh-CN');
        } else if (sortField === 'price') {
            compareResult = a.price - b.price;
        } else if (sortField === 'category') {
            compareResult = a.category.localeCompare(b.category, 'zh-CN');
        }
        // 如果是降序，把结果反过来
        if (sortOrder === 'desc') {
            compareResult = -compareResult;
        }
        return compareResult;
    });

    // 清空列表
    bookListEl.innerHTML = '';

    // 空状态处理
    if (books.length === 0) {
        emptyTipEl.style.display = 'block';
        return;
    }
    emptyTipEl.style.display = 'none';

    // 渲染每一行
    for (var i = 0; i < books.length; i++) {
        var book = books[i];
        var tr = document.createElement('tr');
        tr.dataset.id = String(book.id);

        // 书名列
        var titleTd = document.createElement('td');
        titleTd.textContent = book.title;
        tr.appendChild(titleTd);

        // 价格列
        var priceTd = document.createElement('td');
        var priceSpan = document.createElement('span');
        priceSpan.className = 'price';
        priceSpan.textContent = '¥' + book.price.toFixed(2);
        priceTd.appendChild(priceSpan);
        tr.appendChild(priceTd);

        // 分类列
        var categoryTd = document.createElement('td');
        var categorySpan = document.createElement('span');
        categorySpan.className = 'category-tag';
        categorySpan.textContent = book.category;
        categoryTd.appendChild(categorySpan);
        tr.appendChild(categoryTd);

        // 操作列
        var actionTd = document.createElement('td');
        var deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '删除';
        // 用闭包保存当前book的引用
        (function(currentBook) {
            deleteBtn.addEventListener('click', function(e) {
                e.stopPropagation(); // 阻止冒泡，避免触发行点击
                if (confirm('确定要删除《' + currentBook.title + '》吗？')) {
                    store.dispatch(deleteBook(currentBook.id));
                }
            });
        })(book);
        actionTd.appendChild(deleteBtn);
        tr.appendChild(actionTd);

        // 点击整行打开编辑弹窗
        (function(bookId) {
            tr.addEventListener('click', function() {
                openEditModal(bookId);
            });
        })(book.id);

        bookListEl.appendChild(tr);
    }
}

// ====== 弹窗相关函数 ======
function openAddModal() {
    editingBookId = null;
    modalTitle.textContent = '添加书籍';
    bookTitleInput.value = '';
    bookPriceInput.value = '';
    bookCategoryInput.value = '';
    bookDescriptionInput.value = '';
    deleteInModalBtn.style.display = 'none';
    bookModal.classList.add('show');
    bookTitleInput.focus();
}

function openEditModal(bookId) {
    var state = store.getState();
    var book = null;
    for (var i = 0; i < state.books.length; i++) {
        if (state.books[i].id === bookId) {
            book = state.books[i];
            break;
        }
    }
    if (!book) {
        return;
    }

    editingBookId = bookId;
    modalTitle.textContent = '编辑书籍';
    bookTitleInput.value = book.title;
    bookPriceInput.value = String(book.price);
    bookCategoryInput.value = book.category;
    bookDescriptionInput.value = book.description;
    deleteInModalBtn.style.display = 'inline-block';
    bookModal.classList.add('show');
}

function closeModal() {
    bookModal.classList.remove('show');
    editingBookId = null;
}

function saveBook() {
    var title = bookTitleInput.value.trim();
    var priceStr = bookPriceInput.value.trim();
    var category = bookCategoryInput.value.trim();
    var description = bookDescriptionInput.value.trim();

    // 简单校验
    if (!title) {
        alert('请输入书名');
        bookTitleInput.focus();
        return;
    }
    if (!priceStr) {
        alert('请输入价格');
        bookPriceInput.focus();
        return;
    }
    var price = parseFloat(priceStr);
    if (isNaN(price) || price < 0) {
        alert('价格必须是大于等于0的数字');
        bookPriceInput.focus();
        return;
    }
    if (!category) {
        alert('请输入分类');
        bookCategoryInput.focus();
        return;
    }

    if (editingBookId === null) {
        // 新增模式
        store.dispatch(addBook({
            title: title,
            price: price,
            category: category,
            description: description
        }));
    } else {
        // 编辑模式
        store.dispatch(updateBook({
            id: editingBookId,
            title: title,
            price: price,
            category: category,
            description: description
        }));
    }

    closeModal();
}

function deleteBookInModal() {
    if (editingBookId === null) {
        return;
    }
    var state = store.getState();
    var book = null;
    for (var i = 0; i < state.books.length; i++) {
        if (state.books[i].id === editingBookId) {
            book = state.books[i];
            break;
        }
    }
    if (book && confirm('确定要删除《' + book.title + '》吗？')) {
        store.dispatch(deleteBook(editingBookId));
        closeModal();
    }
}

// ====== 事件绑定 ======
addBtn.addEventListener('click', openAddModal);
closeModalBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);
saveBtn.addEventListener('click', saveBook);
deleteInModalBtn.addEventListener('click', deleteBookInModal);

// 点击遮罩层关闭弹窗
bookModal.addEventListener('click', function(e) {
    if (e.target === bookModal) {
        closeModal();
    }
});

// 排序选择改变
sortFieldSelect.addEventListener('change', function() {
    var field = sortFieldSelect.value;
    var order = sortOrderSelect.value;
    store.dispatch(setSort(field, order));
});

sortOrderSelect.addEventListener('change', function() {
    var field = sortFieldSelect.value;
    var order = sortOrderSelect.value;
    store.dispatch(setSort(field, order));
});

// ====== 订阅 Redux 状态变化，自动重新渲染 ======
store.subscribe(renderBookList);

// 初始渲染
renderBookList();
