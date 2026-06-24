// Redux action 相关

// action 类型常量
const ADD_BOOK = 'ADD_BOOK';
const UPDATE_BOOK = 'UPDATE_BOOK';
const DELETE_BOOK = 'DELETE_BOOK';
const SET_SORT = 'SET_SORT';

// 添加书籍
function addBook(book: { title: string; price: number; category: string; description: string }) {
    return {
        type: ADD_BOOK,
        payload: book
    };
}

// 更新书籍
function updateBook(book: Book) {
    return {
        type: UPDATE_BOOK,
        payload: book
    };
}

// 删除书籍
function deleteBook(id: number) {
    return {
        type: DELETE_BOOK,
        payload: id
    };
}

// 设置排序
function setSort(field: SortField, order: SortOrder) {
    return {
        type: SET_SORT,
        payload: { field, order }
    };
}
