
setTimeout(() => {
    document.querySelectorAll('.text').forEach(
        e => {
            e.classList.add('fade-out-up')
            setTimeout(() => {
                e.remove();
            }, 5000);
        }
    );
}, 6000); 
