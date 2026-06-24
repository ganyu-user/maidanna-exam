// 主应用入口文件
// 负责页面渲染、事件绑定、和Redux交互

// 从 CDN 引入的 Redux 挂在 window 上
declare const Redux: any;

// 创建 Redux store
const store = Redux.createStore(bookReducer);

// 当前正在编辑的书籍ID，null表示是新增模式
let editingBookId: number | null = null;

// ====== DOM 元素获取 ======
const bookListEl = document.getElementById('bookList') as HTMLTableSectionElement;
const emptyTipEl = document.getElementById('emptyTip') as HTMLDivElement;
const addBtn = document.getElementById('addBtn') as HTMLButtonElement;
const bookModal = document.getElementById('bookModal') as HTMLDivElement;
const modalTitle = document.getElementById('modalTitle') as HTMLHeadingElement;
const closeModalBtn = document.getElementById('closeModal') as HTMLButtonElement;
const cancelBtn = document.getElementById('cancelBtn') as HTMLButtonElement;
const saveBtn = document.getElementById('saveBtn') as HTMLButtonElement;
const deleteInModalBtn = document.getElementById('deleteInModal') as HTMLButtonElement;
const bookTitleInput = document.getElementById('bookTitle') as HTMLInputElement;
const bookPriceInput = document.getElementById('bookPrice') as HTMLInputElement;
const bookCategoryInput = document.getElementById('bookCategory') as HTMLInputElement;
const bookDescriptionInput = document.getElementById('bookDescription') as HTMLTextAreaElement;
const sortFieldSelect = document.getElementById('sortField') as HTMLSelectElement;
const sortOrderSelect = document.getElementById('sortOrder') as HTMLSelectElement;

// ====== 渲染函数 ======
function renderBookList(): void {
    const state = store.getState();
    let books: Book[] = [...state.books];
    const sortField: SortField = state.sortField;
    const sortOrder: SortOrder = state.sortOrder;

    // 排序（加分项：Sort By 排序功能）
    books.sort((a, b) => {
        let compareResult = 0;
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
    for (let i = 0; i < books.length; i++) {
        const book = books[i];
        const tr = document.createElement('tr');
        tr.dataset.id = String(book.id);

        // 书名列
        const titleTd = document.createElement('td');
        titleTd.textContent = book.title;
        tr.appendChild(titleTd);

        // 价格列
        const priceTd = document.createElement('td');
        const priceSpan = document.createElement('span');
        priceSpan.className = 'price';
        priceSpan.textContent = '¥' + book.price.toFixed(2);
        priceTd.appendChild(priceSpan);
        tr.appendChild(priceTd);

        // 分类列
        const categoryTd = document.createElement('td');
        const categorySpan = document.createElement('span');
        categorySpan.className = 'category-tag';
        categorySpan.textContent = book.category;
        categoryTd.appendChild(categorySpan);
        tr.appendChild(categoryTd);

        // 操作列
        const actionTd = document.createElement('td');
        const deleteBtn = document.createElement('button');
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
function openAddModal(): void {
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

function openEditModal(bookId: number): void {
    const state = store.getState();
    let book: Book | null = null;
    for (let i = 0; i < state.books.length; i++) {
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

function closeModal(): void {
    bookModal.classList.remove('show');
    editingBookId = null;
}

function saveBook(): void {
    const title = bookTitleInput.value.trim();
    const priceStr = bookPriceInput.value.trim();
    const category = bookCategoryInput.value.trim();
    const description = bookDescriptionInput.value.trim();

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
    const price = parseFloat(priceStr);
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

function deleteBookInModal(): void {
    if (editingBookId === null) {
        return;
    }
    const state = store.getState();
    let book: Book | null = null;
    for (let i = 0; i < state.books.length; i++) {
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
    const field = sortFieldSelect.value as SortField;
    const order = sortOrderSelect.value as SortOrder;
    store.dispatch(setSort(field, order));
});

sortOrderSelect.addEventListener('change', function() {
    const field = sortFieldSelect.value as SortField;
    const order = sortOrderSelect.value as SortOrder;
    store.dispatch(setSort(field, order));
});

// ====== 订阅 Redux 状态变化，自动重新渲染 ======
store.subscribe(renderBookList);

// 初始渲染
renderBookList();
