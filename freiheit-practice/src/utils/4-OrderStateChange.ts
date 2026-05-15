// interviewer 真正想看什么
// 1. validation decomposition

// 2. clean control flow
// 会不会：// switch(currentStep)

// 3. edge cases
// 比如：
// 	• missing data 
// 	• invalid transitions 
//   already submitted 

type Step = "customerInfo" | "planSelection" | "contractConfirmation" | "submitted";

type FormState = {
  customerInfo?: {
    name?: string;
    email?: string;
  };
  planSelection?: {
    region?: string;
    plan?: "basic" | "premium";
    contractDuration?: 12 | 24;
  };
  contractConfirmation?: {
    acceptedTerms?: boolean;
  };
};




//  面试官可能追问：
// 	• 如果以后新增一个 step，怎么扩展？ 
// 	• 你会怎么测试这个 workflow？ 
// 	• 你会把 validation logic 放在哪里？ 
// 如果规则来自后端配置，怎么改？


function isValidEmail(email: string): boolean {
  // TODO  记住
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateCustomerInfo(state: FormState): string[] {
  //  customerInfo 必须有 name 和合法 email，才能进入 planSelection。 
  const errors: string[] = []
  // trim()  去掉空格   因为万一用户输入的全是空格 也应该是非法的
  if (!state.customerInfo?.name?.trim()) errors.push("no name")
  if (!(state.customerInfo?.email?.trim() && isValidEmail(state.customerInfo?.email.trim()))) errors.push("not valid email")

  return errors

}

function validatePlanSelection(state: FormState): string[] {
  // 	2. planSelection 必须有 region、plan、contractDuration。 
  // 	3. 如果 plan 是 "premium"，contractDuration 必须是 24。 
  const errors: string[] = []
  if (!state.planSelection?.contractDuration) errors.push("no contractDuration")
  if (!state.planSelection?.plan) errors.push("no plan")
  if (!state.planSelection?.region) errors.push("no region")
  if (state.planSelection?.plan === "premium" && state.planSelection?.contractDuration !== 24) errors.push("if you select premium,duration should be 24 ")

  return errors
}


function validateContractConfirmation(state: FormState): string[] {
  const errors: string[] = []
  // 	4. contractConfirmation 必须 acceptedTerms === true 才能进入 submitted。
  // 写===false不够严谨 因为可能是undefined  
  // if (state.contractConfirmation?.acceptedTerms === false) errors.push("no acceptedTerms")

  //  只有严格等于 true 才能进入 submitted
  if (state.contractConfirmation?.acceptedTerms !== true) errors.push("no acceptedTerms")
  return errors
}


type Result = {
  nextStep: Step;
  errors: string[];
}
function NextStep(currentStep: Step, state: FormState): Result {

  const steps: Step[] = ["customerInfo", "planSelection", "contractConfirmation", "submitted"]
  const results: Result = {
    // nextStep: "planSelection",   //不要给一个假的默认 nextStep  危险
    nextStep: currentStep,
    errors: []
  }

  //  6. 如果已经是 submitted，保持 submitted。 
  if (currentStep === "submitted") {
    results.nextStep = "submitted"
    results.errors = []
    return results;
  }


  // 方法二：  映射map  可以动态取函数

  // I would probably refactor this into a validator map so the transition logic remains unchanged when new steps are added.

  // const validators = {
  //   customerInfo: validateCustomerInfo,
  //   planSelection: validatePlanSelection,
  //   contractConfirmation: validateContractConfirmation,
  // };
  // const validateFunction = validators[currentStep];
  // const error = validateFunction(state);

  // 方法三 switch  
  let error: string[] = [];

  switch (currentStep) {
    case "customerInfo":
      error = validateCustomerInfo(state);
      break;

    case "planSelection":
      error = validatePlanSelection(state);
      break;

    case "contractConfirmation":
      error = validateContractConfirmation(state);
      break;
  }


  if (error.length > 0) {
    results.errors = error
    results.nextStep = currentStep
    return results
  }


  results.nextStep = steps[steps.indexOf(currentStep) + 1]


  return results
}
export default NextStep