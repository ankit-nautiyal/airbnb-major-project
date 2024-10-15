
//to add a pop-up asking asking confirmation form the user before deleting a listing

document.addEventListener('DOMContentLoaded', () => {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent form submission
            
            const userConfirmed = confirm("Are you sure you want to delete this listing?");
            
            if (userConfirmed) {
                this.closest('form').submit(); // Proceed with closest form submission if confirmed
            }
        });
    });
});
