// 我热爱我的老师们，所以我要给他们全评满分
// 打开评教页面，运行，等全部评教完成之后手动点一下提交
window.confirm = () = > true
function teacherGood() {
  document.getElementById('op_6_15').checked = true;
  document.getElementById('op_2_25').checked = true;
  document.getElementById('op_4_35').checked = true;
  document.getElementById('op_1_5').checked = true;
  bg.form.submit('evaluateEditForm', null, null, 'doPost();');
  setTimeout(clickNext, 2000)
}
function clickNext() {
  lettag = Array.from(document.getElementsByTagName('a')).find(tag = > tag.innerHTML.includes('进行评教'))
  if (!tag) {
    return
  }
  tag.click()
  setTimeout(teacherGood, 2000)
}
clickNext()
