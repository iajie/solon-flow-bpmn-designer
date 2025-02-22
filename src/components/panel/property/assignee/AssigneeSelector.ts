import { PanelInput } from "../PanelInput.ts";
import { BpmnElement } from "bpmn-js";
import {
  ASSIGNEE_TYPES,
  AssigneeOption,
  DEFAULT_OPTIONS
} from "../../../../constants/assigneeType.ts";
import { updateProperty } from "../../../../utils/bpmnUtils.ts";
import Modeler from "bpmn-js/lib/Modeler";
import { t } from "i18next";

export class AssigneeSelector extends PanelInput {
  select!: HTMLSelectElement;
  externalOptions: Record<string, AssigneeOption[]> = {};

  constructor() {
    super();
    this.inputLabel = "assigneeValue";
    this.init();
  }

  init() {
    const select = document.createElement("select");
    select.classList.add("input-select");
    this.select = select;
    this.select.onchange = (e) =>
      this.onChangeValue(e, this.element, this.modeler);
    this.inputElement = select;

    // 监听类型改变事件
    document.addEventListener('assigneeTypeChange', (e: Event) => {
        const customEvent = e as CustomEvent;
        const type = customEvent.detail?.type;
        if (type) {
          this.updateOptionsForType(type);
        }
    });
  }

  updateOptionsForType(type: string) {
    // 清空当前选项
    this.select.innerHTML = "";
    
    // 添加空选项
    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.text = t('pleaseSelect');
    this.select.appendChild(emptyOption);

    // 获取选项列表（优先使用外部传入的选项）
    const options = this.externalOptions[type] || DEFAULT_OPTIONS[type] || [];
    
    // 添加选项
    options.forEach((opt) => {
      const option = document.createElement("option");
      option.value = opt.value;
      option.text = opt.label;
      this.select.appendChild(option);
    });

    // 清空选中值
    this.select.value = "";
  }

  // 接收外部选项配置
  setOptions(type: string, options: AssigneeOption[]) {
    this.externalOptions[type] = options;
    if (this.element?.businessObject?.assigneeType === type) {
      this.updateOptionsForType(type);
    }
  }

  onChangeValue(e: Event, element?: BpmnElement, modeler?: Modeler) {
    if (!element?.businessObject) return;

    const value = (e.target as HTMLSelectElement).value;
    const type = element.businessObject.assigneeType || ASSIGNEE_TYPES.USER;

    switch (type) {
      case ASSIGNEE_TYPES.USER:
        updateProperty("assignee", value, element, modeler);
        break;
      case ASSIGNEE_TYPES.USERS:
        updateProperty("candidateUsers", value, element, modeler);
        break;
      case ASSIGNEE_TYPES.ROLE:
        updateProperty("candidateGroups", `role_${value}`, element, modeler);
        break;
      case ASSIGNEE_TYPES.DEPT:
        updateProperty("candidateGroups", `dept_${value}`, element, modeler);
        break;
      case ASSIGNEE_TYPES.POST:
        updateProperty("candidateGroups", `post_${value}`, element, modeler);
        break;
    }
  }

  onChange(element: BpmnElement) {
    if (!element?.businessObject) return;

    const type = element.businessObject.assigneeType || ASSIGNEE_TYPES.USER;
    let value = "";

    switch (type) {
      case ASSIGNEE_TYPES.USER:
        value = element.businessObject.assignee || "";
        break;
      case ASSIGNEE_TYPES.USERS:
        value = element.businessObject.candidateUsers || "";
        break;
      case ASSIGNEE_TYPES.ROLE:
      case ASSIGNEE_TYPES.DEPT:
      case ASSIGNEE_TYPES.POST:
        const groups = element.businessObject.candidateGroups || "";
        const prefix = `${type}_`;
        value =
          groups
            .split(",")
            .find((g) => g.startsWith(prefix))
            ?.replace(prefix, "") || "";
        break;
    }

    this.select.value = value;
  }
}
