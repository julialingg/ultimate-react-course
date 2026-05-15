type Stepp = "PERSONAL_INFO" | "PLAN_SELECTION" | "PAYMENT" | "CONFIRMATION";

// I used a class here because the workflow needs to keep both the current step and accumulated form data 
// as internal state. 
// Validation is separated by step, so the transition logic stays simple.
type WorkflowData = {
  personalInfo?: {
    email?: string;
    name?: string;
  };
  planSelection?: {
    planType?: "A" | "B";
    contractDuration?: 12 | 24;
  };
  payment?: {
    iban?: string;
  };
  confirmation?: {
    confirm?: boolean;
  };
};

class SubscriptionWorkflow {


  private steps: Stepp[] = [
    "PERSONAL_INFO",
    "PLAN_SELECTION",
    "PAYMENT",
    "CONFIRMATION",
  ];

  private currentStep: Stepp = "PERSONAL_INFO";
  private data: WorkflowData = {};

  updateStepData(step: Stepp, stepData: unknown): void {
    switch (step) {
      case "PERSONAL_INFO":
        this.data.personalInfo = {
          ...this.data.personalInfo,
          ...(stepData as WorkflowData["personalInfo"]),
        };
        break;

      case "PLAN_SELECTION":
        this.data.planSelection = {
          ...this.data.planSelection,
          ...(stepData as WorkflowData["planSelection"]),
        };
        break;

      case "PAYMENT":
        this.data.payment = {
          ...this.data.payment,
          ...(stepData as WorkflowData["payment"]),
        };
        break;

      case "CONFIRMATION":
        this.data.confirmation = {
          ...this.data.confirmation,
          ...(stepData as WorkflowData["confirmation"]),
        };
        break;
    }
  }

  validateStep(step: Stepp): boolean {
    switch (step) {
      case "PERSONAL_INFO": {
        const name = this.data.personalInfo?.name?.trim();
        const email = this.data.personalInfo?.email?.trim();

        return !!name && !!email && this.validateEmail(email);
      }

      case "PLAN_SELECTION": {
        const plan = this.data.planSelection;
        return (
          !!plan?.planType &&
          (plan.contractDuration === 12 || plan.contractDuration === 24)
        );
      }

      case "PAYMENT": {
        const iban = this.data.payment?.iban?.trim();
        return !!iban && iban.length >= 10;
      }

      case "CONFIRMATION":
        return this.data.confirmation?.confirm === true;
    }
  }

  nextStep(): void {
    if (!this.validateStep(this.currentStep)) {
      return;
    }

    const currentIndex = this.steps.indexOf(this.currentStep);
    const nextIndex = Math.min(currentIndex + 1, this.steps.length - 1);
    this.currentStep = this.steps[nextIndex];
  }

  getCurrentStep(): Stepp {
    return this.currentStep;
  }

  getAllData(): WorkflowData {
    return this.data;
  }

  private validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

export default SubscriptionWorkflow