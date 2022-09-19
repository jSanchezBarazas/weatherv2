var index_card = 1;
function addElement() {
    var search = document.querySelector(".form__input").value
    if (search != '') {
        var target = document.querySelector(".card-wrapper");
        var sHTML = '<div class="card" id="card' + index_card + '">' +
            '<div class="cover">' +
            '<div class="delete_div">' +
            ' <button class="delete_button" onclick="removeCard(this)">' +
            '    <svg' +
            '    stroke="currentColor"' +
            '    fill="currentColor"' +
            '    stroke-width="0"' +
            '    version="1.2"' +
            '    baseProfile="tiny"' +
            '    viewBox="1 -1 24 24"' +
            '    height="2.8em"' +
            '    width="2.8em"' +
            '    xmlns="http://www.w3.org/2000/svg"' +
            '    >' +
            '  <path' +
            '    d="M12 3c-4.963 0-9 4.038-9 9s4.037 9 9 9 9-4.038 9-9-4.037-9-9-9zm0 16c-3.859 0-7-3.14-7-7s3.141-7 7-7 7 3.14 7 7-3.141 7-7 7zM12.707 12l2.646-2.646c.194-.194.194-.512 0-.707-.195-.194-.513-.194-.707 0l-2.646 2.646-2.646-2.647c-.195-.194-.513-.194-.707 0-.195.195-.195.513 0 .707l2.646 2.647-2.646 2.646c-.195.195-.195.513 0 .707.097.098.225.147.353.147s.256-.049.354-.146l2.646-2.647 2.646 2.646c.098.098.226.147.354.147s.256-.049.354-.146c.194-.194.194-.512 0-.707l-2.647-2.647z"' +
            '  ></path>' +
            '  </svg>' +
            ' </button>' +
            '</div>' +
            '       <h1>' + search + '</h1> ' +
            '    </div>' +
            '</div>'

        target.innerHTML += sHTML;
        setBackgroudImage(index_card);
        index_card += 1;
    }
}

function setBackgroudImage(i) {
    var card = document.getElementById("card" + i);
    card.style.backgroundImage = 'url(./images/' + i + '.jpg)';

}
function removeCard(elem) {
    div = elem.closest('.card');
    if (div) {
        div.remove();
    }
}

document.querySelector(".search button").addEventListener("click", function () {
    addElement()
})

