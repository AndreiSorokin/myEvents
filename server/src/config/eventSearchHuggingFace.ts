const { HuggingFaceInference } = require("langchain/llms/huggingface");
const hf = new HuggingFaceInference({
  model: "",
  apiKey: process.env.HUGGINGFACE_API_KEY,
});
