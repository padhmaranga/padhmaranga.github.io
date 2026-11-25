export const research = {
  title: "Diagnosing failures in autonomous driving models",
  summary:
    "How can we tell whether an unexpected trajectory comes from the physical system, a model assumption or incomplete observations?",
  themes: [
    "World models",
    "Digital twins",
    "Counterfactual reasoning",
    "Autonomous systems",
  ],
  stages: [
    {
      title: "Physical simulation",
      text: "Specify a simple physical scenario and record how it behaves.",
    },
    {
      title: "World model",
      text: "Represent the same scenario with assumptions about how the environment works.",
    },
    {
      title: "Predicted behavior",
      text: "Generate a prediction from the same starting conditions.",
    },
    {
      title: "Diagnostic algorithm",
      text: "Compare observations with predictions and isolate the discrepancy.",
    },
    {
      title: "Counterfactual evaluation",
      text: "Change one model assumption and compare the resulting trajectory.",
    },
    {
      title: "Failure diagnosis",
      text: "Evaluate whether the discrepancy is consistent with the proposed explanation.",
    },
  ],
};
