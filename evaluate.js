// 我热爱我的老师们，所以我要给他们全评满分
// 打开评教页面，运行，等全部评教完成之后手动点一下提交

window.confirm = () => true

function genRandom(m,n){
  let ans = Array(n).fill(0);

  let order = Array(n);
  for(let i=0;i<n;i++){
    order[i]=i;
  }

  for(let i=0;i<m;i++){
    let chosen = Math.floor(Math.random() * (n-i));
    ans[order[chosen]]=1;
    order[chosen]=n-i-1;//the last of array
  }

  return ans;
}

//打星
function starCourse() {
  //读取优秀课程的数量
  let cdiv = document.getElementById('contentDiv');
  let nums = /优秀课程.*?(\d).*?(\d)/.exec(cdiv.getElementsByTagName('label')[0].textContent);
  //取平均
  let num = Math.floor((nums[1]*1+nums[2]*1)/2);

  //读取表格
  let eform = document.getElementById('evaluateForm');
  let einput = eform.getElementsByTagName('input');

  //随机5星
  let arr_of_five_stars = genRandom(num,einput.length-2);
  console.log(arr_of_five_stars);

  //打星
  for(let i=0;i<einput.length;i++){
    if(einput[i].id){
      if(arr_of_five_stars[i]){
        document.getElementById(einput[i].id).value=5;
        eval('fnShow_'+i+'(5)');
      }
      else{
        document.getElementById(einput[i].id).value=4;
        eval('fnShow_'+i+'(4)');
      }
    }
  }
  save(0);//暂存
  loadQtnaire();//下一步
  setTimeout(clickNextBook,2000);
}

//教材评价，注意会全部选最后一个
function textBook(){
  var lists = document.getElementsByTagName('input');
  for (let i = 0; i < lists.length-3; i++) {
    lists[i].checked = true;
  }
  document.getElementsByClassName('answer')[0].value='教材就不能不用自己编写的吗？';
  document.getElementById('sub').click();
  setTimeout(clickNextBook, 2000);
}

function clickNextBook() {
  let tag = Array.from(document.getElementsByTagName('a')).find(tag => tag.innerHTML.includes('进行评教'))
  if (!tag) {
    setTimeout(loadQtnaire, 2000);
    setTimeout(teacherGood, 4000);
    return
  }
  tag.click()
  setTimeout(textBook, 2000)
}

//教师评价
function teacherGood() {
  var lists = document.getElementsByTagName('input');
  for (let i = 0; i < lists.length-3; i++) {
    lists[i].checked = true;
  }
  document.getElementById('evaText').value='很不错的老师，可惜这时间太短，以后还想上他的课。';
  setTimeout(clickNextTeacher, 2000)
}

function clickNextTeacher() {
  //validate_('1',1);
  let button = Array.from(document.getElementsByTagName('input')).find(button => button.value.includes('下一步'));
  if(!button){
    console.log('你可能需要点击一下确认');
    return;
  }
  else{
    button.click();
    setTimeout(teacherGood, 6000);
  }
}

starCourse();
