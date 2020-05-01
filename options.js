function saveSettings() {
  var method = document.getElementById('method').value;
  var school = document.getElementById('school').value;
  chrome.storage.sync.set({
    method: method,
    school: school
  }, () => {window.close();});
}

function restoreSettings() {
  chrome.storage.sync.get({
    method: 2,
    school: 0
  }, (items) => {
    document.getElementById('method').value = items.method;
    document.getElementById('school').value = items.school;
  });
}
document.addEventListener('DOMContentLoaded', restoreSettings);

document.getElementById('save').addEventListener('click', saveSettings);
