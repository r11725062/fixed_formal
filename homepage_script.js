let currentPageIndex = 0;
const pages = document.querySelectorAll('.page');
const nextButton = document.getElementById('next');
const prevButton = document.getElementById('prev');

function updateButtons() {
    prevButton.style.display = currentPageIndex === 0 ? 'none' : 'inline-block';
    nextButton.textContent = currentPageIndex === pages.length - 1 ? 'START' : 'NEXT';
}

nextButton.addEventListener('click', function() {
    if (currentPageIndex < pages.length - 2) {
        pages[currentPageIndex].classList.remove('active');
        pages[++currentPageIndex].classList.add('active');
        updateButtons();
    } else {
        window.location.href = 'avatar.html'; // 替換成你的跳轉目標頁面
    }
});

prevButton.addEventListener('click', function() {
    if (currentPageIndex > 0) {
        pages[currentPageIndex].classList.remove('active');
        pages[--currentPageIndex].classList.add('active');
        updateButtons();
    }
});


updateButtons(); // 初始化按鈕狀態
