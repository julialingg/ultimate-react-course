// state management
// workflow design
// validation logic
// edge cases



// 这里是用type 
type Steps = "PERSONAL_INFO" | "PLAN_SELECTION" | "PAYMENT" | "CONFIRMATION"


type FormInformation = {
  personalInfo?: {
    email?: string;
    name?: string;
  }
  planSelection?: {
    planType?: "A" | "B"
    contractDuration?: 12 | 24
  }
  payment?: {
    iban?: string;

  }
  confirmation?: {
    confirm?: boolean;
  }

}

function validateEmail(email: string): boolean {

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


// Updates data for a step
// 应该接收某个 step 的 partial data，然后 merge 到全局 state。
function updateStepData(step: Steps, currentData: FormInformation, newData: FormInformation): FormInformation {

  switch (step) {
    case "PERSONAL_INFO":
      return {
        ...currentData,
        personalInfo: {
          ...currentData.personalInfo,
          ...newData.personalInfo,
        },
      };

    case "PLAN_SELECTION":
      return {
        ...currentData,
        planSelection: {
          ...currentData.planSelection,
          ...newData.planSelection,
        },
      };

    case "PAYMENT":
      return {
        ...currentData,
        payment: {
          ...currentData.payment,
          ...newData.payment,
        },
      };

    case "CONFIRMATION":
      return {
        ...currentData,
        confirmation: {
          ...currentData.confirmation,
          ...newData.confirmation,
        },
      };
  }
}

// Returns whether the step is valid.
function validateStep(step: Steps, data: FormInformation): boolean {
  // isValid 变量没必要  可以每个case直接return 
  let isValid: boolean = true;

  switch (step) {
    case "PERSONAL_INFO":
      //TODO  用两个感叹号
      // !! 的作用是 把任意值强制转换成 boolean。  !!(value) 等价于 Boolean(value)
      // 空字符串或者undefined  !! 之后都是false   
      isValid = !!data.personalInfo?.name?.trim()
        && !!data.personalInfo?.email?.trim()
        && validateEmail(data.personalInfo?.email.trim())
      break;
    case "PLAN_SELECTION":
      isValid = !!data.planSelection?.planType && (data.planSelection?.contractDuration === 12 || data.planSelection?.contractDuration === 24)
      break;
    case "PAYMENT":
      isValid = !!data.payment?.iban?.trim() && data.payment?.iban.trim().length >= 10
      break;
    case "CONFIRMATION":
      isValid = data.confirmation?.confirm === true;
      break;
  }
  return isValid

}


// Moves to the next step only if current step is valid.
function moveToNextStep(currentStep: Steps, data: FormInformation): Steps {
  const allStep: Steps[] = ["PERSONAL_INFO", "PLAN_SELECTION", "PAYMENT", "CONFIRMATION"]

  const isValid = validateStep(currentStep, data);
  if (!isValid) return currentStep;


  //   moveToNextStep 没处理 indexOf 的异常情况
  // if (currentStep === "CONFIRMATION") {
  //   return "CONFIRMATION"
  // }
  // return allStep[allStep.indexOf(currentStep) + 1]


  // 虽然 currentStep 是 union type，理论上不会出错，但更稳妥是处理 -1

  const currentIndex = allStep.indexOf(currentStep);

  // urrentIndex === -1 是：没找到 currentStep  indexof 如果没找到 是返回-1 
  // currentIndex === allStep.length - 1  当前已经是最后一步.
  if (currentIndex === -1 || currentIndex === allStep.length - 1) {
    return currentStep;
  }

  return allStep[currentIndex + 1];

}

export default moveToNextStep