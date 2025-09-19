// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Profile Image Upload
const profileImageInput = document.getElementById('profileImageInput');
const profileImagePlaceholder = document.getElementById('profileImagePlaceholder');
const profileImage = document.getElementById('profileImage');

profileImagePlaceholder?.addEventListener('click', () => {
    profileImageInput.click();
});

profileImageInput?.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            profileImage.src = event.target.result;
            profileImage.style.display = 'block';
            profileImagePlaceholder.style.display = 'none';

            // Save to localStorage
            localStorage.setItem('profileImage', event.target.result);
        };
        reader.readAsDataURL(file);
    }
});

// Load saved profile image
window.addEventListener('load', () => {
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
        profileImage.src = savedImage;
        profileImage.style.display = 'block';
        profileImagePlaceholder.style.display = 'none';
    }
});

// Resume Upload
const resumeInput = document.getElementById('resumeInput');
const resumePreview = document.getElementById('resumePreview');
const resumeFileName = document.getElementById('resumeFileName');
const resumeDownload = document.getElementById('resumeDownload');

resumeInput?.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        resumeFileName.textContent = file.name;
        resumePreview.style.display = 'block';

        // Create download link
        const url = URL.createObjectURL(file);
        resumeDownload.href = url;
        resumeDownload.download = file.name;

        // Save file info to localStorage
        const fileInfo = {
            name: file.name,
            type: file.type,
            size: file.size
        };
        localStorage.setItem('resumeInfo', JSON.stringify(fileInfo));

        showNotification('Resume uploaded successfully!', 'success');
    }
});

// Artifacts Upload
for (let i = 1; i <= 3; i++) {
    const input = document.getElementById(`artifact${i}Input`);
    const preview = document.getElementById(`artifact${i}Preview`);
    const fileName = document.getElementById(`artifact${i}FileName`);
    const download = document.getElementById(`artifact${i}Download`);

    input?.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            fileName.textContent = file.name;
            preview.style.display = 'block';

            // Create download link
            const url = URL.createObjectURL(file);
            download.href = url;
            download.download = file.name;

            // Save file info to localStorage
            const fileInfo = {
                name: file.name,
                type: file.type,
                size: file.size
            };
            localStorage.setItem(`artifact${i}Info`, JSON.stringify(fileInfo));

            showNotification(`Artifact ${i} uploaded successfully!`, 'success');
        }
    });
}

// LinkedIn Profile Update
function updateLinkedIn() {
    const linkedinUrl = document.getElementById('linkedinUrl').value;
    if (linkedinUrl) {
        // Update all LinkedIn links
        const linkedinLinks = document.querySelectorAll('a[href*="linkedin"]');
        linkedinLinks.forEach(link => {
            link.href = linkedinUrl;
        });

        // Save to localStorage
        localStorage.setItem('linkedinUrl', linkedinUrl);

        showNotification('LinkedIn profile updated successfully!', 'success');
    } else {
        showNotification('Please enter a valid LinkedIn URL.', 'error');
    }
}

// Timeline Management
function saveTimeline() {
    const timelineData = [];

    for (let i = 1; i <= 5; i++) {
        const date = document.getElementById(`timeline${i}Date`).value;
        const title = document.getElementById(`timeline${i}Title`).value;
        const description = document.getElementById(`timeline${i}Description`).value;

        if (date || title || description) {
            timelineData.push({
                date,
                title,
                description
            });
        }
    }

    if (timelineData.length > 0) {
        localStorage.setItem('timelineData', JSON.stringify(timelineData));
        showNotification('Timeline saved successfully!', 'success');
    } else {
        showNotification('Please fill in at least one timeline event.', 'error');
    }
}

// Reflection File Upload Management
const reflectionInput = document.getElementById('reflectionInput');
const reflectionPreview = document.getElementById('reflectionPreview');
const reflectionFileName = document.getElementById('reflectionFileName');
const reflectionFileSize = document.getElementById('reflectionFileSize');
const reflectionDownload = document.getElementById('reflectionDownload');

// Handle reflection file upload
reflectionInput?.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        handleReflectionFileUpload(file);
    }
});

function handleReflectionFileUpload(file) {
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
        showNotification('Please upload a PDF, DOC, or DOCX file for your reflection essay.', 'error');
        return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
        showNotification('File size must be less than 10MB.', 'error');
        return;
    }

    // Create file preview
    const fileReader = new FileReader();
    fileReader.onload = function (e) {
        // Save file data to localStorage (base64)
        const reflectionData = {
            name: file.name,
            size: formatFileSize(file.size),
            type: file.type,
            data: e.target.result,
            uploadDate: new Date().toISOString()
        };

        localStorage.setItem('reflectionFile', JSON.stringify(reflectionData));
        displayReflectionPreview(reflectionData);
        showNotification('Reflection essay uploaded successfully!', 'success');
    };

    fileReader.readAsDataURL(file);
}

function displayReflectionPreview(fileData) {
    reflectionFileName.textContent = fileData.name;
    if (reflectionFileSize) {
        reflectionFileSize.textContent = fileData.size;
    }

    // Set up download link
    reflectionDownload.href = fileData.data;
    reflectionDownload.download = fileData.name;

    // Show preview section
    reflectionPreview.style.display = 'block';
}

function viewReflection() {
    const savedFile = localStorage.getItem('reflectionFile');
    if (savedFile) {
        const fileData = JSON.parse(savedFile);
        // Create a temporary URL for viewing
        const blob = dataURItoBlob(fileData.data);
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');

        // Clean up the URL after a delay
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        showNotification('Opening reflection essay...', 'info');
    } else {
        showNotification('No reflection essay found. Please upload your essay first.', 'error');
    }
}

function removeReflection() {
    if (confirm('Are you sure you want to remove the uploaded reflection essay?')) {
        localStorage.removeItem('reflectionFile');
        reflectionPreview.style.display = 'none';
        reflectionInput.value = '';
        showNotification('Reflection essay removed successfully!', 'success');
    }
}

// Helper function to convert data URI to blob
function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}

// Load saved reflection file data
function loadReflectionData() {
    const savedFile = localStorage.getItem('reflectionFile');
    if (savedFile) {
        try {
            const fileData = JSON.parse(savedFile);
            displayReflectionPreview(fileData);
        } catch (error) {
            console.error('Error loading reflection file:', error);
            localStorage.removeItem('reflectionFile');
        }
    }
}

// Floating Action Button - Scroll to Reflection
function scrollToReflection() {
    const reflectionSection = document.getElementById('reflection');
    if (reflectionSection) {
        reflectionSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        // Add a subtle highlight effect
        reflectionSection.style.animation = 'highlightSection 2s ease';
        setTimeout(() => {
            reflectionSection.style.animation = '';
        }, 2000);

        showNotification('Navigated to Leadership Reflection Essay section', 'info');
    }
}

// Add highlight animation for sections
const highlightStyles = `
    @keyframes highlightSection {
        0% { background: transparent; }
        20% { background: rgba(37, 99, 235, 0.05); }
        100% { background: transparent; }
    }
`;

if (!document.querySelector('#highlight-styles')) {
    const style = document.createElement('style');
    style.id = 'highlight-styles';
    style.textContent = highlightStyles;
    document.head.appendChild(style);
}

// Reflection Essay Management
let reflectionEditMode = false;

function toggleReflectionEdit() {
    const reflectionDisplay = document.querySelector('.reflection-content-display');
    const essayBody = document.getElementById('reflectionEssayContent');
    const editBtn = document.getElementById('reflectionEditBtn');

    reflectionEditMode = !reflectionEditMode;

    if (reflectionEditMode) {
        reflectionDisplay.classList.add('reflection-edit-mode');
        essayBody.contentEditable = true;
        editBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
        editBtn.style.background = 'rgba(34, 197, 94, 0.2)';
        editBtn.style.borderColor = 'rgba(34, 197, 94, 0.5)';
        showNotification('Edit mode enabled. Click on the essay content to edit.', 'info');
    } else {
        reflectionDisplay.classList.remove('reflection-edit-mode');
        essayBody.contentEditable = false;
        editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit Essay';
        editBtn.style.background = 'rgba(255, 255, 255, 0.2)';
        editBtn.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        saveReflectionEssay();
        updateWordCount();
    }
}

function saveReflectionEssay() {
    const essayContent = document.getElementById('reflectionEssayContent');
    if (essayContent) {
        const content = essayContent.innerHTML;
        localStorage.setItem('reflectionEssayContent', content);
        showNotification('Reflection essay saved successfully!', 'success');
        updateWordCount();
    }
}

function updateWordCount() {
    const essayBody = document.getElementById('reflectionEssayContent');
    const wordCountDisplay = document.getElementById('essayWordCount');

    if (essayBody && wordCountDisplay) {
        const text = essayBody.innerText || essayBody.textContent || '';
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        const count = words.length;

        wordCountDisplay.textContent = `Word count: ${count} words`;

        // Color coding based on word count
        if (count < 500) {
            wordCountDisplay.style.color = '#dc2626'; // Red
        } else if (count >= 500 && count <= 1000) {
            wordCountDisplay.style.color = '#059669'; // Green
        } else {
            wordCountDisplay.style.color = '#d97706'; // Orange
        }
    }
}

function printReflection() {
    // Hide non-essential elements for printing
    const elementsToHide = [
        '.navbar', '.hero', '.about', '.resume', '.artifacts',
        '.timeline', '.contact', '.footer', '.floating-action-btn'
    ];

    elementsToHide.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            element.style.display = 'none';
        }
    });

    // Print
    window.print();

    // Restore hidden elements
    elementsToHide.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            element.style.display = '';
        }
    });
}

// Auto-save essay content on input
document.addEventListener('DOMContentLoaded', () => {
    const essayContent = document.getElementById('reflectionEssayContent');

    if (essayContent) {
        // Load saved content
        const savedContent = localStorage.getItem('reflectionEssayContent');
        if (savedContent) {
            essayContent.innerHTML = savedContent;
        }

        // Auto-save on input
        essayContent.addEventListener('input', () => {
            updateWordCount();
            // Auto-save after 3 seconds of no typing
            clearTimeout(window.essayAutoSaveTimeout);
            window.essayAutoSaveTimeout = setTimeout(() => {
                saveReflectionEssay();
            }, 3000);
        });

        // Initial word count update
        updateWordCount();
    }
});

// Contact Information Management
function saveContact() {
    const email = document.getElementById('contactEmail').value;
    const phone = document.getElementById('contactPhone').value;
    const location = document.getElementById('contactLocation').value;

    const contactInfo = {
        email,
        phone,
        location
    };

    localStorage.setItem('contactInfo', JSON.stringify(contactInfo));
    showNotification('Contact information saved successfully!', 'success');
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    // Add notification styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
                border-radius: 8px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                animation: slideInRight 0.3s ease;
            }
            
            .notification-success {
                background: #10b981;
                color: white;
            }
            
            .notification-error {
                background: #ef4444;
                color: white;
            }
            
            .notification-info {
                background: #3b82f6;
                color: white;
            }
            
            .notification-content {
                padding: 1rem 1.5rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: inherit;
                cursor: pointer;
                margin-left: 1rem;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Add to document
    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Load saved data on page load
window.addEventListener('load', () => {
    // Load LinkedIn URL
    const savedLinkedIn = localStorage.getItem('linkedinUrl');
    if (savedLinkedIn) {
        document.getElementById('linkedinUrl').value = savedLinkedIn;
        // Update all LinkedIn links
        const linkedinLinks = document.querySelectorAll('a[href*="linkedin"]');
        linkedinLinks.forEach(link => {
            link.href = savedLinkedIn;
        });
    }

    // Load timeline data
    const savedTimeline = localStorage.getItem('timelineData');
    if (savedTimeline) {
        const timelineData = JSON.parse(savedTimeline);
        timelineData.forEach((event, index) => {
            if (index < 5) {
                const i = index + 1;
                document.getElementById(`timeline${i}Date`).value = event.date || '';
                document.getElementById(`timeline${i}Title`).value = event.title || '';
                document.getElementById(`timeline${i}Description`).value = event.description || '';
            }
        });
    }

    // Load reflection essay
    const savedReflection = localStorage.getItem('reflectionEssay');
    if (savedReflection && reflectionContent) {
        reflectionContent.innerHTML = savedReflection;
        // Trigger word count update
        const event = new Event('input', { bubbles: true });
        reflectionContent.dispatchEvent(event);
    }

    // Load contact information
    const savedContact = localStorage.getItem('contactInfo');
    if (savedContact) {
        const contactInfo = JSON.parse(savedContact);
        document.getElementById('contactEmail').value = contactInfo.email || '';
        document.getElementById('contactPhone').value = contactInfo.phone || '';
        document.getElementById('contactLocation').value = contactInfo.location || '';
    }

    // Load file information (display names only, actual files can't be restored)
    const resumeInfo = localStorage.getItem('resumeInfo');
    if (resumeInfo) {
        const info = JSON.parse(resumeInfo);
        document.getElementById('resumeFileName').textContent = info.name;
        document.getElementById('resumePreview').style.display = 'block';
    }

    // Load artifacts information
    for (let i = 1; i <= 3; i++) {
        const artifactInfo = localStorage.getItem(`artifact${i}Info`);
        if (artifactInfo) {
            const info = JSON.parse(artifactInfo);
            document.getElementById(`artifact${i}FileName`).textContent = info.name;
            document.getElementById(`artifact${i}Preview`).style.display = 'block';
        }
    }
});

// Export portfolio data
function exportPortfolio() {
    const portfolioData = {
        linkedinUrl: localStorage.getItem('linkedinUrl'),
        timelineData: localStorage.getItem('timelineData'),
        reflectionEssay: localStorage.getItem('reflectionEssay'),
        contactInfo: localStorage.getItem('contactInfo'),
        profileImage: localStorage.getItem('profileImage'),
        resumeInfo: localStorage.getItem('resumeInfo'),
        artifacts: {
            artifact1: localStorage.getItem('artifact1Info'),
            artifact2: localStorage.getItem('artifact2Info'),
            artifact3: localStorage.getItem('artifact3Info')
        },
        exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(portfolioData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'leadership-portfolio-data.json';
    link.click();
}

// Add export button to the page
document.addEventListener('DOMContentLoaded', () => {
    const exportButton = document.createElement('button');
    exportButton.innerHTML = '<i class="fas fa-download"></i> Export Portfolio Data';
    exportButton.className = 'btn btn-secondary';
    exportButton.style.position = 'fixed';
    exportButton.style.bottom = '20px';
    exportButton.style.left = '20px';
    exportButton.style.zIndex = '1000';
    exportButton.onclick = exportPortfolio;
    document.body.appendChild(exportButton);
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe all sections
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
});

// Print functionality
function printPortfolio() {
    window.print();
}

// Add print styles
const printStyles = `
    @media print {
        .navbar, .hero-buttons, .btn, input, textarea, .upload-overlay, .notification {
            display: none !important;
        }
        
        body {
            font-size: 12pt;
            line-height: 1.4;
            color: #000;
        }
        
        .hero {
            background: none !important;
            color: #000 !important;
            min-height: auto !important;
            padding: 2rem 0 !important;
        }
        
        .hero::before {
            display: none !important;
        }
        
        .section-title {
            font-size: 18pt !important;
            margin: 1rem 0 !important;
        }
        
        .timeline-item {
            break-inside: avoid;
            margin-bottom: 1rem;
        }
        
        .artifact-card, .upload-card {
            break-inside: avoid;
            box-shadow: none !important;
            border: 1px solid #ccc !important;
        }
        
        section {
            padding: 1rem 0 !important;
        }
    }
`;

const printStyleSheet = document.createElement('style');
printStyleSheet.textContent = printStyles;
document.head.appendChild(printStyleSheet);

// Resume Management Functions
let editMode = false;

function toggleEditMode() {
    const resumeContent = document.querySelector('.resume-content');
    const editBtn = document.getElementById('editToggleBtn');

    editMode = !editMode;

    if (editMode) {
        resumeContent.classList.add('edit-mode');
        editBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
        editBtn.style.background = 'rgba(34, 197, 94, 0.2)';
        editBtn.style.borderColor = 'rgba(34, 197, 94, 0.5)';
        showNotification('Edit mode enabled. Click on any section to edit.', 'info');
    } else {
        resumeContent.classList.remove('edit-mode');
        editBtn.innerHTML = '<i class="fas fa-edit"></i> Edit Resume';
        editBtn.style.background = 'rgba(255, 255, 255, 0.2)';
        editBtn.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        saveResume();
    }
}

function saveResume() {
    const resumeData = {
        name: document.getElementById('resumeName')?.innerHTML || '',
        contact: document.getElementById('resumeContact')?.innerHTML || '',
        links: document.getElementById('resumeLinks')?.innerHTML || '',
        professionalSummary: document.getElementById('professionalSummary')?.innerHTML || '',
        education: document.getElementById('education')?.innerHTML || '',
        professionalExperience: document.getElementById('professionalExperience')?.innerHTML || '',
        leadershipExperience: document.getElementById('leadershipExperience')?.innerHTML || '',
        volunteeringExperience: document.getElementById('volunteeringExperience')?.innerHTML || '',
        skills: document.getElementById('skills')?.innerHTML || '',
        references: document.getElementById('references')?.innerHTML || ''
    };

    localStorage.setItem('resumeData', JSON.stringify(resumeData));
    showNotification('Resume saved successfully!', 'success');
}

function printResume() {
    // Hide non-essential elements for printing
    const elementsToHide = [
        '.navbar', '.hero', '.about', '.artifacts',
        '.timeline', '.reflection', '.contact', '.footer'
    ];

    elementsToHide.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            element.style.display = 'none';
        }
    });

    // Print
    window.print();

    // Restore hidden elements
    elementsToHide.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            element.style.display = '';
        }
    });
}

// Load saved resume data
function loadResumeData() {
    const savedResume = localStorage.getItem('resumeData');
    if (savedResume) {
        const resumeData = JSON.parse(savedResume);

        Object.keys(resumeData).forEach(key => {
            const element = document.getElementById(key === 'name' ? 'resumeName' :
                key === 'contact' ? 'resumeContact' :
                    key === 'links' ? 'resumeLinks' : key);
            if (element && resumeData[key]) {
                element.innerHTML = resumeData[key];
            }
        });
    }
}

// Auto-save resume content on input
document.addEventListener('DOMContentLoaded', () => {
    const resumeEditableElements = [
        'resumeName', 'resumeContact', 'resumeLinks',
        'professionalSummary', 'education', 'professionalExperience',
        'leadershipExperience', 'volunteeringExperience', 'skills', 'references'
    ];

    resumeEditableElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', () => {
                // Auto-save after 2 seconds of no typing
                clearTimeout(window.resumeAutoSaveTimeout);
                window.resumeAutoSaveTimeout = setTimeout(() => {
                    saveResume();
                }, 2000);
            });
        }
    });

    // Load saved resume data
    loadResumeData();

    // Load saved reflection file
    loadReflectionData();
});
