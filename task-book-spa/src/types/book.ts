// 书籍的类型定义
interface Book {
    id: number;
    title: string;       // 书名
    price: number;       // 价格
    category: string;    // 分类
    description: string; // 描述
}

// 排序字段
type SortField = 'title' | 'price' | 'category';

// 排序方式
type SortOrder = 'asc' | 'desc';
