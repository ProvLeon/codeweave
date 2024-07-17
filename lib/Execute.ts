import axios from 'axios';

const PISTON_API_EXECUTE_URL = 'https://emkc.org/api/v2/piston/execute';
const PISTON_RUNTIME_URL = 'https://emkc.org/api/v2/piston/runtimes';

interface Runtime {
  language: string;
  version: string;
  // Add other properties if needed
}


const executeCode = async (code: string, language: string): Promise<string> => {
  const languageMapping: { [key: string]: { language: string, version: string, runtime?: string } } = {
    javascript: { language: 'javascript', version: '18.15.0' }, // Specify a valid version
    python: { language: 'python', version: '3.10.0' }, // Specify a valid version
    java: { language: 'java', version: '15.0.2' }, // Specify a valid version
    html: { language: 'html', version: '5.0' }, // Specify a valid version
    cpp: { language: 'cpp', version: '10.2.0' }, // Specify a valid version
    rust: { language: 'rust', version: '1.68.2' }, // Specify a valid version
    c: { language: 'c', version: '10.2.0' }, // Specify a valid version
    // Add more language mappings as needed
  };

  const fetchRuntime = async (language: string) => {
    const response = await axios.get(PISTON_RUNTIME_URL);
    const runtimes: Runtime[] = response.data;
    const runtime = runtimes.find((runtime: Runtime) => runtime.language === language);
    if (!runtime) {
      throw new Error(`Unsupported language: ${language}`);
    }
    return {language: runtime.language, version: runtime.version};
  }
  const languageConfig = await fetchRuntime(languageMapping[language].language);

  if (!languageConfig) {
    throw new Error(`Unsupported language: ${language}`);
  }

  try {
    const response = await axios.post(PISTON_API_EXECUTE_URL, {
      language: languageConfig.language,
      version: languageConfig.version,
      files: [{ name: 'main', content: code }],
    });

    const { data } = response;
    if (data && data.run) {
      return data.run.output;
    } else {
      throw new Error('Code execution failed. Please try again later.');
    }
  } catch (error: any) {
    if (error.response && error.response.data) {
      console.error('Error executing code:', error.response.data);
      throw new Error(`Code execution failed: ${error.response.data.message}`);
    } else {
      console.error('Error executing code:', error);
      throw new Error('Code execution failed unexpectedly. Please try again later.');
    }
  }
};

export default executeCode;
