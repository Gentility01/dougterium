document.addEventListener('DOMContentLoaded', function() {
            const descriptions = document.querySelectorAll('.portfolio-description');
            const readMoreBtns = document.querySelectorAll('.read-more-btn');
            const charLimit = 250;
            
            descriptions.forEach((description, index) => {
                const fullText = description.textContent;
                
                if (fullText.length > charLimit) {
                    // Truncate text and add ellipsis
                    const truncatedText = fullText.substring(0, charLimit) + '...';
                    
                    // Set the truncated text
                    description.textContent = truncatedText;
                    
                    // Store the full text in a data attribute
                    description.setAttribute('data-full-text', fullText);
                    
                    // Show the read more button
                    readMoreBtns[index].style.display = 'block';
                    
                    // Add click event to toggle text
                    readMoreBtns[index].addEventListener('click', function() {
                        if (description.textContent.length <= charLimit + 3) {
                            // Show full text
                            description.textContent = description.getAttribute('data-full-text');
                            this.textContent = 'Read less';
                        } else {
                            // Show truncated text
                            description.textContent = truncatedText;
                            this.textContent = 'Read more';
                        }
                    });
                } else {
                    // Hide the read more button if text is short
                    readMoreBtns[index].style.display = 'none';
                }
            });
        });