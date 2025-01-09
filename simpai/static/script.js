document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('upload-form');
    const fileInput = document.getElementById('file-input');
    const uploadStatus = document.getElementById('upload-status');
    const previewSection = document.getElementById('preview-section');
    const previewTable = document.getElementById('preview-table');
    const analyzeSection = document.getElementById('analyze-section');
    const analyzeButton = document.getElementById('analyze-button');
    const analysisResult = document.getElementById('analysis-result');
    const chartSection = document.getElementById('chart-section');
    const generateChartButton = document.getElementById('generate-chart-button');
    const chartContainer = document.getElementById('chart-container');
    const askSection = document.getElementById('ask-section');
    const questionInput = document.getElementById('question-input');
    const askButton = document.getElementById('ask-button');
    const answerResult = document.getElementById('answer-result');

    let fileId = null;

    uploadForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);

        fetch('/csv/upload/', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                uploadStatus.textContent = `Error: ${data.error}`;
            } else {
                uploadStatus.textContent = 'File uploaded successfully!';
                fileId = data.file_id;
                previewSection.style.display = 'block';
                analyzeSection.style.display = 'block';
                chartSection.style.display = 'block';
                askSection.style.display = 'block';
                displayPreview(data.preview);
            }
        })
        .catch(error => {
            uploadStatus.textContent = `Error: ${error.message}`;
        });
    });

    analyzeButton.addEventListener('click', function() {
        fetch('/csv/analyze/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ file_id: fileId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                analysisResult.textContent = `Error: ${data.error}`;
            } else {
                analysisResult.textContent = `Chart Suggestion: ${data.chart_suggestion}`;
            }
        })
        .catch(error => {
            analysisResult.textContent = `Error: ${error.message}`;
        });
    });

    generateChartButton.addEventListener('click', function() {
        const sampleSize = document.getElementById('sample-size-input').value || 1000; // Default to 1000 if no value is provided
    
        fetch('/csv/chart/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ 
                file_id: fileId, 
                sample_size: sampleSize  // Send the sample size to the backend
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                chartContainer.textContent = `Error: ${data.error}`;
            } else {
                chartContainer.innerHTML = '';
                for (const [chartName, chartImage] of Object.entries(data.charts)) {
                    const img = document.createElement('img');
                    img.src = `data:image/png;base64,${chartImage}`;
                    img.alt = chartName;
                    chartContainer.appendChild(img);
                }
            }
        })
        .catch(error => {
            chartContainer.textContent = `Error: ${error.message}`;
        });
    });
    
    askButton.addEventListener('click', function() {
        const question = questionInput.value;
        fetch('/csv/ask/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ file_id: fileId, question: question })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                answerResult.textContent = `Error: ${data.error}`;
            } else {
                answerResult.textContent = `Answer: ${data.answer}`;
            }
        })
        .catch(error => {
            answerResult.textContent = `Error: ${error.message}`;
        });
    });

    function displayPreview(preview) {
        previewTable.innerHTML = '';
        const headers = Object.keys(preview[0]);
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        previewTable.appendChild(headerRow);

        preview.forEach(row => {
            const tr = document.createElement('tr');
            headers.forEach(header => {
                const td = document.createElement('td');
                td.textContent = row[header];
                tr.appendChild(td);
            });
            previewTable.appendChild(tr);
        });
    }

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});