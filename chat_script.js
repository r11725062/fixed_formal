const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null; // Variable to store user's message
const API_KEY = ""; // Paste your API key here
const inputInitHeight = chatInput.scrollHeight;

let chatHistory = []; 
function addToChatHistory(sender, message) {
    chatHistory.push({sender: sender, message: message});
}

const createChatLi = (message, className) => {
    // Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    const avatarSrc = localStorage.getItem("avatarSrc") || "ava_images/m_ng_s_s.png";
    let chatContent = className === "outgoing" ? `<p></p>` : `<img class="ava_image" src="${avatarSrc}"><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi; // return chat <li> element
}

const generateResponse = (chatElement) => {
    const netlifyFunctionURL = "/.netlify/functions/api"; // Netlify 函数的路径
    const messageElement = chatElement.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
         body: JSON.stringify({ 
            userMessage: userMessage, 
            chatHistory: chatHistory // 将当前对话历史发送给服务器
        })
    };

    fetch(netlifyFunctionURL, requestOptions).then(res => res.json()).then(data => {
        // 假设返回的数据包含在 'message' 字段
        messageElement.textContent = data.message;
        addToChatHistory("bot", messageElement.textContent); 
    }).catch(() => {
        messageElement.classList.add("error");
        messageElement.textContent = "哎呀！出錯了。請再試一次。";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

const handleChat = () => {
    userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
    if(!userMessage) return;

    // Clear the input textarea and set its height to default
    chatInput.value = "";
    addToChatHistory("user", userMessage); 
    chatInput.style.height = `${inputInitHeight}px`;

    // Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    
    setTimeout(() => {
        // Display "Thinking..." message while waiting for the response
        const incomingChatLi = createChatLi("薪資談判指導員正在輸入訊息...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

chatInput.addEventListener("input", () => {
    // Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // If Enter key is pressed without Shift key and the window 
    // width is greater than 800px, handle the chat
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

document.addEventListener("DOMContentLoaded", () => { 
    // if the webpage opened, the chatroom show
    document.body.classList.add("show-chatbot");
    const avatarSrc = localStorage.getItem('avatarSrc');

    // 檢查是否成功獲取頭像路徑
    if (avatarSrc) {
      // 如果有，更新頁面上所有頭像圖片的src屬性
      document.querySelectorAll('.ava_image').forEach(img => {
        img.src = avatarSrc;
      });
    }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
//chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));

function submitChatHistoryToGoogleForm() {
    // 将聊天历史转换为一个字符串
    let chatHistoryString = chatHistory.map(item => `${item.sender}: ${item.message}`).join('\n');
    // 伪代码示例，展示如何在 chat.html 中处理 localStorage 数据
    const avatarSrc = localStorage.getItem("avatarSrc") || "ava_images/m_ng_s_s.png";
    // 构造表单数据
    let formData = new FormData();
    formData.append("entry.938012830", 'fixed');
    formData.append("entry.25562195", "formal");
    formData.append("entry.22358687", "default_name");
    formData.append("entry.1553700084", avatarSrc);
    formData.append("entry.801005873", chatHistoryString);
     // 使用fetch替代$.ajax提交表单
    fetch("https://docs.google.com/forms/u/0/d/e/1FAIpQLSedu6Xgk9J57Z7p1NmCSabbymfZ5XfTVDj1Qobu6p5IFJv0mw/formResponse", {
        method: "POST",
        mode: "no-cors", // 注意：这将导致无法直接读取响应，但可以允许请求发送
        body: new URLSearchParams(formData)
    }).then(response => {
        console.log("Form submitted");
    }).catch(error => {
        console.error("Submission failed", error);
    });
}

function startTimer(duration, display) {
    let timer = duration, minutes, seconds;
    const interval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = "剩餘時間：" + minutes + "：" + seconds; // 在這裡添加“剩餘時間”

        if (--timer < 0) {
            clearInterval(interval);
            submitChatHistoryToGoogleForm()
            window.location.href = 'https://tassel.syd1.qualtrics.com/jfe/form/SV_9ZwsyfyiF8tD1v8'; // 替換為實際的跳轉URL
        }
    }, 1000);
}

window.onload = function () {
    const duration = 300, // 這裡設置倒數計時的總秒數
        display = document.querySelector('#timer');
    startTimer(duration, display);
    
    var avatarSrc = localStorage.getItem("avatarSrc");
    var userName = localStorage.getItem("userName");
  
    // 如果信息存在，則更新頁面上的頭像和姓名
    if (avatarSrc && userName) {
      document.querySelector(".ava_image").src = avatarSrc;
      // 假設你有一個顯示用戶名的元素
      document.getElementById("user-name-display").textContent = userName;
    }
};

document.querySelector('.material-symbols-outlined').addEventListener('click', function() {
    var popupBox = document.querySelector('.popup-box');
    if (popupBox.style.display === 'none') {
      popupBox.style.display = 'block';
    } else {
      popupBox.style.display = 'none';
    }
  });
$(document).ready(function() {
    // 顯示遮罩層和第一個指引
    $(".modal-overlay").show();
    $("#guideModal1").show();
  
    // 當用戶點擊任一關閉按鈕時
    $(".close-guide").click(function() {
      var guideNumber = $(this).data("guide"); // 獲取是哪一個指引的關閉按鈕
      $("#guideModal" + guideNumber).hide(); // 隱藏當前指引
  
      if (guideNumber == 1) {
        // 如果是第一個指引被關閉，則顯示第二個指引
        $("#guideModal2").show();
      } else if (guideNumber == 2) {
        // 如果是第二個指引被關閉，則顯示第三個指引
        $("#guideModal3").show();
      } else {
        // 如果是第三個指引被關閉，則隱藏遮罩層
        $(".modal-overlay").hide();
      }
    });
  });
  
function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // 避免在屏幕上显示textArea
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? '成功' : '失败';
        console.log('Fallback: 复制的文本 ' + msg);
    } catch (err) {
        console.error('Fallback: 无法复制文本', err);
    }

    document.body.removeChild(textArea);
    alert('已複製問題');
}


$(document).on('click', '.question', function() {
    const questionText = $(this).data('copy'); // 或者 $(this).text() 获取问题文本
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(questionText).then(() => {
            alert('已複製問題');
        }).catch(err => {
            console.error('复制失败，使用fallback方案', err);
            fallbackCopyTextToClipboard(questionText);
        });
    } else {
        console.log('Clipboard API 不可用，使用fallback方案');
        fallbackCopyTextToClipboard(questionText);
    }

    // 关闭问题库
    $('.close-popup').click(function() {
        $(this).parent('.popup-box').hide();
    });
});
