const editBtn = document.querySelector('#editBtn')
const urlInput = document.querySelector('#url-input')
const saveBtn = document.querySelector('#saveBtn')
const copy = document.querySelector('#copy')
const success = document.querySelector('#success')
const fail = document.querySelector('#fail')
const regex = new RegExp(/^[a-zA-Z0-9]{5}$/);

editBtn.addEventListener('click', (event) => {
  urlInput.removeAttribute('disabled')
  saveBtn.removeAttribute('disabled')
  editBtn.setAttribute('disabled', '')
  copy.setAttribute('disabled', '')
})

saveBtn.addEventListener('click', (event) => {
  const checkEdit = urlInput.value.split('/')
  if (checkEdit[0] === 'http:' && checkEdit[1] === '' && checkEdit[2] === 'localhost:3000') {
    if (!regex.test(checkEdit[3])) {
      urlInput.setCustomValidity('縮址部分只能為大小寫英文或數字，長度必須為5位')
      urlInput.reportValidity()
    }
  } else {
    urlInput.setCustomValidity('前面部分 http://localhost:3000/ 請勿修改')
    urlInput.reportValidity()
  }

})

urlInput.addEventListener('input', (event) => {
  urlInput.setCustomValidity('')
})

copy.addEventListener('click', (event) => {
  navigator.clipboard.writeText(urlInput.value)
    .then(() => { success.classList.remove('d-none') })
    .catch(() => { fail.classList.remove('d-none') })
})

