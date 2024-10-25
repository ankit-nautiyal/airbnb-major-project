// // Click search input box then add box-shadow---------
// const searchInputBox = document.querySelectorAll("#mySearchInput");
// const box = document.querySelectorAll(".nav-search");
// for (const searchInput of searchInputBox) {
// 	searchInput.addEventListener("input", function () {
// 		for (const searchBox of box) {
// 			searchBox.style.boxShadow =
// 				"inset 0px 6px 5px rgba(0, 0, 0, 0.700)";
// 			setTimeout(() => {
// 				searchBox.style.boxShadow =
// 					"inset 0px 2px 3px rgba(0, 0, 0, 0.800)";
// 			}, 100);
// 		}
// 	});
// }

// // User button click then display Profile box----------
// const imgBar = document.querySelector("#png-img-bar");
// const crossBar = document.querySelector("#png-img-cross");
// const userFnx = document.querySelector(".user-fnx");
// const userButton = document.querySelector(".nav-user");
// userButton.addEventListener("click", () => {
// 	if (userFnx.style.display == "none") {
// 		userFnx.style.display = "flex";
// 		imgBar.style.display = "none";
// 		crossBar.style.display = "inline";
// 	} else {
// 		userFnx.style.display = "none";
// 		crossBar.style.display = "none";
// 		imgBar.style.display = "inline";
// 	}
// });

<nav class="navbar navbar-expand-md bg-body-light border-bottom sticky-top">
    <div class="container-fluid">
      <img src="/icons/airbnb_logo.png" height="30px" width="100px" alt="airbnb_logo">
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav ms-auto">
          <a class="nav-link" href="/">Home</a>
          <a class="nav-link" href="/listings">All Listings</a>
          <a class="nav-link" href="/listings/new">Add New Listing</a>
        </div>


        <div class="navbar-nav ms-auto">
            if(!currUser) { 
                <button  type="button" class="btn btn-light"><a class="nav-link" href="/signup">Signup</a> </button>
                <button  type="button" class="btn btn-light"> <a class="nav-link" href="/login">Login</a> </button>
           } %
          
          <% if(currUser) { %>
            <button type="button" class="btn btn-light"> <a class="nav-link" href="/logout">Logout</a></button>
          <% } %> 
        </div>
      </div>
    </div>
</nav>