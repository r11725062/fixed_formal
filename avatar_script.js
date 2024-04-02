document.addEventListener("DOMContentLoaded", function() {
        // 頭像圖片清單
        const avatarImages = [
            "ava_images/f_g_s_h.png",
            "ava_images/f_g_s_s.png",
            "ava_images/f_g_t_h.png",
            "ava_images/f_g_t_s.png",
            "ava_images/m_g_s_h.png",
            "ava_images/m_g_s_s.png",
            "ava_images/m_g_t_h.png",
            "ava_images/m_g_t_s.png"
        ];
    
        // 隨機選擇一個頭像
        const selectedAvatar = avatarImages[Math.floor(Math.random() * avatarImages.length)];
    
        // 保存選擇的頭像到localStorage
        localStorage.setItem("avatarSrc", selectedAvatar);
    
        // 更新頁面上的頭像圖片
        document.querySelector('img[alt="用戶頭像"]').src = selectedAvatar;
    });
submitBtn.addEventListener('click', function() {
        window.location.href = 'chat.html'; // 替換成你的跳轉目標頁面
});
