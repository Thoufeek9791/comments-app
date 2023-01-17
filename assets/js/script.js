const comment = document.getElementById('comment')
const commentBox = [...document.getElementsByClassName('comment-box')]
const editArr = [...document.getElementsByClassName('edit')]
console.log(editArr);

for (let i = 0; i<commentBox.length; i++) {
    editArr[i].addEventListener('click', e => {
        console.log("Inside click Event");
        commentBox[i].disabled = false
    })
    console.log("Inside For Loop");

    editArr[i].addEventListener('submit', e=> {
        console.log("Insied Submit Event");
        editArr[i].textContent = 'Edit'
    })
}

// edit.addEventListener('click', (e) => {
//     comment.disabled = false
//     // edit.setAttribute('type', 'submit');
// })

// edit.addEventListener('submit', (e) => {
//     comment.disabled = true;
//     // edit.setAttribute('type', 'button')
//     edit.textContent = 'Edit'
// })