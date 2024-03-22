let currentDate = new Date();

async function fetchTasksForMonth(month, year) {
    try {
        const currentUser = Parse.User.current();
        if (!currentUser) {
            // Redirect user to login page if not logged in
            window.location.href = 'login-page.html';
            return [];
        }

        const Task = Parse.Object.extend('Task');
        const query = new Parse.Query(Task);
        query.equalTo('user', currentUser);

        // Set up date range for the current month based on the user's local time zone
        const startOfMonth = new Date(year, month, 1);
        startOfMonth.setUTCHours(0, 0, 0, 0);
        const endOfMonth = new Date(year, month + 1, 0);
        endOfMonth.setUTCHours(23, 59, 59, 999);

        query.greaterThanOrEqualTo('dueDate', startOfMonth);
        query.lessThan('dueDate', endOfMonth);

        const tasks = await query.find();
        return tasks.map(task => ({
            title: task.get('title'),
            description: task.get('description'),
            dueDate: new Date(task.get('dueDate').getTime() + task.get('dueDate').getTimezoneOffset() * 60 * 1000),
            priority: task.get('priority'),
            category: task.get('category')
        }));
    } catch (error) {
        console.error('Error fetching tasks:', error);
        return [];
    }
}

async function generateCalendar() {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const calendarBody = document.getElementById('calendar-body');
    calendarBody.innerHTML = '';

    // Set current month and year in the header
    document.getElementById('current-month-year').textContent = `${getMonthName(month)} ${year}`;

    const totalDays = daysInMonth(month, year);
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    let row = document.createElement('tr');

    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyCell = document.createElement('td');
        row.appendChild(emptyCell);
    }

    let currentColumn = firstDayOfMonth;
    const tasks = await fetchTasksForMonth(month, year);
    for (let day = 1; day <= totalDays; day++) {
        const cell = document.createElement('td');
        cell.textContent = day;

        // Filter tasks for the current day
        const date = new Date(year, month, day);
        date.setHours(0, 0, 0, 0);
        const tasksForDay = tasks.filter(task => {
            const taskDate = new Date(task.dueDate);
            taskDate.setHours(0, 0, 0, 0);
            return taskDate.getTime() === date.getTime();
        });

        if (tasksForDay.length > 0) {
            cell.classList.add('highlight');
            cell.addEventListener('click', () => {
                let taskInfo = '';
                tasksForDay.forEach(task => {
                    taskInfo += `Title: ${task.title}\nDescription: ${task.description}\nPriority: ${task.priority}\nCategory: ${task.category}\n\n`;
                });
                alert(taskInfo);
            });
        }

        row.appendChild(cell);
        currentColumn++;

        // Move to the next row if it's the end of the week or the last day of the month
        if (currentColumn % 7 === 0 || day === totalDays) {
            calendarBody.appendChild(row);
            row = document.createElement('tr');
            currentColumn = 0;
        }
    }
}

function getMonthName(month) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    return monthNames[month];
}

function daysInMonth(month, year) {
    return new Date(year, month + 1, 0).getDate();
}


document.addEventListener('DOMContentLoaded', async function () {
    // Initialize Parse SDK for Back4App
    Parse.initialize('yArd5jI5uzEul4ob6EsljpN9okK0pzy4ttt994Ky', '7hmaVfjipCJYzGFijg6SqXxpgepy4KfBjmzWkX09');
    Parse.serverURL = 'https://parseapi.back4app.com/';
    

    // Generate calendar for current month and year
    generateCalendar();

    // Previous month button event listener
    document.getElementById('prev-month-btn').addEventListener('click', async () => {
        currentDate.setMonth(currentDate.getMonth() - 1); // Move to previous month
        generateCalendar();
    });

    // Next month button event listener
    document.getElementById('next-month-btn').addEventListener('click', async () => {
        currentDate.setMonth(currentDate.getMonth() + 1); // Move to next month
        generateCalendar();
    });
});
