/**
 * =========================
 * Todo 데이터 저장소
 * =========================
 *
 * Todo 객체 구조
 *
 * {
 *   id: 숫자,
 *   text: 문자열,
 *   completed: true | false,
 *   date: "2026-06-03"
 * }
 */
let todoItems = [];

/**
 * =========================
 * 상태 필터
 * =========================
 *
 * all
 * active
 * completed
 */
let currentFilter = "all";

/**
 * =========================
 * 현재 선택된 날짜
 * =========================
 *
 * 사용자가 클릭한 날짜
 */
let selectedDate = new Date();

/**
 * =========================
 * 현재 보고 있는 주의 시작일
 * =========================
 *
 * 항상 월요일
 */
let currentWeekStartDate =
    getStartOfWeek(new Date());

/**
 * =========================
 * LocalStorage 키
 * =========================
 */
const TODO_STORAGE_KEY =
    "todoItems";

/* =========================
   DOM 요소
   ========================= */

const todoInput =
    document.getElementById(
        "todoInput"
    );

const addTodoButton =
    document.getElementById(
        "addTodoButton"
    );

const todoList =
    document.getElementById(
        "todoList"
    );

const messageBox =
    document.getElementById(
        "messageBox"
    );

const filterButtons =
    document.querySelectorAll(
        ".filter-button"
    );

/* =========================
   주간 뷰 DOM
   ========================= */

const previousWeekButton =
    document.getElementById(
        "previousWeekButton"
    );

const nextWeekButton =
    document.getElementById(
        "nextWeekButton"
    );

const weekRangeText =
    document.getElementById(
        "weekRangeText"
    );

const weekDatesContainer =
    document.getElementById(
        "weekDatesContainer"
    );

/* =========================
   날짜 관련 함수
   ========================= */

/**
 * Date → YYYY-MM-DD
 */
function formatDate(date) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

/**
 * 월요일 계산
 */
function getStartOfWeek(date) {

    const copiedDate =
        new Date(date);

    const day =
        copiedDate.getDay();

    /*
        JS

        일 = 0
        월 = 1
        ...
        토 = 6
    */

    const diff =
        day === 0
            ? -6
            : 1 - day;

    copiedDate.setDate(
        copiedDate.getDate() + diff
    );

    copiedDate.setHours(
        0,
        0,
        0,
        0
    );

    return copiedDate;
}

/**
 * 현재 주의
 * 월~일 배열 생성
 */
function getCurrentWeekDates() {

    const weekDates = [];

    for (
        let i = 0;
        i < 7;
        i++
    ) {

        const date =
            new Date(
                currentWeekStartDate
            );

        date.setDate(
            currentWeekStartDate.getDate()
            + i
        );

        weekDates.push(date);
    }

    return weekDates;
}

/**
 * 오늘 날짜인지 확인
 */
function isToday(date) {

    return (
        formatDate(date) ===
        formatDate(new Date())
    );
}

/**
 * 현재 선택된 날짜인지 확인
 */
function isSelectedDate(date) {

    return (
        formatDate(date) ===
        formatDate(selectedDate)
    );
}

/**
 * 특정 날짜 Todo 개수
 */
function getTodoCountByDate(date) {

    const targetDate =
        formatDate(date);

    return todoItems.filter(todo => {

        return (
            todo.date ===
            targetDate
        );

    }).length;
}

/* =========================
   LocalStorage
   ========================= */

function saveTodosToStorage() {

    localStorage.setItem(
        TODO_STORAGE_KEY,
        JSON.stringify(
            todoItems
        )
    );
}

function loadTodosFromStorage() {

    const savedTodos =
        localStorage.getItem(
            TODO_STORAGE_KEY
        );

    if (!savedTodos) {

        return;
    }

    todoItems =
        JSON.parse(
            savedTodos
        );
}

/* =========================
   Todo 생성
   ========================= */

function addTodo() {

    const todoText =
        todoInput.value.trim();

    if (todoText === "") {

        showMessage(
            "할 일을 입력해주세요."
        );

        return;
    }

    clearMessage();

    const newTodo = {

        id: Date.now(),

        text: todoText,

        completed: false,

        date:
            formatDate(
                selectedDate
            )
    };

    todoItems.push(
        newTodo
    );

    saveTodosToStorage();

    todoInput.value = "";

    renderWeekDates();

    renderTodoList();
}

/* =========================
   Todo 수정
   ========================= */

function editTodo(todoId) {

    const targetTodo =
        todoItems.find(
            todo =>
                todo.id === todoId
        );

    const updatedText =
        prompt(
            "수정할 내용을 입력하세요.",
            targetTodo.text
        );

    if (
        updatedText === null
    ) {

        return;
    }

    if (
        updatedText.trim() === ""
    ) {

        showMessage(
            "수정 내용은 비워둘 수 없습니다."
        );

        return;
    }

    targetTodo.text =
        updatedText.trim();

    saveTodosToStorage();

    renderTodoList();
}

/* =========================
   Todo 완료 상태 변경
   ========================= */

function toggleTodoComplete(todoId) {

    const targetTodo =
        todoItems.find(
            todo =>
                todo.id === todoId
        );

    targetTodo.completed =
        !targetTodo.completed;

    saveTodosToStorage();

    renderWeekDates();

    renderTodoList();
}

/* =========================
   Todo 삭제
   ========================= */

function deleteTodo(todoId) {

    todoItems =
        todoItems.filter(
            todo =>
                todo.id !== todoId
        );

    saveTodosToStorage();

    renderWeekDates();

    renderTodoList();
}

/* =========================
   상태 필터 변경
   ========================= */

function changeFilter(filterType) {

    currentFilter =
        filterType;

    filterButtons.forEach(
        button => {

            button.classList.remove(
                "active-filter"
            );
        }
    );

    const activeButton =
        document.querySelector(
            `[data-filter="${filterType}"]`
        );

    activeButton.classList.add(
        "active-filter"
    );

    renderTodoList();
}

/* =========================
   주 이동
   ========================= */

/**
 * 이전 주
 */
function moveToPreviousWeek() {

    currentWeekStartDate.setDate(
        currentWeekStartDate.getDate()
        - 7
    );

    renderWeekDates();
}

/**
 * 다음 주
 */
function moveToNextWeek() {

    currentWeekStartDate.setDate(
        currentWeekStartDate.getDate()
        + 7
    );

    renderWeekDates();
}

/* =========================
   날짜 선택
   ========================= */

function selectDate(date) {

    selectedDate =
        new Date(date);

    renderWeekDates();

    renderTodoList();
}

/* =========================
   Todo 필터링
   ========================= */

function getFilteredTodos() {

    const selectedDateString =
        formatDate(
            selectedDate
        );

    let filteredTodos =
        todoItems.filter(
            todo => {

                return (
                    todo.date ===
                    selectedDateString
                );
            }
        );

    if (
        currentFilter ===
        "active"
    ) {

        filteredTodos =
            filteredTodos.filter(
                todo => {

                    return !todo.completed;
                }
            );
    }

    if (
        currentFilter ===
        "completed"
    ) {

        filteredTodos =
            filteredTodos.filter(
                todo => {

                    return todo.completed;
                }
            );
    }

    return filteredTodos;
}

/* =========================
   메시지
   ========================= */

function showMessage(message) {

    messageBox.textContent =
        message;
}

function clearMessage() {

    messageBox.textContent =
        "";
}

/* =========================
   주간 렌더링
   ========================= */

function renderWeekDates() {

    weekDatesContainer.innerHTML =
        "";

    const weekDates =
        getCurrentWeekDates();

    /*
        주 범위 표시

        예)
        2026-06-02 ~ 2026-06-08
    */
    const firstDate =
        formatDate(
            weekDates[0]
        );

    const lastDate =
        formatDate(
            weekDates[6]
        );

    weekRangeText.textContent =
        `${firstDate} ~ ${lastDate}`;

    const dayNames = [
        "월",
        "화",
        "수",
        "목",
        "금",
        "토",
        "일"
    ];

    weekDates.forEach(
        (date, index) => {

            const todoCount =
                getTodoCountByDate(
                    date
                );

            const dateCard =
                document.createElement(
                    "div"
                );

            dateCard.classList.add(
                "week-date-card"
            );

            /*
                선택 날짜
            */
            if (
                isSelectedDate(
                    date
                )
            ) {

                dateCard.classList.add(
                    "selected-date-card"
                );
            }

            /*
                오늘 날짜
            */
            if (
                isToday(date)
            ) {

                dateCard.classList.add(
                    "today-date-card"
                );
            }

            dateCard.innerHTML = `
                <div class="week-day-name">
                    ${dayNames[index]}
                </div>

                <div class="week-day-number">
                    ${date.getDate()}
                </div>

                <div class="week-todo-count">
                    ${todoCount}개
                </div>
            `;

            dateCard.addEventListener(
                "click",
                () => {

                    selectDate(
                        date
                    );
                }
            );

            weekDatesContainer.appendChild(
                dateCard
            );
        }
    );
}

/* =========================
   Todo 목록 렌더링
   ========================= */

function renderTodoList() {

    todoList.innerHTML = "";

    const filteredTodos =
        getFilteredTodos();

    filteredTodos.forEach(
        todo => {

            const todoItemElement =
                document.createElement(
                    "li"
                );

            todoItemElement.classList.add(
                "todo-item"
            );

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

            todoList.appendChild(
                todoItemElement
            );
        }
    );
}

/* =========================
   이벤트 등록
   ========================= */

addTodoButton.addEventListener(
    "click",
    addTodo
);

todoInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Enter"
        ) {

            addTodo();
        }
    }
);

filterButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                changeFilter(
                    button.dataset.filter
                );
            }
        );
    }
);

previousWeekButton.addEventListener(
    "click",
    moveToPreviousWeek
);

nextWeekButton.addEventListener(
    "click",
    moveToNextWeek
);

/* =========================
   앱 초기화
   ========================= */

loadTodosFromStorage();

/*
    현재 주를 기준으로
    월요일 계산
*/
currentWeekStartDate =
    getStartOfWeek(
        selectedDate
    );

/*
    주간 카드 렌더링
*/
renderWeekDates();

/*
    Todo 렌더링
*/
renderTodoList();