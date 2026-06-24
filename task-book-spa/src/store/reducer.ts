// Redux reducer

// state 的类型
interface BookState {
    books: Book[];
    nextId: number;
    sortField: SortField;
    sortOrder: SortOrder;
}

// 初始状态，先放几本书当示例数据
const initialState: BookState = {
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

// reducer 纯函数
function bookReducer(state: BookState = initialState, action: any): BookState {
    switch (action.type) {
        case ADD_BOOK: {
            const newBook: Book = {
                id: state.nextId,
                title: action.payload.title,
                price: action.payload.price,
                category: action.payload.category,
                description: action.payload.description
            };
            return {
                ...state,
                books: [...state.books, newBook],
                nextId: state.nextId + 1
            };
        }
        case UPDATE_BOOK: {
            const updatedBooks = state.books.map(book => {
                if (book.id === action.payload.id) {
                    return action.payload;
                }
                return book;
            });
            return {
                ...state,
                books: updatedBooks
            };
        }
        case DELETE_BOOK: {
            const filteredBooks = state.books.filter(book => book.id !== action.payload);
            return {
                ...state,
                books: filteredBooks
            };
        }
        case SET_SORT: {
            return {
                ...state,
                sortField: action.payload.field,
                sortOrder: action.payload.order
            };
        }
        default:
            return state;
    }
}
