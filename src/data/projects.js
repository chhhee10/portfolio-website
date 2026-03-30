const projects = [
  {
    id: 'vaultless',
    name: 'Vaultless',
    description:
      'A decentralized authentication system that replaces traditional passwords using behavioral biometrics like keystroke dynamics and motion signals. It uses a real-time scoring engine with statistical normalization to classify user intent into secure, duress, or rejected states. The system integrates Ethereum smart contracts to store tamper-proof identity commitments, ensuring trustless verification. It also introduces a duress protocol with ghost sessions and alert mechanisms for enhanced security. Built with a modern web stack and Web3 integrations, the project focuses on privacy, security, and usability.',
    githubUrl: 'https://github.com/chhhee10/VAULTLESS',
    deployUrl: 'https://vaultless-sys.vercel.app/',
    sizeKb: 1840,
  },
  {
    id: 'aegis-agent',
    name: 'Aegis Agent',
    description:
      'A high-performance file integrity monitoring system designed to detect unauthorized changes in files and directories using modern cryptographic hashing. The system leverages the BLAKE3 hashing algorithm for faster and more efficient integrity checks compared to traditional methods. It follows a modular architecture separating file discovery, baseline generation, and integrity verification, enabling scalability and flexibility. Built as a command-line tool, it provides reliable change detection and can be extended into larger intrusion detection systems. The project focuses on security, performance, and real-world applicability in system monitoring.',
    githubUrl: 'https://github.com/chhhee10/Aegis-Agent',
    deployUrl: '',
    sizeKb: 1260,
  },
  {
    id: 'air-quality-monitoring-system',
    name: 'Air Quality Monitoring System',
    description:
      'An IoT-based air quality monitoring system built using ESP32 and environmental sensors to track gas concentration, temperature, and humidity in real time. The system utilizes MQ-135 and DHT11 sensors to detect harmful gases and environmental conditions, providing continuous data collection. It features a WiFi-enabled web dashboard for live visualization and monitoring of sensor data. The project also incorporates on-device machine learning to classify air quality levels such as Good, Moderate, and Unhealthy for faster, low-latency insights. Designed for scalability, it supports data logging and model retraining using real-world environmental data.',
    githubUrl: 'https://github.com/chhhee10/Air-Quality-Monitoring-System',
    deployUrl: '',
    sizeKb: 1540,
  },
  {
    id: 'ar-camera-tracking-and-interpreter-app',
    name: 'AR Camera Tracking and Interpreter App',
    description:
      'An augmented reality application that uses camera-based tracking to detect and interpret visual inputs in real time. The system processes live video feed to identify patterns, objects, or markers and overlays relevant information or interactions on top of the camera view. It leverages computer vision techniques to track movement and maintain spatial consistency between virtual and real-world elements. Designed as an interactive prototype, the application demonstrates how AR can enhance user perception and contextual understanding. The project focuses on real-time performance, accuracy, and seamless integration between vision processing and user interaction.',
    githubUrl: 'https://github.com/chhhee10/AR-Camera-Tracking-and-Interpretor-App-',
    deployUrl: '',
    sizeKb: 1380,
  },
  {
    id: 'deep-space-communication-optimizer',
    name: 'Deep Space Communication Optimizer (Prototype)',
    description:
      'A prototype system designed to optimize deep space communication by improving data transmission efficiency under high-latency and noisy conditions. It explores techniques inspired by modern space communication systems, where long distances and signal degradation pose significant challenges. The system focuses on optimizing signal handling, transmission strategies, and error resilience to improve reliability. It simulates constraints such as delay, noise, and bandwidth limitations to evaluate performance. Designed as an experimental model, it demonstrates how intelligent optimization can enhance communication efficiency in extreme environments.',
    githubUrl: 'https://github.com/chhhee10/Deep-Space-Communication-Optimizer-Prototype-1',
    deployUrl: '',
    sizeKb: 1480,
  },
];

export default projects;
