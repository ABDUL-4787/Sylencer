// Function to show/hide sections
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show the requested section
    document.getElementById(sectionId).classList.add('active');
}

// File upload handling
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('audioFile');
const uploadStatus = document.getElementById('uploadStatus');

// Initialize if elements exist
if (dropZone && fileInput) {
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = 'var(--secondary)';
        dropZone.style.backgroundColor = '#f9f9f9';
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.style.borderColor = '#ccc';
        dropZone.style.backgroundColor = 'transparent';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#ccc';
        dropZone.style.backgroundColor = 'transparent';
        
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            updateUploadStatus();
        }
    });

    fileInput.addEventListener('change', updateUploadStatus);
}

function updateUploadStatus() {
    if (fileInput.files.length) {
        const file = fileInput.files[0];
        uploadStatus.innerHTML = `
            <div class="status-success">
                <p><strong>Selected file:</strong> ${file.name}</p>
                <p><strong>File type:</strong> ${file.type || 'unknown'}</p>
                <p><strong>File size:</strong> ${(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
        `;
    }
}

// Analysis function
function analyzeSound() {
    if (!fileInput || !fileInput.files.length) {
        uploadStatus.innerHTML = `
            <div class="status-error">
                Please select an audio file first.
            </div>
        `;
        return;
    }

    uploadStatus.innerHTML = `
        <div class="status-loading">
            <p>Analyzing sound file... <i class="fas fa-spinner fa-spin"></i></p>
        </div>
    `;

    // Create FormData object to send file to server
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    // Send to Flask backend
    fetch('/analyze', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            displayResults(data.results);
            // Switch to results section
            showSection('resultsSection');
        } else {
            uploadStatus.innerHTML = `
                <div class="status-error">
                    Error: ${data.message}
                </div>
            `;
        }
    })
    .catch(error => {
        uploadStatus.innerHTML = `
            <div class="status-error">
                Error: ${error.message}
            </div>
        `;
    });
}

function displayResults(results) {
    // Format and display results
    let resultsHTML = '';
    
    results.forEach(result => {
        resultsHTML += `
            <div class="result-card">
                <div class="result-icon">
                    <i class="fas ${result.icon}"></i>
                </div>
                <div class="result-content">
                    <h3>${result.component}</h3>
                    <p>Predicted deterioration timeline: ${result.timeline}</p>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${result.health}%;"></div>
                    </div>
                    <p>Current health: ${result.health}% | Recommendation: ${result.recommendation}</p>
                </div>
            </div>
        `;
    });
    
    document.getElementById('resultContainer').innerHTML = resultsHTML;
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Show the upload section by default if we're on the index page
    if (document.getElementById('uploadSection')) {
        showSection('uploadSection');
    }
});