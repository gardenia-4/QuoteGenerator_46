class QuoteGenerator {
    constructor() {
        this.currentQuote = null;
        this.storageManager = storageManager;
        
        // DOM元素
        this.quoteTextElement = document.getElementById('quoteText');
        this.quoteAuthorElement = document.getElementById('quoteAuthor');
        this.quoteCategoryElement = document.getElementById('quoteCategory');
        this.newQuoteBtn = document.getElementById('newQuoteBtn');
        this.favoriteBtn = document.getElementById('favoriteBtn');
        this.noteTextarea = document.getElementById('noteTextarea');
        this.saveNoteBtn = document.getElementById('saveNoteBtn');
        this.savedNotesElement = document.getElementById('savedNotes');
        this.favoritesListElement = document.getElementById('favoritesList');

        this.init();
    }

    init() {
        // 绑定事件监听器
        this.newQuoteBtn.addEventListener('click', () => this.displayRandomQuote());
        this.favoriteBtn.addEventListener('click', () => this.toggleFavorite());
        this.saveNoteBtn.addEventListener('click', () => this.saveNote());

        // 初始加载
        this.displayRandomQuote();
        this.displayFavorites();
        this.displayNotes();
    }

    // 显示随机名言
    displayRandomQuote() {
        this.currentQuote = getRandomQuote();
        
        this.quoteTextElement.textContent = `"${this.currentQuote.text}"`;
        this.quoteAuthorElement.textContent = `—— ${this.currentQuote.author}`;
        this.quoteCategoryElement.textContent = this.currentQuote.category;

        // 更新当前名言的笔记显示
        this.displayNotes();
        
        // 清空笔记输入框
        this.noteTextarea.value = '';
        
        // 添加动画效果
        this.animateQuoteChange();
    }

    // 名言切换动画
    animateQuoteChange() {
        const quoteCard = document.getElementById('quoteCard');
        quoteCard.style.transform = 'scale(0.95)';
        quoteCard.style.opacity = '0.8';

        setTimeout(() => {
            quoteCard.style.transform = 'scale(1)';
            quoteCard.style.opacity = '1';
        }, 150);
    }

    // 收藏/取消收藏
    toggleFavorite() {
        if (!this.currentQuote) return;

        const favorites = this.storageManager.getFavorites();
        const isCurrentlyFavorite = favorites.some(fav => fav.id === this.currentQuote.id);

        if (isCurrentlyFavorite) {
            // 取消收藏
            const result = this.storageManager.removeFavorite(this.currentQuote.id);
            this.showNotification(result.message);
            this.favoriteBtn.textContent = '❤️ 收藏';
        } else {
            // 添加收藏
            const result = this.storageManager.addFavorite(this.currentQuote);
            this.showNotification(result.message);
            if (result.success) {
                this.favoriteBtn.textContent = '💔 取消收藏';
            }
        }

        this.displayFavorites();
    }

    // 保存笔记
    saveNote() {
        if (!this.currentQuote) {
            this.showNotification('请先选择一条名言');
            return;
        }

        const noteContent = this.noteTextarea.value;
        const result = this.storageManager.saveNote(this.currentQuote, noteContent);

        this.showNotification(result.message);
        
        if (result.success) {
            this.noteTextarea.value = '';
            this.displayNotes();
        }
    }

    // 显示笔记
    displayNotes() {
        const notes = this.storageManager.getNotes();
        let notesToDisplay = notes;

        // 如果当前有名言，只显示该名言的笔记
        if (this.currentQuote) {
            notesToDisplay = this.storageManager.getNotesForQuote(this.currentQuote.id);
        }

        this.savedNotesElement.innerHTML = '';

        if (notesToDisplay.length === 0) {
            this.savedNotesElement.innerHTML = '<p style="text-align: center; color: #6c757d;">暂无笔记</p>';
            return;
        }

        notesToDisplay.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.className = 'note-item';
            noteElement.innerHTML = `
                <div class="note-quote">"${note.quoteText}" —— ${note.quoteAuthor}</div>
                <div class="note-content">${note.content}</div>
                <div class="note-date">${new Date(note.createdAt).toLocaleDateString()}</div>
                <button onclick="quoteApp.deleteNote(${note.id})" class="btn" style="background: #dc3545; color: white; margin-top: 10px; padding: 5px 10px; font-size: 0.8em;">删除笔记</button>
            `;
            this.savedNotesElement.appendChild(noteElement);
        });
    }

    // 删除笔记
    deleteNote(noteId) {
        if (confirm('确定要删除这条笔记吗？')) {
            this.storageManager.deleteNote(noteId);
            this.displayNotes();
            this.showNotification('笔记删除成功');
        }
    }

    // 显示收藏夹
    displayFavorites() {
        const favorites = this.storageManager.getFavorites();
        this.favoritesListElement.innerHTML = '';

        if (favorites.length === 0) {
            this.favoritesListElement.innerHTML = '<p style="text-align: center; color: #6c757d;">收藏夹为空</p>';
            return;
        }

        favorites.forEach(favorite => {
            const favoriteElement = document.createElement('div');
            favoriteElement.className = 'favorite-item';
            favoriteElement.innerHTML = `
                <div class="quote-text">"${favorite.text}"</div>
                <div class="quote-author">—— ${favorite.author}</div>
                <div class="quote-category">${favorite.category}</div>
                <button class="remove-favorite" onclick="quoteApp.removeFavorite(${favorite.id})">×</button>
            `;
            this.favoritesListElement.appendChild(favoriteElement);
        });

        // 更新收藏按钮状态
        if (this.currentQuote) {
            const isFavorite = favorites.some(fav => fav.id === this.currentQuote.id);
            this.favoriteBtn.textContent = isFavorite ? '💔 取消收藏' : '❤️ 收藏';
        }
    }

    // 移除收藏
    removeFavorite(quoteId) {
        this.storageManager.removeFavorite(quoteId);
        this.displayFavorites();
        
        // 如果移除的是当前显示的名言，更新按钮状态
        if (this.currentQuote && this.currentQuote.id === quoteId) {
            this.favoriteBtn.textContent = '❤️ 收藏';
        }
        
        this.showNotification('已取消收藏');
    }

    // 显示通知
    showNotification(message) {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 15px 25px;
            border-radius: 5px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // 3秒后自动移除
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// 初始化应用
const quoteApp = new QuoteGenerator();