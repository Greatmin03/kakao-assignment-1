// Todo 데이터를 저장할 배열
let todoItems = [];

// DOM 요소 선택
const todoInput = document.getElementById("todoInput");
const addTodoButton = document.getElementById("addTodoButton");
const todoList = document.getElementById("todoList");
const messageBox = document.getElementById("messageBox");

// Todo 추가
function addTodo() {
    const todoText = todoInput.value.trim();

    // 빈 입력 방지
    if (todoText === "") {
        showMessage("할 일을 입력해주세요.");
        return;
    }

    clearMessage();

    const newTodo = {
        id: Date.now(),
        text: todoText,
        completed: false
    };

    todoItems.push(newTodo);

    todoInput.value = "";
    renderTodoList();
}

// Todo 수정
function editTodo(todoId) {
    const targetTodo = todoItems.find(todo => todo.id === todoId);

    const updatedText = prompt(
        "수정할 내용을 입력하세요.",
        targetTodo.text
    );

    if (updatedText === null) return;

    const trimmedText = updatedText.trim();

    if (trimmedText === "") {
        showMessage("수정 내용은 비워둘 수 없습니다.");
        return;
    }

    targetTodo.text = trimmedText;

    clearMessage();
    renderTodoList();
}

// Todo 완료 상태 변경
function toggleTodoComplete(todoId) {
    const targetTodo = todoItems.find(todo => todo.id === todoId);

    targetTodo.completed = !targetTodo.completed;

    renderTodoList();
}

// Todo 삭제
function deleteTodo(todoId) {
    todoItems = todoItems.filter(todo => todo.id !== todoId);

    renderTodoList();
}

// 안내 메시지 출력
function showMessage(message) {
    messageBox.textContent = message;
}

// 안내 메시지 제거
function clearMessage() {
    messageBox.textContent = "";
}

// Todo 목록 화면 렌더링
function renderTodoList() {
    todoList.innerHTML = "";

    todoItems.forEach(todo => {
        const todoItemElement = document.createElement("li");
        todoItemElement.classList.add("todo-item");

        todoItemElement.innerHTML = `
            <span class="todo-text ${todo.completed ? "completed" : ""}">
                ${todo.text}
            </span>

            <div class="todo-actions">
                <button
                    class="action-button edit-button"
                    onclick="editTodo(${todo.id})"
                >
                    수정
                </button>

                <button
                    class="action-button complete-button"
                    onclick="toggleTodoComplete(${todo.id})"
                >
                    ${todo.completed ? "취소" : "완료"}
                </button>

                <button
                    class="action-button delete-button"
                    onclick="deleteTodo(${todo.id})"
                >
                    삭제
                </button>
            </div>
        `;

        todoList.appendChild(todoItemElement);
    });
}

// 버튼 클릭 이벤트
addTodoButton.addEventListener("click", addTodo);

// 엔터 입력 시 추가
todoInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addTodo();
    }
});