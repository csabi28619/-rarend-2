let timetableData = {};
let tasksData = [];
let editingTaskId = null;
let editingLessonKey = null;

document.addEventListener('DOMContentLoaded', function() {
    loadFromLocalStorage();
    renderTimetable();
    renderTasks();
    updateSubjectFilter();
});

function showTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(tabName + '-tab').classList.add('active');
}

function saveToLocalStorage() {
    localStorage.setItem('timetableData', JSON.stringify(timetableData));
    localStorage.setItem('tasksData', JSON.stringify(tasksData));
}

function loadFromLocalStorage() {
    const savedTimetable = localStorage.getItem('timetableData');
    const savedTasks = localStorage.getItem('tasksData');
    
    if (savedTimetable) {
        timetableData = JSON.parse(savedTimetable);
    }
    
    if (savedTasks) {
        tasksData = JSON.parse(savedTasks);
    }
}

function renderTimetable() {
    const tbody = document.getElementById('timetable-body');
    tbody.innerHTML = '';
    
    const timeSlots = new Set();
    const days = ['hétfő', 'kedd', 'szerda', 'csütörtök', 'péntek'];
    
    days.forEach(day => {
        if (timetableData[day]) {
            Object.keys(timetableData[day]).forEach(time => timeSlots.add(time));
        }
    });
    
    const sortedTimeSlots = Array.from(timeSlots).sort();
    
    sortedTimeSlots.forEach(timeSlot => {
        const row = document.createElement('tr');
        
        const timeCell = document.createElement('td');
        timeCell.className = 'time-slot';
        timeCell.textContent = timeSlot;
        row.appendChild(timeCell);
        
        days.forEach(day => {
            const dayCell = document.createElement('td');
            
            if (timetableData[day] && timetableData[day][timeSlot]) {
                const lesson = timetableData[day][timeSlot];
                const lessonDiv = document.createElement('div');
                lessonDiv.className = 'lesson';
                lessonDiv.innerHTML = `
                    <div><strong>${lesson.tantárgy}</strong></div>
                    <div style="font-size: 0.8rem;">${lesson.tanár}</div>
                    <div style="font-size: 0.8rem;">${lesson.terem}</div>
                    <div class="lesson-actions">
                        <button class="action-btn" onclick="editLesson('${day}', '${timeSlot}')">✏️</button>
                        <button class="action-btn" onclick="deleteLesson('${day}', '${timeSlot}')">🗑️</button>
                    </div>
                `;
                dayCell.appendChild(lessonDiv);
            }
            
            row.appendChild(dayCell);
        });
        
        tbody.appendChild(row);
    });
}

function showAddTimetableForm() {
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <h3>Új óra hozzáadása</h3>
        <form id="timetable-form">
            <div class="form-group">
                <label for="lesson-day">Nap:</label>
                <select id="lesson-day" required>
                    <option value="">Válassz napot</option>
                    <option value="hétfő">Hétfő</option>
                    <option value="kedd">Kedd</option>
                    <option value="szerda">Szerda</option>
                    <option value="csütörtök">Csütörtök</option>
                    <option value="péntek">Péntek</option>
                </select>
            </div>
            <div class="form-group">
                <label for="lesson-time">Időpont:</label>
                <input type="text" id="lesson-time" placeholder="pl. 08:00-08:45" required>
            </div>
            <div class="form-group">
                <label for="lesson-subject">Tantárgy:</label>
                <input type="text" id="lesson-subject" required>
            </div>
            <div class="form-group">
                <label for="lesson-teacher">Tanár:</label>
                <input type="text" id="lesson-teacher" required>
            </div>
            <div class="form-group">
                <label for="lesson-room">Terem:</label>
                <input type="text" id="lesson-room" required>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-cancel" onclick="closeModal()">Mégse</button>
                <button type="submit" class="btn btn-save">Mentés</button>
            </div>
        </form>
    `;
    
    document.getElementById('modal').style.display = 'block';
    
    document.getElementById('timetable-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveTimetableEntry();
    });
}

function saveTimetableEntry() {
    const day = document.getElementById('lesson-day').value;
    const time = document.getElementById('lesson-time').value;
    const subject = document.getElementById('lesson-subject').value;
    const teacher = document.getElementById('lesson-teacher').value;
    const room = document.getElementById('lesson-room').value;
    
    if (!timetableData[day]) {
        timetableData[day] = {};
    }
    
    timetableData[day][time] = {
        tantárgy: subject,
        tanár: teacher,
        terem: room
    };
    
    saveToLocalStorage();
    renderTimetable();
    updateSubjectFilter();
    closeModal();
}

function editLesson(day, time) {
    editingLessonKey = { day, time };
    const lesson = timetableData[day][time];
    
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <h3>Óra szerkesztése</h3>
        <form id="timetable-form">
            <div class="form-group">
                <label for="lesson-day">Nap:</label>
                <select id="lesson-day" required>
                    <option value="hétfő" ${day === 'hétfő' ? 'selected' : ''}>Hétfő</option>
                    <option value="kedd" ${day === 'kedd' ? 'selected' : ''}>Kedd</option>
                    <option value="szerda" ${day === 'szerda' ? 'selected' : ''}>Szerda</option>
                    <option value="csütörtök" ${day === 'csütörtök' ? 'selected' : ''}>Csütörtök</option>
                    <option value="péntek" ${day === 'péntek' ? 'selected' : ''}>Péntek</option>
                </select>
            </div>
            <div class="form-group">
                <label for="lesson-time">Időpont:</label>
                <input type="text" id="lesson-time" value="${time}" required>
            </div>
            <div class="form-group">
                <label for="lesson-subject">Tantárgy:</label>
                <input type="text" id="lesson-subject" value="${lesson.tantárgy}" required>
            </div>
            <div class="form-group">
                <label for="lesson-teacher">Tanár:</label>
                <input type="text" id="lesson-teacher" value="${lesson.tanár}" required>
            </div>
            <div class="form-group">
                <label for="lesson-room">Terem:</label>
                <input type="text" id="lesson-room" value="${lesson.terem}" required>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-cancel" onclick="closeModal()">Mégse</button>
                <button type="submit" class="btn btn-save">Mentés</button>
            </div>
        </form>
    `;
    
    document.getElementById('modal').style.display = 'block';
    
    document.getElementById('timetable-form').addEventListener('submit', function(e) {
        e.preventDefault();
        updateTimetableEntry();
    });
}

function updateTimetableEntry() {
    const oldDay = editingLessonKey.day;
    const oldTime = editingLessonKey.time;
    
    const newDay = document.getElementById('lesson-day').value;
    const newTime = document.getElementById('lesson-time').value;
    const subject = document.getElementById('lesson-subject').value;
    const teacher = document.getElementById('lesson-teacher').value;
    const room = document.getElementById('lesson-room').value;
    
    delete timetableData[oldDay][oldTime];
    
    if (!timetableData[newDay]) {
        timetableData[newDay] = {};
    }
    
    timetableData[newDay][newTime] = {
        tantárgy: subject,
        tanár: teacher,
        terem: room
    };
    
    saveToLocalStorage();
    renderTimetable();
    updateSubjectFilter();
    closeModal();
    editingLessonKey = null;
}

function deleteLesson(day, time) {
    if (confirm('Biztosan törölni szeretnéd ezt az órát?')) {
        delete timetableData[day][time];
        saveToLocalStorage();
        renderTimetable();
        updateSubjectFilter();
    }
}

function renderTasks() {
    const container = document.getElementById('tasks-list');
    const filteredTasks = getFilteredTasks();
    
    if (filteredTasks.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #7f8c8d; padding: 40px;">Nincsenek teendők</div>';
        return;
    }
    
    container.innerHTML = filteredTasks.map(task => {
        const isOverdue = new Date(task.határidő) < new Date() && task.státusz === 'nem kész';
        const taskClass = task.státusz === 'kész' ? 'completed' : (isOverdue ? 'overdue' : '');
        
        return `
            <div class="task-item ${taskClass}">
                <div class="task-header">
                    <span class="task-type ${task.típus.replace(' ', '-')}">${getTaskTypeIcon(task.típus)} ${task.típus}</span>
                    <div class="task-actions">
                        <button class="action-btn" onclick="editTask(${task.id})">✏️</button>
                        <button class="action-btn" onclick="deleteTask(${task.id})">🗑️</button>
                    </div>
                </div>
                <div class="task-details">
                    <div class="task-detail">
                        <span>📚</span>
                        <span>${task.tantárgy}</span>
                    </div>
                    <div class="task-detail">
                        <span>📅</span>
                        <span>${formatDate(task.határidő)}</span>
                    </div>
                    <div class="task-detail">
                        <button class="status-toggle ${task.státusz === 'kész' ? 'completed' : ''}"
                                 onclick="toggleTaskStatus(${task.id})">
                            ${task.státusz === 'kész' ? '✅ Kész' : '⏳ Nem kész'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function getTaskTypeIcon(type) {
    switch(type) {
        case 'házi feladat': return '📝';
        case 'dolgozat': return '📋';
        case 'egyéb': return '📌';
        default: return '📌';
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('hu-HU');
}

function getFilteredTasks() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const typeFilter = document.getElementById('filter-type').value;
    const statusFilter = document.getElementById('filter-status').value;
    const subjectFilter = document.getElementById('filter-subject').value;
    
    return tasksData.filter(task => {
        const matchesSearch = task.tantárgy.toLowerCase().includes(searchTerm);
        const matchesType = !typeFilter || task.típus === typeFilter;
        const matchesStatus = !statusFilter || task.státusz === statusFilter;
        const matchesSubject = !subjectFilter || task.tantárgy === subjectFilter;
        
        return matchesSearch && matchesType && matchesStatus && matchesSubject;
    });
}

function filterTasks() {
    renderTasks();
}

function showAddTaskForm() {
    editingTaskId = null;
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <h3>Új teendő hozzáadása</h3>
        <form id="task-form">
            <div class="form-group">
                <label for="task-type">Típus:</label>
                <select id="task-type" required>
                    <option value="">Válassz típust</option>
                    <option value="házi feladat">📝 Házi feladat</option>
                    <option value="dolgozat">📋 Dolgozat</option>
                    <option value="egyéb">📌 Egyéb</option>
                </select>
            </div>
            <div class="form-group">
                <label for="task-subject">Tantárgy:</label>
                <input type="text" id="task-subject" required>
            </div>
            <div class="form-group">
                <label for="task-deadline">Határidő:</label>
                <input type="date" id="task-deadline" required>
            </div>
            <div class="form-group">
                <label for="task-status">Státusz:</label>
                <select id="task-status" required>
                    <option value="nem kész">⏳ Nem kész</option>
                    <option value="kész">✅ Kész</option>
                </select>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-cancel" onclick="closeModal()">Mégse</button>
                <button type="submit" class="btn btn-save">Mentés</button>
            </div>
        </form>
    `;
    
    document.getElementById('modal').style.display = 'block';
    
    document.getElementById('task-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveTask();
    });
}

function editTask(taskId) {
    editingTaskId = taskId;
    const task = tasksData.find(t => t.id === taskId);
    
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <h3>Teendő szerkesztése</h3>
        <form id="task-form">
            <div class="form-group">
                <label for="task-type">Típus:</label>
                <select id="task-type" required>
                    <option value="házi feladat" ${task.típus === 'házi feladat' ? 'selected' : ''}>📝 Házi feladat</option>
                    <option value="dolgozat" ${task.típus === 'dolgozat' ? 'selected' : ''}>📋 Dolgozat</option>
                    <option value="egyéb" ${task.típus === 'egyéb' ? 'selected' : ''}>📌 Egyéb</option>
                </select>
            </div>
            <div class="form-group">
                <label for="task-subject">Tantárgy:</label>
                <input type="text" id="task-subject" value="${task.tantárgy}" required>
            </div>
            <div class="form-group">
                <label for="task-deadline">Határidő:</label>
                <input type="date" id="task-deadline" value="${task.határidő}" required>
            </div>
            <div class="form-group">
                <label for="task-status">Státusz:</label>
                <select id="task-status" required>
                    <option value="nem kész" ${task.státusz === 'nem kész' ? 'selected' : ''}>⏳ Nem kész</option>
                    <option value="kész" ${task.státusz === 'kész' ? 'selected' : ''}>✅ Kész</option>
                </select>
            </div>
            <div class="form-actions">
                <button type="button" class="btn btn-cancel" onclick="closeModal()">Mégse</button>
                <button type="submit" class="btn btn-save">Mentés</button>
            </div>
        </form>
    `;
    
    document.getElementById('modal').style.display = 'block';
    
    document.getElementById('task-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveTask();
    });
}

function saveTask() {
    const type = document.getElementById('task-type').value;
    const subject = document.getElementById('task-subject').value;
    const deadline = document.getElementById('task-deadline').value;
    const status = document.getElementById('task-status').value;
    
    const taskData = {
        típus: type,
        tantárgy: subject,
        határidő: deadline,
        státusz: status
    };
    
    if (editingTaskId) {
        const taskIndex = tasksData.findIndex(t => t.id === editingTaskId);
        tasksData[taskIndex] = { ...taskData, id: editingTaskId };
    } else {
        const newId = tasksData.length > 0 ? Math.max(...tasksData.map(t => t.id)) + 1 : 1;
        tasksData.push({ ...taskData, id: newId });
    }
    
    saveToLocalStorage();
    renderTasks();
    updateSubjectFilter();
    closeModal();
}

function deleteTask(taskId) {
    if (confirm('Biztosan törölni szeretnéd ezt a teendőt?')) {
        tasksData = tasksData.filter(t => t.id !== taskId);
        saveToLocalStorage();
        renderTasks();
        updateSubjectFilter();
    }
}

function toggleTaskStatus(taskId) {
    const task = tasksData.find(t => t.id === taskId);
    task.státusz = task.státusz === 'kész' ? 'nem kész' : 'kész';
    saveToLocalStorage();
    renderTasks();
}

function updateSubjectFilter() {
    const subjectFilter = document.getElementById('filter-subject');
    const subjects = new Set();
    
    Object.values(timetableData).forEach(day => {
        Object.values(day).forEach(lesson => {
            subjects.add(lesson.tantárgy);
        });
    });
    
    tasksData.forEach(task => {
        subjects.add(task.tantárgy);
    });
    
    const currentValue = subjectFilter.value;
    subjectFilter.innerHTML = '<option value="">Minden tantárgy</option>';
    
    Array.from(subjects).sort().forEach(subject => {
        const option = document.createElement('option');
        option.value = subject;
        option.textContent = subject;
        if (subject === currentValue) option.selected = true;
        subjectFilter.appendChild(option);
    });
}

function exportTimetable() {
    let csvContent = '';
    Object.entries(timetableData).forEach(([day, times]) => {
        Object.entries(times).forEach(([time, lesson]) => {
            csvContent += `${day};${time};${lesson.tantárgy};${lesson.tanár};${lesson.terem}\n`;
        });
    });
    
    downloadFile('orarend.txt', csvContent);
}

function exportTasks() {
    let csvContent = '';
    tasksData.forEach(task => {
        csvContent += `${task.típus};${task.tantárgy};${task.határidő};${task.státusz}\n`;
    });
    
    downloadFile('teendok.txt', csvContent);
}

function downloadFile(filename, content) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function importTimetable() {
    const file = document.getElementById('import-timetable').files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        const lines = content.split('\n').filter(line => line.trim());
        
        timetableData = {};
        lines.forEach(line => {
            const [day, time, subject, teacher, room] = line.split(';');
            if (day && time && subject && teacher && room) {
                if (!timetableData[day]) timetableData[day] = {};
                timetableData[day][time] = {
                    tantárgy: subject,
                    tanár: teacher,
                    terem: room
                };
            }
        });
        
        saveToLocalStorage();
        renderTimetable();
        updateSubjectFilter();
        alert('Órarend sikeresen importálva!');
    };
    reader.readAsText(file);
}

function importTasks() {
    const file = document.getElementById('import-tasks').files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        const lines = content.split('\n').filter(line => line.trim());
        
        tasksData = [];
        lines.forEach((line, index) => {
            const [type, subject, deadline, status] = line.split(';');
            if (type && subject && deadline && status) {
                tasksData.push({
                    id: index + 1,
                    típus: type,
                    tantárgy: subject,
                    határidő: deadline,
                    státusz: status
                });
            }
        });
        
        saveToLocalStorage();
        renderTasks();
        updateSubjectFilter();
        alert('Teendők sikeresen importálva!');
    };
    reader.readAsText(file);
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
    editingTaskId = null;
    editingLessonKey = null;
}

window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
}
