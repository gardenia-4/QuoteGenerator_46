// 本地存储管理
class StorageManager {
    constructor() {
        this.favoritesKey = 'quoteFavorites';
        this.notesKey = 'quoteNotes';
    }

    // 获取收藏列表
    getFavorites() {
        const favorites = localStorage.getItem(this.favoritesKey);
        return favorites ? JSON.parse(favorites) : [];
    }

    // 添加收藏
    addFavorite(quote) {
        const favorites = this.getFavorites();
        
        // 检查是否已经收藏
        const isAlreadyFavorite = favorites.some(fav => fav.id === quote.id);
        if (isAlreadyFavorite) {
            return { success: false, message: '该名言已在收藏夹中' };
        }

        favorites.push({
            ...quote,
            favoritedAt: new Date().toISOString()
        });
        
        localStorage.setItem(this.favoritesKey, JSON.stringify(favorites));
        return { success: true, message: '收藏成功' };
    }

    // 移除收藏
    removeFavorite(quoteId) {
        const favorites = this.getFavorites();
        const updatedFavorites = favorites.filter(fav => fav.id !== quoteId);
        localStorage.setItem(this.favoritesKey, JSON.stringify(updatedFavorites));
        return { success: true, message: '已取消收藏' };
    }

    // 获取笔记列表
    getNotes() {
        const notes = localStorage.getItem(this.notesKey);
        return notes ? JSON.parse(notes) : [];
    }

    // 保存笔记
    saveNote(quote, noteContent) {
        if (!noteContent.trim()) {
            return { success: false, message: '笔记内容不能为空' };
        }

        const notes = this.getNotes();
        const newNote = {
            id: Date.now(), // 使用时间戳作为唯一ID
            quoteId: quote.id,
            quoteText: quote.text,
            quoteAuthor: quote.author,
            content: noteContent.trim(),
            createdAt: new Date().toISOString()
        };

        notes.unshift(newNote); // 添加到开头
        localStorage.setItem(this.notesKey, JSON.stringify(notes));
        return { success: true, message: '笔记保存成功' };
    }

    // 删除笔记
    deleteNote(noteId) {
        const notes = this.getNotes();
        const updatedNotes = notes.filter(note => note.id !== noteId);
        localStorage.setItem(this.notesKey, JSON.stringify(updatedNotes));
        return { success: true, message: '笔记删除成功' };
    }

    // 获取特定名言的笔记
    getNotesForQuote(quoteId) {
        const notes = this.getNotes();
        return notes.filter(note => note.quoteId === quoteId);
    }
}

// 创建全局存储管理器实例
const storageManager = new StorageManager();