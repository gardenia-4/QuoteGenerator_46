// 名言数据库
const quotes = [
    {
        id: 1,
        text: "Courage is grace under pressure. ",
        author: "Ernest Hemingway",
        category: "勇气",
    },
    {
        id: 2,
        text: "你的时间有限，不要浪费于重复别人的生活。",
        author: "Steve Jobs",
        category: "人生",
    },
    {
        id: 3,
        text: "日中则移，月满则亏，物胜则衰",
        author: "《战国策》",
        category: "思辨",
    },
    {
        id: 4,
        text: "天行健，君子以自强不息。",
        author: "《周易》",
        category: "国学",
    },
    {
        text: "He who has a why to live can bear almost any how.",
        author: "Friedrich Nietzsche",
        category: "人生",
    },
    {
        id: 6,
        text: "千里之行，始于足下。",
        author: "老子",
        category: "国学",
    },
    {
        id: 7,
        text: "Be yourself; everyone else is already taken.",
        author: "Oscar Wilde",
        category: "人生",
    },
    {
        id: 8,
        text: "学而不思则罔，思而不学则殆。",
        author: "孔子",
        category: "教育",
    },
    {
        id: 9,
        text: "Innovation distinguishes between a leader and a follower.",
        author: "Steve Jobs",
        category: "创新",
    },
    {
        id: 10,
        text: "生活就像一盒巧克力，你永远不知道下一颗是什么味道。",
        author: "《阿甘正传》",
        category: "电影",
    }
];

// 获取随机名言
function getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
}

// 按分类获取名言
function getQuotesByCategory(category) {
    return quotes.filter(quote => quote.category === category);
}

// 获取所有分类
function getAllCategories() {
    const categories = [...new Set(quotes.map(quote => quote.category))];
    return categories;
}