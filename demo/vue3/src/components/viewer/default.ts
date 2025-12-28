export const xmlStr = `id: sf1
title: sf1
layout:
  - id: step1
    type: activity
    title: 发起审批
    meta: {actor: 刘涛, form: form1}
    link:
    - {nextId: step2}
  - id: step2
    type: activity
    title: 抄送
    meta: {cc: 吕方}
    task: '@OaMetaProcessCom'
    link:
    - {nextId: step3}
  - id: step3
    type: activity
    title: 审批
    meta: {actor: 陈鑫, cc: 吕方}
    task: '@OaMetaProcessCom'
    link:
    - {nextId: step4}
  - id: step4
    type: parallel
    title: 审批
    link:
    - {nextId: step4_1}
    - {nextId: step4_2}
  - id: step4_1
    type: activity
    meta: {actor: 陈宇}
    link:
    - {nextId: step4_end}
  - id: step4_2
    type: activity
    meta: {actor: 吕方}
    link:
    - {nextId: step4_end}
  - id: step4_end
    type: parallel
    link:
    - {nextId: step5}
  - id: step5
    type: activity
    title: 抄送
    meta: {cc: 吕方}
    task: '@OaMetaProcessCom'
    link:
    - {nextId: step6}
  - {id: step6, type: end, title: 结束}`;
