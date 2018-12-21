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
}

function teacherGood() {
  document.getElementById('op_6_15').checked = true;
  document.getElementById('op_2_25').checked = true;
  document.getElementById('op_4_35').checked = true;
  document.getElementById('op_1_5').checked = true;
  bg.form.submit('evaluateEditForm', null, null, 'doPost();');
  setTimeout(clickNext, 2000)
}

function clickNext() {
  let tag = Array.from(document.getElementsByTagName('a')).find(tag => tag.innerHTML.includes('进行评教'))
  if (!tag) {
    return
  }
  tag.click()
  setTimeout(teacherGood, 2000)
}

starCourse()
clickNext()
