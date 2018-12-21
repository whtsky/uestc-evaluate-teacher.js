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

//hack下来的代码
define(["questionnaire/view/QuestionView", "question/model/Question", "questionnaire/view/QuestionSelectView", "questionnaire/view/LogicSetView", "questionnaire/view/QuestionConflictView"],
  function (QuestionView, Question, QuestionSelectView, LogicSetView, QuestionConflictView) {
    return Backbone.View.extend({
      events: {
        'click #addP': 'addSection',
        'click #logicSet': 'logicSet',
        'click #addConflict': 'addConflict',
        'click #sub': 'submit',
        'focus .section_ipt': '_focus',
        'blur .section_ipt': '_blur'
      },
      initialize: function () {
        this.listenTo(QUESTIONS, 'reset', this.addAll);
        this.listenTo(QUESTIONS, 'add', this.addOne);
        this.listenTo(QUESTIONS, 'sort', this.render);
        if ('EDIT' == this.options.scene) this.listenTo(QUESTIONS4SELECT, 'remove', this.render);
        //this.listenTo(QUESTIONS, 'all', this.render);
        this.render();
      },
      render: function () {
        this.$('#question-list').empty();
        this.$('#qSelectBox').empty();
        this.addAll();
        if ('EDIT' == this.options.scene) {
          this.initQuestionSelect();
        }
      },
      addAll: function () {
        QUESTIONS.each(this.addOne, this);
      },
      addOne: function (question) {
        var view = new QuestionView({model: question, scene: this.options.scene});
        this.$("#question-list").append(view.render().el);
        /*view.render().$el.hover(function(){
         debug(question.get('name'));
         });*/
      },
      initQuestionSelect: function () {
        var view = new QuestionSelectView({'questions': QUESTIONS4SELECT, 'eventBus': this.options.eventBus});
        this.$('#qSelectBox').append(view.render(1).el);
      },
      initLogicSet: function () {
        CONFLICTS.each(function (conflict) {
          var view = new QuestionConflictView({'model': conflict, 'eventBus': _.extend({}, Backbone.Events)});
          this.$('table#conflictslist tbody').empty().append(view.render().el);
        });
        //var view = new LogicSetView({'questions':QUESTIONS.questions(),'eventBus':this.options.eventBus});
      },
      _focus: function (e) {
        jQuery(e.currentTarget || e.srcElement).val('');
      },
      _blur: function (e) {
        var $obj = jQuery(e.currentTarget || e.srcElement);
        if ('' == $obj.val()) $obj.val('sectionName' == $obj.attr('id') ? '请输入章节名称' : '请输入章节名称(英)');
      },
      //添加章节
      addSection: function () {
        var sectionName = $('#sectionName').val();
        if (!sectionName || '请输入章节名称' == sectionName) {
          alert('请输入章节名称');
          return;
        }
        var sectionEngName = $('#sectionEngName').val();
        if (!sectionEngName || '请输入章节名称(英)' == sectionEngName) {
          alert('请输入章节名称(英)');
          return;
        }
        var q = new Question;
        q.set({
          'name': sectionName,
          'engName': sectionEngName,
          'type': 'subtitle',
          'orderNo': QUESTIONS.nextOrderNo(),
          'sectionNo': QUESTIONS.nextSectionNo()
        });
        QUESTIONS.add(q);
        $('#sectionName').val('请输入章节名称');
        $('#sectionEngName').val('请输入章节名称(英)');
      },
      //逻辑设置
      logicSet: function () {
        var view = new LogicSetView({'questions': QUESTIONS.objectives(), 'eventBus': this.options.eventBus});
        this.$('#logicsetting').empty().append(view.render().el);
        $.colorbox({
          transition: 'none',
          title: '逻辑设置',
          overlayClose: false,
          width: '80%',
          height: '80%',
          inline: true,
          opacity: 0.5,
          href: "#logicsetting"
        });
      },
      validate: function () {
        this.$('#validate-result').empty();
        var error = {};
        error.conflicts = new Array();
        var $qBoxArray = this.$('.qBox');
        $.each($qBoxArray, function (idx, qBox) {
          var $q = $(qBox);
          $q.css('border', 'none').css('border-bottom', 'solid 1px #ccc');
          if ($q.hasClass('objective')) {
            if ($q.hasClass('required')) {
              if (!$q.find('.option-radio').is(':checked')) {
                error.requiredErr = true;
                $q.css('border', 'red solid 1px');
              }
            }
          } else if ($q.hasClass('subjective')) {
            if ($q.hasClass('required')) {
              if (!$q.find('.answer').val()) {
                error.requiredErr = true;
                $q.css('border', 'red solid 1px');
              }
            }
          }
        });
        if (error.requiredErr) {
          this.$('#validate-result').append('<p class="err" style="color:red;">' + _i18nMsgs().requiredErr + '</p>');
        }
        //冲突验证
        var self = this;
        CONFLICTS.each(function (conflict) {
          if ($('#option_' + conflict.get('question1Id') + '_' + conflict.get('option1Index')).is(':checked') && $('#option_' + conflict.get('question2Id') + '_' + conflict.get('option2Index')).is(':checked')
          ) {
            var msg = '';
            msg += 'zh' == $bg_lang ? '当问题<a class="conflictErr" href="#question_' + conflict.get('question1Id') + '">' + QUESTIONS.get(conflict.get('question1Id')).get(_i18n($bg_lang)) + '</a>选择了<a class="conflictErr">' +
              QUESTIONS.get(conflict.get('question1Id')).getOptions().at(conflict.get('option1Index')).get('name') + '</a>时,问题<a class="conflictErr" href="#question_' + conflict.get('question2Id') + '">' +
              QUESTIONS.get(conflict.get('question2Id')).get(_i18n($bg_lang)) + '</a>不能选择<a class="conflictErr">' +
              QUESTIONS.get(conflict.get('question2Id')).getOptions().at(conflict.get('option2Index')).get('name') + '</a>' :
              'When You Choose The Option "' + QUESTIONS.get(conflict.get('question1Id')).getOptions().at(conflict.get('option1Index')).get('engName') + '" Of The Question <a class="conflictErr" href="#question_' + conflict.get('question1Id') + '">"' + QUESTIONS.get(conflict.get('question1Id')).get(_i18n($bg_lang))
              + '"</a>, You Can Not Choose The Option "' + QUESTIONS.get(conflict.get('question2Id')).getOptions().at(conflict.get('option2Index')).get('engName') + '" Of The Question <a class="conflictErr" href="#question_' + conflict.get('question2Id') + '">"' + QUESTIONS.get(conflict.get('question2Id')).get(_i18n($bg_lang)) + '"</a>';
            error.conflicts.push(msg);
            self.$('#validate-result').append('<p class="err">' + msg + '</p>');
          }
        });
        return error;
      },
      //提交 不同业务场景下有不同的行为 在预览页下 只会给出验证结果 在答题页下 将提交后台记录答案
      submit: function () {
        if (this.submitting) {
          return;
        }
        this.submitting = this.submitting || true;
        var result = this.validate();
        if (result.requiredErr || result.conflicts.length > 0) {
          delete this.submitting;
          return;
        }
        if ('ANSWER' != this.options.scene) {
          delete this.submitting;
          return;
        }
        /* //不要再弹窗了啦
        if (!confirm(_i18nMsgs().confirm_at_submit)) {
          delete this.submitting;
          return;
        }
        */
        var actionForm = document.actionForm;
        var $checkedItems = $('.option-radio:checked');
        var result1Num = 0;
        $.each($checkedItems, function (idx, item) {
          var q = QUESTIONS.get(parseInt($(item).attr('q')));
          bg.form.addInput(actionForm, 'result1_' + idx + '.questionName', q.get('name'));
          bg.form.addInput(actionForm, 'result1_' + idx + '.content', q.getOptions().where({'index': parseInt($(item).attr('index'))})[0].get('name'));
          bg.form.addInput(actionForm, 'result1_' + idx + '.score', q.get('proportion') * q.getOptions().where({'index': parseInt($(item).attr('index'))})[0].get('proportion') * 100);
          result1Num++;
        });
        var result2Num = 0;
        var $answers = $('.subjective .answer');
        $.each($answers, function (i, answer) {
          var q = QUESTIONS.get(parseInt($(answer).attr('q')));
          bg.form.addInput(actionForm, 'result2_' + i + '.questionName', q.get('name'));
          bg.form.addInput(actionForm, 'result2_' + i + '.content', $(answer).val());
          result2Num++;
        });
        bg.form.addInput(actionForm, 'result1Num', result1Num);
        bg.form.addInput(actionForm, 'result2Num', result2Num);
        $("#sub").prop("disabled",true)
        bg.form.submit(actionForm);
        delete this.submitting;
      }
    });
  });

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
