document.addEventListener('DOMContentLoaded', function () {
    var breadcrumbs = document.querySelector('main .breadcrumbs');
    var h1 = document.querySelector('main h1');
    if (breadcrumbs && h1) {
        h1.after(breadcrumbs);
    }
});
