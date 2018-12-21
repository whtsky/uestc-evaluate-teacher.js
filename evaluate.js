function jiege() {
  document.querySelectorAll('.option-list').forEach(option => (option.querySelector('input').checked = true))
  document.querySelectorAll('textarea').forEach(t => (t.value = "Oh Boy That's Good"))
  document.querySelector('#sub').click()
}

function awei() {
  document.querySelectorAll('input[type=checkbox]').forEach(t => (t.checked = true))
  document.querySelectorAll('textarea').forEach(t => (t.value = "Oh Boy That's Good"))
  validate_('5', 1)
}

function binbin() {
  const rv = /(\d) - (\d)/.exec(document.querySelector('#contentDiv label').textContent)
  let count = rv[1]
  Array.from(document.querySelectorAll('.gridtable tr input'))
    .filter(v => v.id)
    .forEach(input => {
      if (count-- > 0) {
        input.value = 5
      } else {
        input.value = 1
      }
    })
  document.querySelector('input[value=下一步]').click()
}

window.confirm = () => true
var wait = setInterval(function() {
  try {
    if (document.querySelector('#contentDiv label')) {
      // 选五星课程
      binbin()
    } else if (document.querySelector('.option-list')) {
      // 教材评价
      jiege()
    } else if (document.querySelector('input[value=提交，进入教师评教]')) {
      document.querySelector('input[value=提交，进入教师评教]').click()
    } else {
      // 老师评价?
      awei()
    }
    save(1)
  } catch (e) {}
}, 2000)
