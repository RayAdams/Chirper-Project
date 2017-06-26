// In the client-side JS for this page, you will need to get the URL of the current page
//     * Once you have that, you will be able to figure out which chirp to get
//         * ex: http://localhost:3000/chirps/12  => This page should ask for chirp 12 from the API and display it
//         * This page should contain an edit button that links to `/chirps/id of the chirp/update`
//             * ex: `<a href="/chirps/12/update">...</a>`
//         * This page should contain a delete button that, when clicked, pops up a confirmation asking if we should delete
//             * If the user confirms, a DELETE request should be sent to the server to delete the chirp. When that is successful, navigate back to to chirp list page
