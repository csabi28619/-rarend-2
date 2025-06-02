async function loadTimetable() {
    try {
        const response = await fetch('órarend.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        displayTimetable(data);
        
        document.getElementById('loading').style.display = 'none';
        document.getElementById('timetable-container').style.display = 'block';
        
    } catch (error) {
        console.error('Error loading timetable:', error);
        document.getElementById('loading').style.display = 'none';
        document.getElementById('error').style.display = 'block';
        document.getElementById('error').textContent = 
            'Hiba az órarend betöltése során: ' + error.message;
    }
}

function displayTimetable(data) {
    const tbody = document.getElementById('timetable-body');
    tbody.innerHTML = '';

    const timeSlots = new Set();
    const days = ['hétfő', 'kedd', 'szerda', 'csütörtök', 'péntek'];
    
    days.forEach(day => {
        if (data[day]) {
            Object.keys(data[day]).forEach(time => timeSlots.add(time));
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
            
            if (data[day] && data[day][timeSlot]) {
                const lesson = data[day][timeSlot];
                const subjectDiv = document.createElement('div');
                subjectDiv.className = 'subject ' + getSubjectClass(lesson.tantárgy || lesson.subject || '');

                const subjectName = lesson.tantárgy || lesson.subject || 'Ismeretlen';
                subjectDiv.innerHTML = `<strong>${subjectName}</strong>`;

                if (lesson.terem || lesson.room) {
                    const roomDiv = document.createElement('div');
                    roomDiv.className = 'room';
                    roomDiv.textContent = `Terem: ${lesson.terem || lesson.room}`;
                    subjectDiv.appendChild(roomDiv);
                }

                if (lesson.tanár || lesson.teacher) {
                    const teacherDiv = document.createElement('div');
                    teacherDiv.className = 'teacher';
                    teacherDiv.textContent = lesson.tanár || lesson.teacher;
                    subjectDiv.appendChild(teacherDiv);
                }
                
                dayCell.appendChild(subjectDiv);
            }
            
            row.appendChild(dayCell);
        });
        
        tbody.appendChild(row);
    });
}

function getSubjectClass(subject) {
    const subjectLower = subject.toLowerCase();
    
    if (subjectLower.includes('matek') || subjectLower.includes('math')) return 'math';
    if (subjectLower.includes('fizika') || subjectLower.includes('kémia') || subjectLower.includes('biológia')) return 'science';
    if (subjectLower.includes('magyar') || subjectLower.includes('angol') || subjectLower.includes('német')) return 'language';
    if (subjectLower.includes('történelem') || subjectLower.includes('földrajz')) return 'history';
    if (subjectLower.includes('testnevelés') || subjectLower.includes('sport')) return 'pe';
    if (subjectLower.includes('rajz') || subjectLower.includes('művészet') || subjectLower.includes('zene')) return 'art';
    
    return '';
}

document.addEventListener('DOMContentLoaded', loadTimetable);
