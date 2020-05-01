function save_options() {
  var method = document.getElementById('method').value;
  var school = document.getElementById('school').value;
  chrome.storage.sync.set({
    method: method,
    school: school
  }, () => {
    // Update status to let user know options were saved.
    window.close();
    // var status = document.getElementById('status');
    // status.textContent = 'Options saved.';
    // setTimeout(() => {status.textContent = '';}, 500);
  });
}

function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get((items) => {
    document.getElementById('method').value = items.method;
    document.getElementById('school').value = items.school;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);

document.getElementById('save').addEventListener('click', save_options);
